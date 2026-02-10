// Migration script: Transfer JSON data to Postgres
import { config } from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';
import { neon } from '@neondatabase/serverless';

// Load environment variables FIRST
config({ path: '.env.development' });

// Now initialize database connection
const sql = neon(process.env.DATABASE_URL!);

interface JSONInventory {
  [productId: string]: {
    [key: string]: number;
  };
}

async function initializeDatabase() {
  try {
    // Create inventory table
    await sql`
      CREATE TABLE IF NOT EXISTS inventory (
        id SERIAL PRIMARY KEY,
        product_id INTEGER NOT NULL,
        color VARCHAR(50) NOT NULL,
        size VARCHAR(10) NOT NULL,
        stock INTEGER NOT NULL DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW(),
        UNIQUE(product_id, color, size)
      )
    `;

    // Create index for faster lookups
    await sql`
      CREATE INDEX IF NOT EXISTS idx_inventory_lookup 
      ON inventory(product_id, color, size)
    `;

    // Create reservations table
    await sql`
      CREATE TABLE IF NOT EXISTS reservations (
        id SERIAL PRIMARY KEY,
        session_id VARCHAR(255) NOT NULL UNIQUE,
        product_id INTEGER NOT NULL,
        color VARCHAR(50) NOT NULL,
        size VARCHAR(10) NOT NULL,
        quantity INTEGER NOT NULL,
        expires_at BIGINT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `;

    // Create indexes for reservations
    await sql`
      CREATE INDEX IF NOT EXISTS idx_reservations_session 
      ON reservations(session_id)
    `;

    await sql`
      CREATE INDEX IF NOT EXISTS idx_reservations_expiry 
      ON reservations(expires_at)
    `;

    await sql`
      CREATE INDEX IF NOT EXISTS idx_reservations_product 
      ON reservations(product_id, color, size)
    `;

    console.log('✅ Database initialized successfully');
    return true;
  } catch (error) {
    console.error('❌ Database initialization error:', error);
    throw error;
  }
}

async function migrateInventory() {
  try {
    console.log('🚀 Starting database migration...\n');

    // Step 1: Initialize database (create tables)
    console.log('📋 Creating database tables...');
    await initializeDatabase();

    // Step 2: Read existing JSON inventory
    console.log('📂 Reading inventory.json...');
    const inventoryPath = path.join(process.cwd(), 'src', 'data', 'inventory.json');
    const inventoryData = fs.readFileSync(inventoryPath, 'utf-8');
    const inventory: JSONInventory = JSON.parse(inventoryData);

    // Step 3: Insert inventory data
    console.log('💾 Migrating inventory data...');
    let itemCount = 0;

    for (const [productId, variants] of Object.entries(inventory)) {
      for (const [key, stock] of Object.entries(variants)) {
        // Split from the right: "Off-white-M" -> ["Off-white", "M"]
        const lastDashIndex = key.lastIndexOf('-');
        const color = key.substring(0, lastDashIndex);
        const size = key.substring(lastDashIndex + 1);
        
        await sql`
          INSERT INTO inventory (product_id, color, size, stock)
          VALUES (${parseInt(productId)}, ${color}, ${size}, ${stock})
          ON CONFLICT (product_id, color, size) 
          DO UPDATE SET stock = ${stock}, updated_at = NOW()
        `;

        itemCount++;
        console.log(`  ✓ Product ${productId}: ${color} ${size} - ${stock} items`);
      }
    }

    console.log(`\n✅ Successfully migrated ${itemCount} inventory items`);

    // Step 4: Verify migration
    console.log('\n🔍 Verifying migration...');
    const result = await sql`SELECT COUNT(*) as count FROM inventory`;
    console.log(`  Database contains ${result[0].count} inventory records`);

    // Step 5: Show sample data
    console.log('\n📊 Sample inventory data:');
    const sample = await sql`
      SELECT product_id, color, size, stock 
      FROM inventory 
      LIMIT 5
    `;
    console.table(sample);

    console.log('\n🎉 Migration completed successfully!');
    console.log('\n⚠️  IMPORTANT: Update your code to use the database version:');
    console.log('   - Import from @/lib/inventory-db instead of @/lib/inventory');
    console.log('   - Add DATABASE_URL to your environment variables');

  } catch (error) {
    console.error('\n❌ Migration failed:', error);
    process.exit(1);
  }
}

// Run migration
migrateInventory()
  .then(() => {
    console.log('\n✨ All done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
