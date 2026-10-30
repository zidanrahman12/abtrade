# AB TRADE Quick Start Guide

Get the AB TRADE e-commerce platform running in 5 minutes.

## Prerequisites

- Node.js 18+ installed
- pnpm package manager
- Firebase account (free tier available)
- Gmail account (for Google OAuth)

## Step 1: Firebase Setup (5 minutes)

### Create Firebase Project

1. Go to https://console.firebase.google.com
2. Click "Add project"
3. Project name: `ab-trade`
4. Continue through setup
5. Create project

### Enable Services

**Firestore Database:**
1. Left menu → Build → Firestore Database
2. Click "Create database"
3. Choose location: Asia (Tokyo/Singapore)
4. Start in test mode
5. Create

**Authentication:**
1. Left menu → Build → Authentication
2. Click "Get Started"
3. Sign-in method: Email/Password → Enable
4. Sign-in method: Google
   - Copy Web SDK configuration
   - Enable
5. Add authorized domain (will add localhost:3000 for testing)

**Storage:**
1. Left menu → Build → Storage
2. Click "Get Started"
3. Start in test mode
4. Create

### Get Firebase Config

1. Click project settings (⚙️ icon)
2. Go to "General" tab
3. Scroll to "Your apps" section
4. Click "Web" icon
5. Copy configuration object

Example:
```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "ab-trade-xxxxx.firebaseapp.com",
  projectId: "ab-trade-xxxxx",
  storageBucket: "ab-trade-xxxxx.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:xxxxx"
}
```

## Step 2: Project Setup (3 minutes)

### Clone/Download Project

```bash
cd ab-trade  # Or your project directory
pnpm install
```

### Configure Environment

1. Copy environment template:
```bash
cp .env.example .env.local
```

2. Edit `.env.local` with your Firebase config:
```
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=ab-trade-xxxxx.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=ab-trade-xxxxx
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=ab-trade-xxxxx.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:xxxxx
```

## Step 3: Create Sample Data (2 minutes)

### Create Collections

In Firebase Console → Firestore:

1. **Create Collection: `categories`**
   - Add document with fields:
     ```
     name: "Garments Accessories"
     slug: "garments"
     description: "Buttons, zippers, thread, tags"
     image: "" (leave empty)
     productCount: 0
     createdAt: (server timestamp)
     updatedAt: (server timestamp)
     ```

2. **Create Collection: `products`**
   - Add sample product:
     ```
     name: "Premium Quality Buttons"
     slug: "premium-buttons"
     categoryId: (paste category document ID)
     shortDescription: "High-quality plastic buttons"
     description: "Made from durable plastic..."
     price: 500
     unit: "Dozen"
     stockQuantity: 100
     stockStatus: "in-stock"
     images: [] (empty array)
     featured: true
     specifications: {}
     createdAt: (server timestamp)
     updatedAt: (server timestamp)
     ```

3. **Create Collection: `admins`**
   - Add document with ID = your user UID
   - Add field: `role: "admin"`

4. **Create Collection: `users`** (auto-created on signup)

5. **Create Collection: `orders`** (auto-created on checkout)

6. **Create Collection: `messages`** (auto-created on contact form)

### Enable Security Rules

1. Firestore → Rules
2. Replace all text with content from `firebase.rules` file
3. Publish

4. Storage → Rules
5. Replace all text with content from `storage.rules` file
6. Publish

## Step 4: Run Development Server (1 minute)

```bash
pnpm dev
```

Open http://localhost:3000

## Quick Test Walkthrough

### 1. Test Public Pages
- Visit home page: http://localhost:3000
- Click "Products" → see products from Firestore
- Click on a product → see details page
- Visit "About" and "Contact" pages

### 2. Create Customer Account
- Click "Login" → "Sign up"
- Create account with email/password
- Or use Google login (if configured)
- Should redirect to dashboard

### 3. Test Shopping Cart
- Go to Products
- Click "Add to Cart" on any product
- Cart icon shows item count
- Click cart → see items
- Click "Proceed to Checkout"
- Fill delivery info
- Place order → see confirmation

### 4. View Orders
- After placing order, go to Dashboard
- See order with ID and status
- Click order to expand details

### 5. Access Admin Panel
- Make sure your user is admin (see Step 3)
- Visit http://localhost:3000/admin
- Should see dashboard with stats
- Navigate through Products, Orders, etc.

## Common Issues & Solutions

### "Firebase config missing" Error
- Check `.env.local` file exists
- Verify all env var names are correct
- Restart dev server: `pnpm dev`

### "Permission denied" on Firestore
- Check Security Rules are published
- Verify admin collection has your user UID
- Check rules match firebase.rules file

### "Google login not working"
- Add `http://localhost:3000` to Firebase Auth authorized domains
- Make sure Google auth is enabled in Firebase Console

### "Products not showing"
- Check products collection has data
- Verify collection name is exactly `products` (case-sensitive)
- Check Firestore Security Rules allow read

### "Can't access admin panel"
- Make sure you're logged in
- Verify your user UID is in `admins` collection
- Clear browser cache and logout/login

## Next Steps

### 1. Customize Company Info
- Edit `components/footer.tsx` - Update contact info
- Edit `components/ab-trade-logo.tsx` - Customize logo
- Edit `app/about/page.tsx` - Update company description

### 2. Add Your Products
- Go to Admin → Products
- Implement product creation form
- Or manually add via Firebase Console

### 3. Upload Product Images
- Products need images from Firebase Storage
- Upload to: `gs://your-bucket/products/`
- Add image URLs to product documents

### 4. Test Email Notifications (Optional)
- Set up Firebase Extensions or third-party service
- Configure order confirmation emails
- Send status update notifications

### 5. Deploy to Production
- Follow DEPLOYMENT.md guide
- Push to GitHub
- Connect to Vercel or Firebase Hosting
- Add production environment variables

## Important Notes

### Localhost Testing
- Google OAuth redirects won't work initially
- Add `http://localhost:3000` to Firebase Auth authorized domains
- Email/Password auth works fine for testing

### Admin Access
- Default role-based: Document in `admins` collection with user UID
- Multiple admins can be added
- Non-admins cannot access `/admin` routes

### Firebase Free Tier Limits
- 1GB storage free
- 50k read/write/delete operations per day free
- Increase limits if you exceed free tier
- Consider setting up billing alerts

## Testing Checklist

Before deploying to production:

- [ ] All public pages load correctly
- [ ] Products display from Firestore
- [ ] Search and filtering work
- [ ] Cart functionality works (add, remove, quantity)
- [ ] Checkout process works end-to-end
- [ ] Orders save to Firestore with correct data
- [ ] Customer dashboard shows orders
- [ ] Admin can view orders and update status
- [ ] Admin can manage products
- [ ] Security rules are published and working
- [ ] No console errors in browser DevTools
- [ ] Mobile responsive design works

## Support

- **Documentation**: See README.md and DEPLOYMENT.md
- **Firebase Docs**: https://firebase.google.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **Contact AB TRADE**: islamalamin1989@gmail.com, 01772-170145

## Common Command Reference

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Run linter
pnpm lint

# Update dependencies
pnpm update
```

## File Structure Quick Reference

```
ab-trade/
├── .env.local              # Your Firebase credentials (IMPORTANT: Don't commit!)
├── app/                    # Next.js app router pages
│   ├── page.tsx           # Home page
│   ├── products/          # Products page and details
│   ├── checkout/          # Checkout page
│   ├── dashboard/         # Customer dashboard
│   ├── admin/             # Admin panel
│   └── layout.tsx         # Root layout with navbar/footer
├── components/             # Reusable React components
├── lib/
│   ├── firebase.ts        # Firebase config and initialization
│   └── types.ts           # TypeScript type definitions
└── public/                # Static files
```

---

**You're all set! Start with `pnpm dev` and begin building with AB TRADE.**
