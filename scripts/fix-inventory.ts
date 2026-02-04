// Fix inventory - remove bad entries
import { config } from 'dotenv';
import { neon } from '@neondatabase/serverless';

config({ path: '.env.development' });
const sql = neon(process.env.DATABASE_URL!);

async function fixInventory() {
  try {
    console.log('🔧 Removing bad inventory entry...\n');
    
    // Delete the bad row where color='Off' and size='white'
    await sql`
      DELETE FROM inventory 
      WHERE product_id = 7 AND color = 'Off' AND size = 'white'
    `;
    
    console.log('✅ Deleted bad entry (Off / white)\n');
    
    // Show current inventory
    const result = await sql`
      SELECT product_id, color, size, stock 
      FROM inventory 
      WHERE product_id = 7
      ORDER BY color, size
    `;
    
    console.log('📊 Current inventory:');
    console.table(result);
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

fixInventory();
