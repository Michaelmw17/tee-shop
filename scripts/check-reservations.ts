import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables from .env.development
dotenv.config({ path: path.resolve(process.cwd(), '.env.development') });

const sql = neon(process.env.DATABASE_URL!);

async function checkReservations() {
  console.log('\n🔒 Checking Current Reservations...\n');

  const reservations = await sql`
    SELECT 
      session_id,
      product_id,
      color,
      size,
      quantity,
      created_at,
      expires_at,
      CASE 
        WHEN expires_at > EXTRACT(EPOCH FROM NOW()) * 1000 THEN 'Active'
        ELSE 'Expired'
      END as status
    FROM reservations
    ORDER BY created_at DESC
  `;

  if (reservations.length === 0) {
    console.log('No reservations found.\n');
    return;
  }

  console.log(`Found ${reservations.length} reservation(s):\n`);
  
  const now = Date.now();
  
  reservations.forEach((res) => {
    const expiresAt = new Date(Number(res.expires_at));
    const createdAt = new Date(res.created_at);
    const minutesRemaining = Math.ceil((Number(res.expires_at) - now) / (1000 * 60));
    
    console.log(`Session: ${res.session_id}`);
    console.log(`  Product ID: ${res.product_id}`);
    console.log(`  Variant: ${res.color} - ${res.size}`);
    console.log(`  Quantity: ${res.quantity}`);
    console.log(`  Reserved At: ${createdAt.toLocaleString()}`);
    console.log(`  Expires At: ${expiresAt.toLocaleString()}`);
    console.log(`  Status: ${res.status}`);
    if (res.status === 'Active') {
      console.log(`  Time Remaining: ${minutesRemaining} minutes`);
    }
    console.log('');
  });
}

checkReservations().catch(console.error);
