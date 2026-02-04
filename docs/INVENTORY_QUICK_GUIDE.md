# Quick Inventory Update Template

Use this template to easily add your products to the inventory system.

## Your Current Example

You mentioned:
- M: 25 units total (Black: 12, Off-white: 12)
- L: 35 units total (Black: 18, Off-white: 18)  
- XL: 20 units total (Black: 10, Off-white: 10)

## Format for inventory.json

```json
{
  "PRODUCT_ID": {
    "Color-Size": quantity,
    "Color-Size": quantity
  }
}
```

## Your Inventory (Copy this to `src/data/inventory.json`)

```json
{
  "1": {
    "Black-M": 12,
    "Black-L": 18,
    "Black-XL": 10,
    "Off-white-M": 12,
    "Off-white-L": 18,
    "Off-white-XL": 10
  }
}
```

### Breakdown:
- **Product ID 1** (replace with your actual product)
- **Black:** M(12) + L(18) + XL(10) = 40 units
- **Off-white:** M(12) + L(18) + XL(10) = 40 units
- **Total:** 80 units

---

## Adding More Products

### Product 2 Example:

```json
{
  "1": {
    "Black-M": 12,
    "Black-L": 18,
    "Black-XL": 10,
    "Off-white-M": 12,
    "Off-white-L": 18,
    "Off-white-XL": 10
  },
  "2": {
    "Navy-S": 15,
    "Navy-M": 20,
    "Navy-L": 25,
    "Grey-S": 10,
    "Grey-M": 15,
    "Grey-L": 20
  }
}
```

---

## Common Scenarios

### Scenario 1: Restocking

Someone bought 5 Black M shirts, and you need to restock:

**Before:**
```json
"Black-M": 7
```

**After restocking 20 more:**
```json
"Black-M": 27
```

### Scenario 2: New Color Added

You got a new color "Olive" in stock:

```json
{
  "1": {
    "Black-M": 12,
    "Black-L": 18,
    "Black-XL": 10,
    "Off-white-M": 12,
    "Off-white-L": 18,
    "Off-white-XL": 10,
    "Olive-M": 15,
    "Olive-L": 20,
    "Olive-XL": 10
  }
}
```

**Don't forget to also add "Olive" to your product colors in `src/lib/products.ts`!**

### Scenario 3: Size Sold Out

Black XL sold out completely:

```json
"Black-XL": 0
```

The website will automatically:
- Show "SOLD OUT" on product page
- Gray out the size in the dropdown
- Prevent customers from ordering it

### Scenario 4: Multiple Products

You have 3 different t-shirt designs:

```json
{
  "1": {
    "Black-M": 12,
    "Black-L": 18,
    "Off-white-M": 12,
    "Off-white-L": 18
  },
  "2": {
    "Navy-M": 20,
    "Navy-L": 25,
    "White-M": 15,
    "White-L": 20
  },
  "3": {
    "Grey-M": 10,
    "Grey-L": 15,
    "Pink-M": 8,
    "Pink-L": 12
  }
}
```

---

## Quick Reference

### Color Names
Match EXACTLY with your products.ts file:
- ✅ "Black" (if product has "Black")
- ✅ "Off-white" (if product has "Off-white")
- ❌ "black" (wrong - case sensitive)
- ❌ "Off White" (wrong - must match exactly)

### Size Names
Match EXACTLY with your products.ts file:
- ✅ "M", "L", "XL" (if product has these)
- ✅ "XS", "S", "M", "L", "XL", "XXL" (if product has these)
- ❌ "Medium" (unless your products.ts uses "Medium")

### Product IDs
- Must match the `id` in your products.ts file
- Use quotes: `"1"`, `"2"`, `"3"` (not 1, 2, 3)

---

## Validation Checklist

Before saving your inventory.json:

- [ ] Product IDs match products.ts
- [ ] Color names match EXACTLY (case-sensitive)
- [ ] Size names match EXACTLY (case-sensitive)
- [ ] All quantities are numbers (no quotes)
- [ ] JSON syntax is valid (use a JSON validator if unsure)
- [ ] Every color-size combo for your products is included

---

## Pro Tips

1. **Start with realistic numbers** - Don't claim you have 1000 if you only have 100
2. **Use 0 for sold out** - Don't delete the line, just set to 0
3. **Keep backups** - Copy inventory.json before making big changes
4. **Test after editing** - Visit a product page to verify stock displays correctly
5. **Round numbers** - Customers don't need to know you have exactly 47, say 45 or 50

---

## Need Help?

- JSON not valid? Use: https://jsonlint.com/
- Colors not matching? Check `src/lib/products.ts`
- Sizes not matching? Check `src/lib/products.ts`
- Stock not updating? Check webhook is configured (see INVENTORY_TRACKING_SETUP.md)
