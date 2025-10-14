# Project Git Configuration
## 🎯 Repository-Specific Git Settings

This project uses different Git credentials than your global settings:

### ✅ Project Settings (This Repository Only):
- **Username**: `Michaelmw17`
- **Email**: `michaelmw17@outlook.com.au`

### 🌍 Global Settings (All Other Projects):
- **Username**: `MichaW03` 
- **Email**: `michael.watt@greenstone.com.au`

## 🔧 How This Was Set Up:

```bash
# Set project-specific username (local to this repo only)
git config user.name "Michaelmw17"

# Set project-specific email (local to this repo only)
git config user.email "michaelmw17@outlook.com.au"
```

## ✅ Verification:

```bash
# Check local (project) settings
git config --list --local | findstr user

# Check global settings (unchanged)
git config --global --list | findstr user
```

## 📋 Notes:

- These settings only apply to **this repository**
- All other Git repositories on your machine will continue using the global settings
- Commits from this project will be attributed to `Michaelmw17 <michaelmw17@outlook.com.au>`
- The `.git/config` file stores these local settings

## 🔄 To Change Back (if needed):

```bash
# Remove local settings (reverts to global)
git config --unset user.name
git config --unset user.email

# Or set different local settings
git config user.name "YourNewName"
git config user.email "your.new.email@example.com"
```

---

**✅ Configuration Status: Project-specific Git identity configured successfully!**