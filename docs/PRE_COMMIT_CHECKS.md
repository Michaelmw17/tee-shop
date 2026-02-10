# Pre-Commit Checks Setup

This project automatically runs security, TypeScript, and ESLint checks before every commit using **Husky** and **lint-staged**.

## What Happens on Commit

When you run `git commit`, the following checks run automatically:

### 1. 📘 TypeScript Type Checking
- Runs `tsc --noEmit` to check for TypeScript errors
- **Blocks commit** if type errors are found
- Fix: Resolve TypeScript errors in your code

### 2. 🔧 ESLint (Auto-fix)
- Runs ESLint on all staged `.js`, `.jsx`, `.ts`, `.tsx` files
- **Automatically fixes** fixable issues (formatting, unused imports, etc.)
- **Blocks commit** if unfixable errors remain
- Fixed files are automatically staged
- Fix: Run `npm run lint:fix` to see and fix all issues

### 3. 🔒 Security Audit
- Runs `npm audit --audit-level=moderate`
- Checks for known security vulnerabilities in dependencies
- **Blocks commit** if moderate+ vulnerabilities found
- Fix: Run `npm run security:fix` to auto-fix vulnerabilities

## Manual Commands

Run checks manually anytime:

```bash
# Run all checks at once
npm run validate

# Individual checks
npm run type-check        # TypeScript only
npm run lint             # ESLint check only
npm run lint:fix         # ESLint with auto-fix
npm audit                # Security audit
npm run security:fix     # Auto-fix security issues
```

## Bypassing Checks (Not Recommended)

Only in emergencies:
```bash
git commit --no-verify -m "your message"
```

## Configuration Files

- `.husky/pre-commit` - Pre-commit hook script
- `package.json` → `lint-staged` - Staged file checks
- `eslint.config.mjs` - ESLint rules
- `tsconfig.json` - TypeScript config

## Troubleshooting

### Commit blocked by TypeScript errors
```bash
npm run type-check
# Fix errors shown, then commit again
```

### Commit blocked by ESLint errors
```bash
npm run lint:fix
git add .
git commit -m "your message"
```

### Commit blocked by security vulnerabilities
```bash
npm run security:fix
# Review changes, test your app
git commit -m "your message"
```

### Pre-commit hook not running
```bash
npm run prepare  # Reinstall Husky hooks
```

## What Gets Auto-Fixed

- ✅ Code formatting (indentation, quotes, semicolons)
- ✅ Unused imports/variables
- ✅ Missing React dependencies in useEffect
- ✅ Some security vulnerabilities (npm audit fix)

## What Requires Manual Fixes

- ❌ TypeScript type errors
- ❌ Logic errors
- ❌ Complex ESLint violations
- ❌ Breaking dependency updates
