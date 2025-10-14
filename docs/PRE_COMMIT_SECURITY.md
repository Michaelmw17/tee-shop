# Pre-Commit Security Configuration
## 🔒 Automatic Security Scanning

This project automatically scans for vulnerabilities before every commit using:

### ✅ Pre-Commit Hooks Enabled:

1. **Dependency Vulnerability Scan**: `npm audit --audit-level=moderate`
2. **Code Linting**: ESLint with security rules
3. **File Content Scan**: Checks for hardcoded secrets/keys
4. **Commit Message Scan**: Warns about sensitive keywords

### 🛠️ Available Commands:

```bash
# Manual security checks
npm run security:audit         # Check vulnerabilities
npm run security:fix          # Auto-fix vulnerabilities  
npm run security:check        # Full security + build test
npm run security:pre-commit   # Pre-commit security scan
npm run security:scan-files   # Scan files for secrets

# Lint and format
npm run lint                  # Run ESLint
npm run pre-commit           # Run lint-staged checks
```

### 🚫 What Gets Blocked:

- **High/Critical vulnerabilities** in dependencies
- **Linting errors** in TypeScript/JavaScript files
- **Commit messages** containing sensitive keywords
- **Files** with potential hardcoded secrets

### 🔧 Bypass (Emergency Only):

```bash
# Skip pre-commit hooks (NOT RECOMMENDED)
git commit --no-verify -m "emergency commit"

# Fix vulnerabilities first
npm audit fix
npm run security:fix
```

### 📊 Security Levels:

- **Moderate+**: Blocks commits (recommended)
- **High+**: Production deployment blocks
- **Critical**: Immediate fix required

### 🎯 Best Practices:

1. **Always** run `npm run security:check` before pushing
2. **Never** commit secrets or API keys
3. **Fix vulnerabilities** before committing
4. **Use environment variables** for sensitive data
5. **Review** security warnings carefully
6. **Project-specific Git identity** configured (Michaelmw17 <michaelmw17@outlook.com.au>)

## 🔍 What's Scanned:

### Files:
- `*.js, *.jsx, *.ts, *.tsx` - Linted and security checked
- `package.json` - Dependency vulnerabilities
- All files - Secret scanning

### Patterns Detected:
- `password`, `secret`, `key=`, `token`
- `api_key`, `auth`, `credentials`
- Hard-coded URLs with credentials
- Environment variables in code

### Commit Messages:
- Sensitive keywords detection
- Warning prompts for manual review

---

**🛡️ Security Status: ENABLED ✅**

Every commit is automatically scanned for security issues!