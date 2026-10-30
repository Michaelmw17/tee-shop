// Applies the idempotent schema fixes (per-line uniqueness, CHECK constraints) to an existing database.
// Safe to run more than once. Usage: npm run db:harden
import { config } from 'dotenv';

// Load environment variables FIRST
config({ path: '.env.local' });

async function main() {
  const { initializeDatabase } = await import('../src/lib/db');
  await initializeDatabase();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
