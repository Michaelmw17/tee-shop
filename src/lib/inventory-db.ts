// Database-backed inventory management
import { sql, transaction } from './db';

export interface Inventory {
  [productId: string]: {
    [key: string]: number; // "color-size": quantity
  };
}

interface InventoryRow {
  product_id: number;
  color: string;
  size: string;
  stock: number;
}

interface ColorRow {
  color: string;
}

interface StockRow {
  stock: number;
}

interface ReservedRow {
  reserved: number;
}

interface CommandResult {
  rowCount: number;
  rows: unknown[];
  length?: number;
}

// Get inventory for all products (for migration/admin)
export async function getInventory(): Promise<Inventory> {
  try {
    const rows = await sql`SELECT product_id, color, size, stock FROM inventory`;
    
    const inventory: Inventory = {};
    for (const row of rows as InventoryRow[]) {
      const productId = row.product_id.toString();
      if (!inventory[productId]) {
        inventory[productId] = {};
      }
      const key = `${row.color}-${row.size}`;
      inventory[productId][key] = row.stock;
    }
    
    return inventory;
  } catch (error) {
    console.error('Error reading inventory:', error);
    return {};
  }
}

// Get stock for a specific variant
export async function getStock(productId: number, color: string, size: string): Promise<number> {
  try {
    const result = await sql`
      SELECT stock 
      FROM inventory 
      WHERE product_id = ${productId} 
        AND color = ${color} 
        AND size = ${size}
    `;
    
    return (result as StockRow[])[0]?.stock || 0;
  } catch (error) {
    console.error('Error getting stock:', error);
    return 0;
  }
}

// Set stock for a specific variant (for initial setup)
export async function setStock(productId: number, color: string, size: string, stock: number): Promise<boolean> {
  try {
    await sql`
      INSERT INTO inventory (product_id, color, size, stock)
      VALUES (${productId}, ${color}, ${size}, ${stock})
      ON CONFLICT (product_id, color, size) 
      DO UPDATE SET stock = ${stock}, updated_at = NOW()
    `;
    return true;
  } catch (error) {
    console.error('Error setting stock:', error);
    return false;
  }
}

// Clean up expired reservations
export async function cleanupExpiredReservations(): Promise<void> {
  const now = Date.now();
  
  try {
    const result = await sql`
      DELETE FROM reservations 
      WHERE expires_at < ${now}
    ` as unknown as CommandResult;
    
    if (result.rowCount && result.rowCount > 0) {
      console.log(`🧹 Cleaned up ${result.rowCount} expired reservations`);
    }
  } catch (error) {
    console.error('Error cleaning up reservations:', error);
  }
}

// Get reserved quantity for a product variant
async function getReservedQuantity(productId: number, color: string, size: string): Promise<number> {
  await cleanupExpiredReservations();
  
  try {
    const result = await sql`
      SELECT COALESCE(SUM(quantity), 0) as reserved
      FROM reservations
      WHERE product_id = ${productId}
        AND color = ${color}
        AND size = ${size}
        AND expires_at > ${Date.now()}
    `;
    
    return Number((result as ReservedRow[])[0]?.reserved || 0);
  } catch (error) {
    console.error('Error getting reserved quantity:', error);
    return 0;
  }
}

// Get available stock (total - reserved)
export async function getAvailableStock(productId: number, color: string, size: string): Promise<number> {
  const totalStock = await getStock(productId, color, size);
  const reserved = await getReservedQuantity(productId, color, size);
  return Math.max(0, totalStock - reserved);
}

// Serialises reservations so two buyers cannot both claim the last unit
const RESERVE_LOCK_KEY = 481516;

// Reserve stock for a checkout session.
// The availability check and the insert are one statement, run while holding an advisory lock
// inside a transaction, so concurrent checkouts cannot oversell.
export async function reserveStock(
  sessionId: string,
  items: Array<{ id: number; color: string; size: string; qty: number }>
): Promise<{ success: boolean; errors: string[] }> {
  try {
    const now = Date.now();
    const expiresAt = now + (30 * 60 * 1000); // 30 minutes
    const lines = JSON.stringify(
      items.map(item => ({ product_id: item.id, color: item.color, size: item.size, qty: item.qty }))
    );

    const results = await transaction((tx) => [
      tx`SELECT pg_advisory_xact_lock(${RESERVE_LOCK_KEY})`,
      tx`DELETE FROM reservations WHERE expires_at < ${now}`,
      tx`
        INSERT INTO reservations (session_id, product_id, color, size, quantity, expires_at)
        SELECT ${sessionId}, r.product_id, r.color, r.size, r.qty, ${expiresAt}
        FROM jsonb_to_recordset(${lines}::jsonb) AS r(product_id int, color text, size text, qty int)
        WHERE NOT EXISTS (
          SELECT 1
          FROM jsonb_to_recordset(${lines}::jsonb) AS q(product_id int, color text, size text, qty int)
          WHERE COALESCE((
                  SELECT i.stock FROM inventory i
                  WHERE i.product_id = q.product_id AND i.color = q.color AND i.size = q.size
                ), 0)
              - COALESCE((
                  SELECT SUM(v.quantity) FROM reservations v
                  WHERE v.product_id = q.product_id AND v.color = q.color AND v.size = q.size
                    AND v.expires_at > ${now}
                ), 0)
              < q.qty
        )
        RETURNING id
      `,
    ]);

    const inserted = results[2] as unknown[];
    if (inserted.length !== items.length) {
      return { success: false, errors: ['Some items are no longer available in the requested quantity'] };
    }

    return { success: true, errors: [] };
  } catch (error) {
    console.error('Error in reserveStock:', error);
    return { success: false, errors: ['Unable to reserve stock right now'] };
  }
}

// Release reservation when session expires or is cancelled
export async function releaseReservation(sessionId: string): Promise<boolean> {
  try {
    const result = await sql`
      DELETE FROM reservations 
      WHERE session_id = ${sessionId}
    ` as unknown as CommandResult;

    if (result.rowCount && result.rowCount > 0) {
      console.log(`✅ Released reservation for session ${sessionId}`);
      return true;
    }

    console.log(`⚠️ No reservation found for session ${sessionId}`);
    return false;
  } catch (error) {
    console.error('Error releasing reservation:', error);
    return false;
  }
}

// Update inventory after successful payment
export async function updateInventory(
  productId: number,
  color: string,
  size: string,
  quantity: number
): Promise<boolean> {
  try {
    const result = await sql`
      UPDATE inventory 
      SET stock = stock - ${quantity}, updated_at = NOW()
      WHERE product_id = ${productId} 
        AND color = ${color} 
        AND size = ${size}
        AND stock >= ${quantity}
    ` as unknown as CommandResult;

    if (result.rowCount && result.rowCount > 0) {
      console.log(`✅ Updated inventory: Product ${productId}, ${color}-${size}, reduced by ${quantity}`);
      return true;
    } else {
      console.error(`❌ Failed to update inventory - insufficient stock or product not found`);
      return false;
    }
  } catch (error) {
    console.error('Error updating inventory:', error);
    return false;
  }
}

// Validate cart stock before checkout
export function validateCartStock(items: Array<{
  id: number;
  color: string;
  size: string;
  qty: number;
}>): Promise<{ valid: boolean; errors: string[] }> {
  return (async () => {
    await cleanupExpiredReservations();
    const errors: string[] = [];

    for (const item of items) {
      const available = await getAvailableStock(item.id, item.color, item.size);

      if (available < item.qty) {
        errors.push(
          `Product ${item.id} (${item.color} ${item.size}): Only ${available} available, but ${item.qty} requested`
        );
      }
    }

    return {
      valid: errors.length === 0,
      errors
    };
  })();
}

// Get low stock warning message
export async function getLowStockWarning(
  productId: number,
  color: string,
  size: string
): Promise<string | null> {
  const available = await getAvailableStock(productId, color, size);

  if (available === 0) return 'SOLD OUT';
  if (available === 1) return 'Only 1 left!';
  if (available <= 3) return `Only ${available} left!`;
  if (available <= 10) return `${available} items remaining`;
  if (available <= 15) return `Low stock - ${available} remaining`;

  return null;
}

// Get available colors for a product
export async function getAvailableColors(productId: number, allColors: string[]): Promise<string[]> {
  try {
    const result = await sql`
      SELECT DISTINCT color
      FROM inventory
      WHERE product_id = ${productId}
        AND stock > 0
    `;

    const availableColors = (result as ColorRow[]).map((row) => row.color);
    return allColors.filter(color => availableColors.includes(color));
  } catch (error) {
    console.error('Error getting available colors:', error);
    return allColors;
  }
}

// Get available sizes for a product color
export async function getAvailableSizes(
  productId: number,
  color: string,
  allSizes: string[]
): Promise<string[]> {
  try {
    const sizes = await Promise.all(
      allSizes.map(async size => {
        const available = await getAvailableStock(productId, color, size);
        return available > 0 ? size : null;
      })
    );

    return sizes.filter((size): size is string => size !== null);
  } catch (error) {
    console.error('Error getting available sizes:', error);
    return allSizes;
  }
}
