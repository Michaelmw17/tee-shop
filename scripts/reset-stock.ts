// Reset specific inventory item
import { config } from 'dotenv';
import { neon } from '@neondatabase/serverless';

// Load environment variables
config({ path: '.env.development' });

const sql = neon(process.env.DATABASE_URL!);

async function resetStock() {
  try {
    console.log('🔄 Resetting Off-white M stock to 40...');
    
    await sql`
      UPDATE inventory 
      SET stock = 40, updated_at = NOW() 
      WHERE product_id = 7 AND color = 'Off-white' AND size = 'M'
    `;
    
    const result = await sql`
      SELECT product_id, color, size, stock, updated_at 
      FROM inventory 
      WHERE product_id = 7 AND color = 'Off-white' AND size = 'M'
    `;
    
    console.log('✅ Updated:', result[0]);
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

resetStock();
