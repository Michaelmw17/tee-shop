# Windows Development Setup

This guide helps you run the Yogi store on Windows with the Neon Postgres database.

## Quick Start

### 1. Install Dependencies
```powershell
npm install
```

### 2. Run Development Server
```powershell
$env:NODE_TLS_REJECT_UNAUTHORIZED='0'; npm run dev
```

The site will be available at http://localhost:3000

## Why the Environment Variable?

Windows may have SSL certificate validation issues when connecting to Neon's Postgres database. Setting `NODE_TLS_REJECT_UNAUTHORIZED='0'` temporarily disables strict SSL verification for development.

**Note**: This is only needed for local Windows development. Production deployments on Vercel work perfectly without this setting.

## Alternative: PowerShell Profile

To avoid typing the command each time, add this to your PowerShell profile:

```powershell
# Open your profile
notepad $PROFILE

# Add this line:
$env:NODE_TLS_REJECT_UNAUTHORIZED='0'
```

Then you can just run:
```powershell
npm run dev
```

## Database Commands

### Run Migration (Transfer JSON → Postgres)
```powershell
$env:NODE_TLS_REJECT_UNAUTHORIZED='0'; npm run db:migrate
```

### Initialize Database Tables
```powershell
$env:NODE_TLS_REJECT_UNAUTHORIZED='0'; npm run db:init
```

## Production Deployment

When deploying to Vercel:
1. Add `DATABASE_URL` environment variable in Vercel dashboard
2. Value: (use the connection string from your Neon dashboard)
3. Deploy normally - SSL works automatically on Vercel

## Troubleshooting

### Error: "self-signed certificate in certificate chain"
- **Solution**: Use `$env:NODE_TLS_REJECT_UNAUTHORIZED='0'` before npm commands
- **Why**: Windows certificate store doesn't trust some Neon certificates

### Error: "Both middleware and proxy detected"
- **Solution**: Delete `src/middleware.ts` if it exists
- **Why**: Next.js 15+ uses `proxy.ts` instead of `middleware.ts`

### Error: "Port 3000 is in use"
- **Solution**: Kill all node processes
```powershell
taskkill /F /IM node.exe /T
```

## Security Notes

- Rate limiting: 30 requests per minute per IP
- Security headers automatically applied to all responses
- CORS configured for Stripe webhooks only
- Input validation on all API routes
- Inventory reservations expire after 30 minutes

## Next Steps

- Test checkout flow at http://localhost:3000/store
- Monitor inventory at your Neon dashboard
- Review [DATABASE_SETUP.md](./DATABASE_SETUP.md) for database details
