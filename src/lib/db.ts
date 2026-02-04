// Database connection and schema
import { neon } from '@neondatabase/serverless';

// Initialize database connection with fetch options
// Note: For production on Vercel, this works fine. For local Windows development,
// you may need to set NODE_TLS_REJECT_UNAUTHORIZED=0 in your terminal
const sql = neon(process.env.DATABASE_URL!, {
  fetchOptions: {
    cache: 'no-store',
  }
});

// Database schema and initialization
export async function initializeDatabase() {
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

    // Create purchases table to track completed orders
    await sql`
      CREATE TABLE IF NOT EXISTS purchases (
        id SERIAL PRIMARY KEY,
        session_id VARCHAR(255) NOT NULL UNIQUE,
        product_id INTEGER NOT NULL,
        color VARCHAR(50) NOT NULL,
        size VARCHAR(10) NOT NULL,
        quantity INTEGER NOT NULL,
        unit_price DECIMAL(10, 2) NOT NULL,
        total_price DECIMAL(10, 2) NOT NULL,
        customer_email VARCHAR(255),
        customer_name VARCHAR(255),
        stripe_payment_id VARCHAR(255),
        created_at TIMESTAMP DEFAULT NOW()
      )
    `;

    // Create indexes for purchases
    await sql`
      CREATE INDEX IF NOT EXISTS idx_purchases_session 
      ON purchases(session_id)
    `;

    await sql`
      CREATE INDEX IF NOT EXISTS idx_purchases_product 
      ON purchases(product_id, color, size)
    `;

    await sql`
      CREATE INDEX IF NOT EXISTS idx_purchases_date 
      ON purchases(created_at DESC)
    `;

    console.log('✅ Database initialized successfully');
    return true;
  } catch (error) {
    console.error('❌ Database initialization error:', error);
    throw error;
  }
}

// Export the SQL client
export { sql };
