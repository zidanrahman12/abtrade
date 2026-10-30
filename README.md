# AB TRADE - E-Commerce Platform

A professional, full-stack e-commerce website for AB TRADE, a Bangladesh-based garments and washing accessories supplier.

## Technology Stack

- **Frontend**: React 19, Next.js 16, TypeScript, Tailwind CSS
- **Backend**: Firebase (Authentication, Firestore, Storage)
- **State Management**: Zustand
- **Data Fetching**: SWR
- **UI Components**: Custom components + shadcn/ui
- **Notifications**: React Hot Toast

## Features

### Public Features
- Browse products with search and filtering
- View product details and specifications
- Add products to shopping cart
- User authentication (Email/Password + Google OAuth)
- Place orders with delivery information
- View order history and status
- Contact form for inquiries

### Customer Features
- User dashboard with order tracking
- View past orders with detailed information
- Order status updates (Pending, Confirmed, Processing, Shipped, Delivered, Cancelled)

### Admin Features
- Secure admin panel with role-based access
- Product management (Create, Read, Update, Delete)
- Category management
- Order management and status updates
- Customer management and viewing
- Dashboard with statistics

## Project Structure

```
ab-trade/
├── app/
│   ├── (home)/           # Home page
│   ├── admin/            # Admin panel
│   ├── products/         # Product catalog and details
│   ├── cart/             # Shopping cart
│   ├── checkout/         # Checkout process
│   ├── dashboard/        # Customer dashboard
│   ├── login/            # Authentication
│   ├── signup/           # Registration
│   ├── contact/          # Contact page
│   ├── about/            # About page
│   ├── layout.tsx        # Root layout
│   ├── page.tsx          # Home page
│   └── globals.css       # Global styles
├── components/           # Reusable components
│   ├── ui/              # UI components
│   ├── navbar.tsx       # Navigation
│   ├── footer.tsx       # Footer
│   ├── product-card.tsx # Product card
│   └── ...
├── hooks/               # Custom React hooks
│   ├── use-auth.ts     # Authentication hook
│   └── use-admin.ts    # Admin role hook
├── lib/
│   ├── firebase.ts     # Firebase config
│   ├── types.ts        # TypeScript types
│   ├── store.ts        # Zustand store (cart)
│   └── utils.ts        # Utility functions
└── public/             # Static assets
```

## Setup Instructions

### Prerequisites
- Node.js 18+ and pnpm
- Firebase project with Firestore, Storage, and Authentication enabled
- Google OAuth credentials (optional, for Google login)

### 1. Environment Configuration

Copy `.env.example` to `.env.local` and fill in your Firebase credentials:

```bash
cp .env.example .env.local
```

Edit `.env.local`:
```
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Firebase Setup

#### Create Firestore Collections

1. Go to Firebase Console → Firestore Database
2. Create the following collections:

**Collections to create:**
- `products` - Product catalog
- `categories` - Product categories
- `orders` - Customer orders
- `users` - User profiles
- `admins` - Admin user records
- `messages` - Contact form submissions

#### Enable Authentication

1. Firebase Console → Authentication
2. Enable: Email/Password, Google OAuth

#### Configure Storage

1. Firebase Console → Storage
2. Create default bucket
3. Set up security rules (see below)

### 4. Firebase Security Rules

#### Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Products - Public read, admin write
    match /products/{document=**} {
      allow read: if true;
      allow write: if isAdmin();
    }

    // Categories - Public read, admin write
    match /categories/{document=**} {
      allow read: if true;
      allow write: if isAdmin();
    }

    // Orders - Authenticated users can create, read own orders, admin can manage all
    match /orders/{document=**} {
      allow create: if request.auth != null;
      allow read: if request.auth.uid == resource.data.customerId || isAdmin();
      allow update: if isAdmin();
    }

    // Users - User can read/write own, admin can read all
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
      allow read: if isAdmin();
    }

    // Admins - Only admins can access
    match /admins/{document=**} {
      allow read: if isAdmin();
    }

    // Messages - Anyone can create, admin can read
    match /messages/{document=**} {
      allow create: if true;
      allow read: if isAdmin();
    }

    function isAdmin() {
      return request.auth != null && 
             exists(/databases/$(database)/documents/admins/$(request.auth.uid));
    }
  }
}
```

#### Firebase Storage Rules

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /products/{allPaths=**} {
      allow read: if true;
      allow write: if isAdmin();
    }
    
    match /categories/{allPaths=**} {
      allow read: if true;
      allow write: if isAdmin();
    }
    
    match /users/{allPaths=**} {
      allow read, write: if isAdmin();
    }

    function isAdmin() {
      return request.auth != null && 
             request.auth.uid in get(/databases/(default)/documents/admins/).data;
    }
  }
}
```

### 5. Set Up Admin Users

1. Create an admin user account via signup/login
2. In Firestore Console, go to `admins` collection
3. Create a document with `document ID = user_uid` with any data (e.g., `{role: "admin"}`)

### 6. Run Development Server

```bash
pnpm dev
```

Visit `http://localhost:3000`

## Admin Panel Access

- Admin URL: `http://localhost:3000/admin`
- Login with your admin account
- Dashboard shows: Total products, categories, orders, customers, pending orders
- Manage products, categories, orders, and customers

## Deployment

### Deploy to Vercel

1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel project settings
4. Deploy

```bash
vercel
```

### Deploy to Firebase Hosting

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Build Next.js project
pnpm build

# Deploy
firebase deploy
```

## Key Features Implementation

### Authentication
- Firebase Authentication handles user management
- Email/Password and Google OAuth supported
- Protected routes using `ProtectedRoute` component
- Admin verification using Firestore `admins` collection

### Shopping Cart
- Client-side cart state with Zustand
- Persisted to localStorage
- Items added with quantity management
- Cart cleared after successful order

### Orders
- Unique order IDs generated server-side
- Associated with authenticated user UID
- Status tracking: Pending → Confirmed → Processing → Shipped → Delivered
- Order details include all delivery information

### Admin Management
- Product CRUD operations (implement in `/admin/products`)
- Category management (implement in `/admin/categories`)
- Order status updates (implement in `/admin/orders`)
- Customer viewing (implement in `/admin/customers`)

## Customization

### Brand Colors
Update in `app/globals.css`:
- Primary: `#7FCC29` (Lime Green)
- Secondary: `#3B7BC4` (Steel Blue)

### Company Information
Update in:
- `components/footer.tsx`
- `app/contact/page.tsx`
- `app/about/page.tsx`

### Product Categories
Create via admin panel or add sample data in Firestore

## Troubleshooting

### Firebase Connection Issues
- Verify environment variables are set correctly
- Check Firebase project ID matches
- Ensure Firestore and Storage are enabled
- Check security rules allow access

### Authentication Issues
- Clear browser cache and cookies
- Verify Firebase Auth is enabled
- Check email verification requirements
- Verify Google OAuth credentials

### Admin Access Issues
- Verify user UID is added to `admins` collection
- Clear browser cache
- Re-login after admin status changes

## Support

For issues or questions, contact:
- **Email**: islamalamin1989@gmail.com
- **Phone**: 01772-170145
- **Address**: Ovijan-207, Auchpara College Road, Tongi, Gazipur-1230, Bangladesh

## License

This project is proprietary to AB TRADE. All rights reserved.
