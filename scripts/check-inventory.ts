// Check all inventory levels
import { config } from 'dotenv';
import { neon } from '@neondatabase/serverless';

config({ path: '.env.development' });
const sql = neon(process.env.DATABASE_URL!);

async function checkInventory() {
  try {
    console.log('📊 Current inventory levels:\n');
    
    const result = await sql`
      SELECT product_id, color, size, stock, updated_at 
      FROM inventory 
      WHERE product_id = 7
      ORDER BY color, size
    `;
    
    console.table(result);
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

checkInventory();
