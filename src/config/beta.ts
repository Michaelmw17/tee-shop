// 🚀 BETA LAUNCH CONFIGURATION
// Toggle features on/off for your beta launch and gradual expansion

// ============================================
// 🎯 MAIN BETA MODE TOGGLE
// ============================================
// Set to true: Show only beta product, hide categories, simplified experience
// Set to false: Show full catalog, all categories, complete store
export const BETA_MODE = true;

// ============================================
// 📦 BETA PRODUCT CONFIGURATION
// ============================================
// Which product(s) to show during beta launch
// Product IDs from src/lib/products.ts
export const BETA_ENABLED_PRODUCTS = [
  7  // Cashmere Blend Tee (premium T-shirt) - replace this with your actual product
];

// Your beta product details (for easy reference)
export const BETA_PRODUCT = {
  id: 7,
  name: "Premium Cotton Tee",
  description: "100% cotton, responsibly sourced, finished locally",
  specs: "240-260 GSM, regular premium fit",
  colors: ["Black", "Off-White"],
  totalUnits: 80,
  priceTarget: 6000,  // $6k-$7k target
  maxBudget: 8000
};

// ============================================
// 🎨 FEATURE FLAGS
// ============================================
export const BETA_FEATURES = {
  // Navigation
  showCategoryNav: false,        // Hide category navigation in navbar
  showAllProductsLink: false,    // Hide "View All" link
  showShopTab: false,            // Hide "Shop" tab in navbar for beta
  
  // Store Pages
  showCategoryPages: false,      // Disable /store/category/* routes
  showStoreGrid: false,          // Hide category grid on /store
  redirectStoreToProduct: true,  // Redirect /store to beta product
  
  // Product Features
  allowMultipleProducts: false,  // Only show beta product(s)
  showComingSoon: true,          // Show "more coming soon" message
  
  // Checkout
  enableCheckout: true,          // Keep checkout enabled
  showCartIcon: true,            // Keep cart visible
};

// ============================================
// 📝 BETA MESSAGING
// ============================================
export const BETA_MESSAGES = {
  storeTitle: "Premium Cotton Tee - Beta Launch",
  storeSubtitle: "100% cotton • Responsibly sourced • Finished locally",
  comingSoon: "More styles coming soon. Join us for the first drop!",
  soldOut: "This beta run is sold out. Join our list for the next drop.",
};

// ============================================
// 🔧 QUICK EXPANSION GUIDE
// ============================================
/*
TO EXPAND YOUR STORE:

Option 1 - Full Launch (flip everything on):
  1. Set BETA_MODE = false
  2. Done! Full catalog enabled

Option 2 - Gradual Expansion (add products one by one):
  1. Keep BETA_MODE = true
  2. Add product IDs to BETA_ENABLED_PRODUCTS: [7, 8, 9]
  3. Update BETA_FEATURES as needed
  4. When ready for full catalog, set BETA_MODE = false

Option 3 - Exit Beta, Keep Some Features:
  1. Set BETA_MODE = false
  2. Manually adjust BETA_FEATURES for specific controls
*/
