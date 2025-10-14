This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

# Tee Shop

## Project Setup

1. **Install dependencies:**
	```bash
	npm install
	```
2. **Environment variables:**
	- Copy `.env.local` and fill in your secrets (see sample in repo).
3. **Code formatting:**
	- Uses Prettier (`config/.prettierrc`) and ESLint (`config/eslint.config.mjs`).
	- Format code: `npx prettier --config config/.prettierrc --write .`
4. **Testing:**
	- Run tests: `npm test`
	- Jest config in `config/jest.config.js` and setup in `config/jest.setup.js`.

## Environment Variables

- Store secrets in `.env.local` (never commit to Git).
- Example:
  ```env
  DATABASE_URL=your_database_url_here
  NEXT_PUBLIC_API_URL=https://api.example.com
  STRIPE_SECRET_KEY=your_stripe_secret_key_here
  ```

## Vercel Deployment

- Push your repo to GitHub.
- Import to Vercel and set environment variables in the dashboard.
- Custom config in `config/vercel.json`.

## Code Quality

- ESLint and Prettier are set up for consistent code style (see `config/`).
- TypeScript for type safety (`config/tsconfig.json`).

## Testing

- Jest and React Testing Library are set up (see `config/jest.config.js`).
- Add tests in `src/__tests__` or alongside components.

## Accessibility & SEO

- Use semantic HTML and ARIA attributes.
- Optimize meta tags for SEO.

## Image Optimization

- Use Next.js `<Image />` for product images.
- See image config in `config/next.config.ts`.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
