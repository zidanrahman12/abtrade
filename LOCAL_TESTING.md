# Local Testing Guide - AB TRADE Platform

Complete walkthrough to test all features locally before deployment.

## Prerequisites

- Node.js 18+ and pnpm installed
- Firebase project with credentials
- `.env.local` configured with Firebase credentials
- Google account (for testing Google auth)

## Setup (If Not Already Done)

```bash
# 1. Install dependencies
pnpm install

# 2. Start dev server
pnpm dev
```

Server runs at http://localhost:3000

## Test Checklist

### 1. Public Pages Navigation

**Test**: All pages load and display correctly

```bash
# ✓ Visit each page:
- http://localhost:3000 (Home)
- http://localhost:3000/products (Products catalog)
- http://localhost:3000/about (About page)
- http://localhost:3000/contact (Contact page)
```

**Expected Results**:
- Homepage shows hero section, categories, featured products
- Products page shows search & filter options
- All links work correctly
- No console errors
- Responsive on mobile/tablet

### 2. Product Browsing

**Test**: Product catalog features

```bash
# Prerequisites: Add sample product to Firestore first (see below)

- Click "Products" in navbar
- Wait for products to load
- Search for a product
- Filter by category
- Click on product to view details
- Check product images, specs, price
```

**Expected Results**:
- Products load from Firestore
- Search filters correctly by name/description
- Category filter works
- Product details display all information
- "Add to Cart" button is clickable

### 3. Authentication Flow

**Test**: User registration and login

#### 3a. Email/Password Signup

```bash
- Go to http://localhost:3000/login
- Click "Sign up" link
- Fill form:
  - Name: John Doe
  - Email: test@example.com
  - Password: Test@123456
  - Confirm: Test@123456
- Click "Create Account"
```

**Expected Results**:
- Account created
- Redirects to dashboard
- User document appears in Firestore `users` collection
- User UID matches `auth.currentUser.uid`

#### 3b. Email/Password Login

```bash
- Click Logout (or navigate to login)
- Enter same email and password
- Click "Log In"
```

**Expected Results**:
- Logs in successfully
- Redirects to dashboard
- Navbar shows user name

#### 3c. Google OAuth (Optional)

```bash
- Go to login page
- Click "Continue with Google"
- Sign in with your Google account
```

**Expected Results**:
- Google popup opens
- Signs in successfully
- Creates user document in Firestore
- Redirects to dashboard

**Note**: Google auth requires adding `http://localhost:3000` to Firebase Auth authorized domains.

### 4. Shopping Cart Flow

**Test**: Add to cart, quantity management, persistence

```bash
- Go to Products page
- Click "Add to Cart" on any product
- Verify:
  - Cart icon shows item count (1)
  - Toast notification says "Added to cart!"
- Add same product again
  - Quantity should increase to 2
- Add different product
  - Cart should show 2 different items
- Click cart icon to view cart page
```

**Expected Results**:
- Items add to cart correctly
- Quantity increases if same item added
- Cart persists after page reload (localStorage)
- Cart shows correct items and quantities
- Total price calculated correctly

**Test Cart Management**:
```bash
- On cart page:
  - Click minus button to decrease quantity
  - Click plus button to increase quantity
  - Click trash icon to remove item
  - "Continue Shopping" button goes to products
```

**Expected Results**:
- Quantity updates correctly
- Total recalculates
- Item removes from cart
- Navigation works

### 5. Checkout & Order Placement

**Test**: Checkout form and order submission

**Prerequisites**: Must be logged in and have items in cart

```bash
- Go to http://localhost:3000/cart
- Click "Proceed to Checkout"
- Verify you're logged in (if not, login first)
- Fill checkout form:
  - Full Name: John Doe
  - Email: john@example.com
  - Phone: 01712345678
  - Company: (optional) ABC Company
  - Delivery Address: 123 Main Street, Apt 4B
  - City: Dhaka
  - Notes: (optional) Please ring bell
- Click "Place Order"
```

**Expected Results**:
- Form validates (all required fields)
- Order submitted
- Success page shows with Order ID
- Order appears in Firestore `orders` collection
- Order contains:
  - Correct customer info
  - All cart items
  - Correct total amount
  - Status: "pending"
  - Timestamp: current time

**Test Order Confirmation**:
```bash
- You should see:
  - Success message
  - Order ID (e.g., ORDER-1234567890)
  - Buttons: "View My Orders", "Continue Shopping"
- Click "View My Orders"
- Should see your order in dashboard
```

### 6. Customer Dashboard

**Test**: Order history and tracking

```bash
- Go to http://localhost:3000/dashboard
  OR click account icon → Dashboard
```

**Expected Results**:
- Page shows "Welcome, [Your Name]"
- Shows profile information (Name, Email)
- Shows all your orders
- Each order shows:
  - Order ID
  - Date created
  - Status badge (Pending)
  - Item count
  - Total amount

**Test Order Details**:
```bash
- Click on an order to expand
- Should see:
  - Customer info
  - Delivery address
  - List of items with quantities and prices
  - Total amount
  - Ability to update status (admin only)
```

### 7. Admin Access

**Prerequisites**: Your user must be admin

1. Add yourself as admin in Firestore:
   - Go to Firebase Console → Firestore
   - Create/edit `admins` collection
   - Add document with:
     - Document ID: Your user UID
     - Field: `role: "admin"` (or any data)

```bash
- Logout and login again to refresh permissions
- Go to http://localhost:3000/admin
```

**Expected Results**:
- Admin dashboard loads
- Shows statistics:
  - Total Products
  - Categories
  - Total Orders
  - Customers
  - Pending Orders
- All numbers should be correct

### 8. Admin Product Management

```bash
- Click "Products" in admin sidebar
- Should see list of all products
- For each product:
  - Name, Category, Price, Stock, Actions
- Click "Edit" button (if implemented)
- Click trash icon to delete (confirmation dialog)
- Click "Add Product" (if implemented)
```

**Expected Results**:
- Products list loads
- Correct data displayed
- Delete confirmation appears
- Product removes after confirmation
- Lists updates in real-time

### 9. Admin Order Management

```bash
- Click "Orders" in admin sidebar
- Should see list of all orders
- For each order:
  - Order ID, Date, Status, Customer, Total
- Click on order to expand details
- Click status buttons to update (Pending, Confirmed, Processing, etc.)
```

**Expected Results**:
- All orders display
- Can expand to see details
- Can update status
- Status changes immediately
- Orders in Firestore update

### 10. Contact Form

```bash
- Go to http://localhost:3000/contact
- Fill form:
  - Name: John Doe
  - Email: john@example.com
  - Phone: 01712345678
  - Subject: Inquiry about bulk orders
  - Message: I'm interested in bulk orders for my business
- Click "Send Message"
```

**Expected Results**:
- Toast shows "Message sent successfully!"
- Form clears
- Message appears in Firestore `messages` collection:
  - All fields saved
  - Timestamp recorded
  - Admin can view via admin panel

### 11. Responsive Design

**Test**: Mobile and tablet views

```bash
# Chrome DevTools:
- Press F12
- Click device toolbar icon
- Test different devices:
  - iPhone 12
  - iPad
  - Desktop
```

**Expected Results**:
- All pages responsive
- Mobile menu works (hamburger icon)
- Touch-friendly buttons
- Text readable on all sizes
- No horizontal scrolling (except intentional)
- Images scale properly

### 12. Error Handling

**Test**: Error states and messages

```bash
# Test missing Firebase config:
- Remove Firebase variables from .env.local
- Try to load a page
- Should show Firebase error

# Test invalid product:
- Go to http://localhost:3000/products/invalid-slug
- Should show "Product Not Found"

# Test unauthorized admin access:
- Logout
- Try to access http://localhost:3000/admin
- Should redirect to login

# Test cart without being logged in:
- Clear localStorage (DevTools → Application)
- Go to checkout
- Should redirect to login
```

**Expected Results**:
- Proper error messages shown
- Redirects to appropriate pages
- No crashes or blank screens

## Browser Console Checks

### No Errors Expected

```javascript
// Open DevTools Console (F12)
// Should see NO red errors
// May see warnings (acceptable)
```

**Common warnings (acceptable)**:
- Deprecation notices
- Analytics warnings
- Third-party script warnings

**Errors to investigate**:
- Anything mentioning Firebase auth/credentials
- Network errors
- TypeError/ReferenceError
- "Cannot read property" errors

## Database Verification

### Check Firestore Data

1. Firebase Console → Firestore
2. Verify each collection:

**products**:
- [ ] Has at least 1 product
- [ ] Fields correct (name, slug, price, etc.)
- [ ] Images array populated

**categories**:
- [ ] Has at least 1 category
- [ ] Matches product categoryId

**users**:
- [ ] New user created on signup
- [ ] Email matches
- [ ] Timestamps recorded

**orders**:
- [ ] New order created after checkout
- [ ] Contains all items
- [ ] Status is "pending"
- [ ] Timestamps correct
- [ ] customerId matches user UID

**admins**:
- [ ] Contains your user UID
- [ ] Can access admin panel

**messages**:
- [ ] New message after contact form
- [ ] All fields populated
- [ ] Timestamp recorded

## Performance Testing

### Page Load Times

Using Chrome DevTools (F12 → Network):

**Target Load Times**:
- Homepage: < 3 seconds
- Products page: < 2 seconds
- Product details: < 2 seconds
- Checkout: < 2 seconds
- Admin dashboard: < 2 seconds

### Bundle Size

Using `pnpm build`:

**Expected sizes**:
- Main bundle: ~200-300KB
- CSS: ~50-100KB
- JS chunks: < 100KB each

## Common Issues & Fixes

### Issue: "Firebase Config Missing"
**Fix**: Check `.env.local` file
```bash
cp .env.example .env.local
# Fill in Firebase credentials
pnpm dev  # Restart server
```

### Issue: "Can't access admin panel"
**Fix**: Ensure you're an admin
```bash
# Firebase Console → Firestore → admins collection
# Create document with your user UID
# Then logout/login again
```

### Issue: "Products not loading"
**Fix**: Create sample data
```bash
# Firebase Console → Firestore
# Create 'products' collection
# Add 1 document with proper fields
```

### Issue: "Cart not saving"
**Fix**: Check localStorage
```javascript
// DevTools Console:
localStorage.getItem('cart-storage')  // Should see data
```

### Issue: "Google auth not working"
**Fix**: Add localhost to authorized domains
```bash
# Firebase Console → Authentication → Settings
# Add to Authorized Domains:
# - localhost:3000
# - 127.0.0.1:3000
```

## Testing Data Cleanup

After testing, clean up Firestore data:

```bash
# Delete test orders:
# Firebase Console → Firestore → orders
# Delete test documents

# Delete test users:
# Keep your admin user, delete test accounts
# Firebase Console → Authentication → Delete users

# Keep sample products for next test session
```

## Final Verification

Before declaring testing complete:

- [ ] All pages load without errors
- [ ] Authentication works (email & Google)
- [ ] Shopping cart works (add, remove, persist)
- [ ] Checkout completes and saves order
- [ ] Customer dashboard shows order
- [ ] Admin panel loads and shows stats
- [ ] Admin can view and update orders
- [ ] Contact form sends messages
- [ ] No console errors
- [ ] Mobile responsive design works
- [ ] All Firestore data correct
- [ ] Security rules working

## Sign-Off

When all checks pass:

✓ **Local testing complete and verified**
✓ **Ready for staging/production deployment**

---

**Test Date**: [Your Date]
**Tested By**: [Your Name]
**Issues Found**: [Number]
**All Tests Passed**: [Yes/No]
