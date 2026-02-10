import fs from 'fs';
import path from 'path';
import { Inventory } from '@/types/product';

const inventoryPath = path.join(process.cwd(), 'src', 'data', 'inventory.json');
const reservationsPath = path.join(process.cwd(), 'src', 'data', 'reservations.json');

interface Reservation {
  sessionId: string;
  productId: number;
  color: string;
  size: string;
  quantity: number;
  expiresAt: number; // Unix timestamp
}

// Read current inventory from JSON file
export function getInventory(): Inventory {
  try {
    const data = fs.readFileSync(inventoryPath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading inventory:', error);
    return {};
  }
}

// Read reservations
function getReservations(): Reservation[] {
  try {
    const data = fs.readFileSync(reservationsPath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading reservations:', error);
    return [];
  }
}

// Write reservations
function saveReservations(reservations: Reservation[]): void {
  try {
    fs.writeFileSync(reservationsPath, JSON.stringify(reservations, null, 2));
  } catch (error) {
    console.error('Error saving reservations:', error);
  }
}

// Clean up expired reservations
export function cleanupExpiredReservations(): void {
  const now = Date.now();
  const reservations = getReservations();
  const validReservations = reservations.filter(r => r.expiresAt > now);
  
  if (validReservations.length < reservations.length) {
    console.log(`🧹 Cleaned up ${reservations.length - validReservations.length} expired reservations`);
    saveReservations(validReservations);
  }
}

// Get reserved quantity for a product variant
function getReservedQuantity(productId: number, color: string, size: string): number {
  cleanupExpiredReservations();
  const reservations = getReservations();
  
  return reservations
    .filter(r => r.productId === productId && r.color === color && r.size === size)
    .reduce((total, r) => total + r.quantity, 0);
}

// Get available stock (total - reserved)
export function getAvailableStock(productId: number, color: string, size: string): number {
  const totalStock = getStock(productId, color, size);
  const reserved = getReservedQuantity(productId, color, size);
  return Math.max(0, totalStock - reserved);
}

// Reserve stock for a checkout session
export function reserveStock(sessionId: string, items: Array<{
  id: number;
  color: string;
  size: string;
  qty: number;
}>): { success: boolean; errors: string[] } {
  try {
    cleanupExpiredReservations();
    const errors: string[] = [];
    const expiresAt = Date.now() + (30 * 60 * 1000); // 30 minutes from now (Stripe minimum)
    
    console.log('🔒 Attempting to reserve stock for session:', sessionId);
    
    // Validate all items have available stock before reserving
    for (const item of items) {
      const available = getAvailableStock(item.id, item.color, item.size);
      console.log(`📊 Available stock check: Product ${item.id}, ${item.color}-${item.size}: ${available} available, ${item.qty} requested`);
      
      if (available < item.qty) {
        errors.push(
          `${item.color} ${item.size} - Only ${available} available (you requested ${item.qty})`
        );
      }
    }
    
    if (errors.length > 0) {
      console.error('❌ Reservation failed - insufficient stock:', errors);
      return { success: false, errors };
    }
    
    // Create reservations
    const reservations = getReservations();
    for (const item of items) {
      reservations.push({
        sessionId,
        productId: item.id,
        color: item.color,
        size: item.size,
        quantity: item.qty,
        expiresAt
      });
    }
    
    saveReservations(reservations);
    console.log(`✅ Reserved stock for session ${sessionId}`);
    
    return { success: true, errors: [] };
  } catch (error) {
    console.error('❌ Error in reserveStock:', error);
    return { success: false, errors: [`System error: ${error instanceof Error ? error.message : 'Unknown error'}`] };
  }
}

// Release reservation when session expires or is cancelled
export function releaseReservation(sessionId: string): boolean {
  try {
    const reservations = getReservations();
    const filteredReservations = reservations.filter(r => r.sessionId !== sessionId);
    
    if (filteredReservations.length < reservations.length) {
      saveReservations(filteredReservations);
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

// Get stock for a specific product variant
export function getStock(productId: number, color: string, size: string): number {
  const inventory = getInventory();
  const key = `${color}-${size}`;
  const productKey = productId.toString();
  
  console.log('🔎 getStock called:', { productId, color, size, key, productKey });
  console.log('📦 Product inventory:', inventory[productKey]);
  console.log('📊 Stock for key:', inventory[productKey]?.[key]);
  
  return inventory[productKey]?.[key] || 0;
}

// Check if a product variant is in stock
export function isInStock(productId: number, color: string, size: string, quantity: number = 1): boolean {
  const stock = getStock(productId, color, size);
  return stock >= quantity;
}

// Get total stock for a product (all variants)
export function getTotalStock(productId: number): number {
  const inventory = getInventory();
  const productInventory = inventory[productId.toString()];
  
  if (!productInventory) return 0;
  
  return Object.values(productInventory).reduce((total, stock) => total + stock, 0);
}

// Get available colors for a product (colors that have any stock)
export function getAvailableColors(productId: number, allColors: string[]): string[] {
  const inventory = getInventory();
  const productInventory = inventory[productId.toString()];
  
  if (!productInventory) return allColors;
  
  const availableColors = new Set<string>();
  
  Object.keys(productInventory).forEach(key => {
    if (productInventory[key] > 0) {
      const [color] = key.split('-');
      availableColors.add(color);
    }
  });
  
  return allColors.filter(color => availableColors.has(color));
}

// Get available sizes for a product and color
export function getAvailableSizes(productId: number, color: string, allSizes: string[]): string[] {
  const inventory = getInventory();
  const productInventory = inventory[productId.toString()];
  
  if (!productInventory) return allSizes;
  
  return allSizes.filter(size => {
    const key = `${color}-${size}`;
    return (productInventory[key] || 0) > 0;
  });
}

// Update inventory after a purchase
export function updateInventory(productId: number, color: string, size: string, quantity: number): boolean {
  try {
    const inventory = getInventory();
    const key = `${color}-${size}`;
    const productKey = productId.toString();
    
    if (!inventory[productKey] || !inventory[productKey][key]) {
      console.error(`Inventory not found for product ${productId}, ${color}-${size}`);
      return false;
    }
    
    const currentStock = inventory[productKey][key];
    
    if (currentStock < quantity) {
      console.error(`Insufficient stock for product ${productId}, ${color}-${size}. Requested: ${quantity}, Available: ${currentStock}`);
      return false;
    }
    
    // Reduce stock
    inventory[productKey][key] = currentStock - quantity;
    
    // Write back to file
    fs.writeFileSync(inventoryPath, JSON.stringify(inventory, null, 2));
    
    console.log(`✅ Inventory updated: Product ${productId}, ${color}-${size}: ${currentStock} → ${currentStock - quantity}`);
    return true;
  } catch (error) {
    console.error('Error updating inventory:', error);
    return false;
  }
}

// Check if all items in cart are in stock (considering reservations)
export function validateCartStock(items: Array<{
  id: number;
  color: string;
  size: string;
  qty: number;
}>): { valid: boolean; errors: string[] } {
  cleanupExpiredReservations();
  const errors: string[] = [];
  
  for (const item of items) {
    const available = getAvailableStock(item.id, item.color, item.size);
    
    if (available < item.qty) {
      errors.push(
        `${item.color} ${item.size} - Only ${available} available (you have ${item.qty} in cart)`
      );
    }
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

// Get low stock warning threshold
export function getLowStockWarning(productId: number, color: string, size: string): string | null {
  const availableStock = getAvailableStock(productId, color, size);
  
  console.log('⚠️ getLowStockWarning:', { productId, color, size, available: availableStock });
  
  if (availableStock === 0) return 'SOLD OUT';
  if (availableStock === 1) return 'Only 1 left!';
  if (availableStock <= 3) return `Only ${availableStock} left!`;
  if (availableStock <= 10) return `${availableStock} items remaining`;
  if (availableStock <= 15) return `Low stock - ${availableStock} remaining`;
  
  return null;
}
