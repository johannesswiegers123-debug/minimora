# Eco Packaging App - Setup & Deployment

This is a Shopify App with theme app extension. When installed, it adds a "Eco Packaging" block to the Apps section in theme editor.

---

## For You (Developer/Store Owner)

### Deploy to Shopify

```bash
npm run dev
```

This starts the development server and connects to your Shopify development store.

### Deploy to Production

1. Build the app:
   ```bash
   npm run build
   ```

2. Deploy to Shopify:
   ```bash
   shopify app deploy
   ```

3. Copy the app URL from the output and update `application_url` in `shopify.app.toml`

---

## For Your Customers (After App is Published)

### Installation (30 seconds)

1. **Install the app** from Shopify App Store
   - Search for "Eco Packaging"
   - Click "Add app"

2. **Create discount code** in Shopify Admin:
   - Go to **Discounts**
   - Click **Create discount** → **Automatic discount**
   - Set: Code `ECO5`, Type `Percentage`, Value `5%`, Status `Active`
   - Save

3. **Add block to product pages** in theme editor:
   - Go to **Themes** → **Edit code**
   - Click **Add section** in any product page template
   - Under **Apps**, find **Eco Packaging**
   - Click to add it above "Add to cart" button
   - Save

### Done!

Customers now see the toggle on product pages. When they select "Minimal packaging" and add to cart, the 5% discount auto-applies.

---

## How the App Works

**Component:** Theme App Extension (React block)  
**Location:** Product pages (via theme editor)  
**Discount:** Auto-applies code `ECO5` to cart  
**Persistence:** Saves choice in browser localStorage  

---

## Tech Stack

- **Frontend:** React with Shopify theme extension
- **Backend:** Node.js with React Router (for future expansion)
- **Styling:** CSS with Dark mode support
- **Persistence:** Browser localStorage + Shopify cart attributes

---

## File Structure

```
extensions/
└── eco-packaging-theme/        # Theme app extension
    ├── shopify.extension.toml   # Extension config
    ├── src/
    │   ├── EcoPackagingBlock.jsx # React component
    │   └── EcoPackagingBlock.css # Styling
    └── package.json
```

---

**Version:** 1.0.0  
**Status:** Ready for deployment
