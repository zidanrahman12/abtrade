# AB TRADE Deployment Guide

Complete guide for deploying AB TRADE e-commerce platform to production.

## Pre-Deployment Checklist

- [ ] Firebase project created and configured
- [ ] Firestore database set up with all collections
- [ ] Storage bucket created and configured
- [ ] Authentication (Email/Password + Google OAuth) enabled
- [ ] Security rules configured (see firebase.rules and storage.rules)
- [ ] Admin user created and added to admins collection
- [ ] Environment variables set in production
- [ ] Brand information updated (company details, logo)
- [ ] Product categories created
- [ ] Sample products added (optional)
- [ ] Contact form email configured
- [ ] HTTPS enabled on production domain

## Deployment Options

### Option 1: Deploy to Vercel (Recommended)

**Advantages:**
- Automatic deployments on git push
- Serverless functions support
- Next.js optimized
- Free tier available
- Environmental variables management
- Preview deployments

**Steps:**

1. **Push to GitHub**
```bash
git remote add origin https://github.com/yourusername/ab-trade.git
git push -u origin main
```

2. **Connect to Vercel**
   - Go to https://vercel.com/new
   - Import your GitHub repository
   - Select Next.js framework
   - Add environment variables

3. **Configure Environment Variables**
   - In Vercel project settings → Environment Variables
   - Add all variables from `.env.example`:
     ```
     NEXT_PUBLIC_FIREBASE_API_KEY
     NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
     NEXT_PUBLIC_FIREBASE_PROJECT_ID
     NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
     NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
     NEXT_PUBLIC_FIREBASE_APP_ID
     ```

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Visit your production URL

### Option 2: Deploy to Firebase Hosting

**Prerequisites:**
- Firebase CLI installed: `npm install -g firebase-tools`
- Authenticated: `firebase login`

**Steps:**

1. **Initialize Firebase Hosting**
```bash
firebase init hosting
```
Choose:
- Use existing project: Select your Firebase project
- Public directory: `out`
- Configure as single-page app: No
- Set up automatic builds: No

2. **Build Next.js Project**
```bash
pnpm build
pnpm export  # For static export
# Or use Firebase Hosting with Cloud Functions for server-side rendering
```

3. **Deploy**
```bash
firebase deploy
```

### Option 3: Deploy to Custom Server (Docker)

**Dockerfile:**
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install

COPY . .

RUN pnpm build

EXPOSE 3000

CMD ["pnpm", "start"]
```

**Build and Run:**
```bash
docker build -t ab-trade .
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_FIREBASE_API_KEY=xxxx \
  -e NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=xxxx \
  # ... other env vars
  ab-trade
```

## Post-Deployment Setup

### 1. Configure Custom Domain

**For Vercel:**
- Vercel Dashboard → Settings → Domains
- Add your domain
- Update DNS records as shown

**For Firebase:**
- Firebase Console → Hosting
- Add domain
- Verify ownership
- Update DNS records

### 2. Set Up Google OAuth Redirect URIs

1. Go to Google Cloud Console
2. Select your project
3. APIs & Services → Credentials
4. Edit OAuth 2.0 Client ID
5. Add authorized redirect URIs:
   - https://yourdomain.com
   - https://yourdomain.com/auth/callback (if applicable)

### 3. Configure Firebase Security Rules

1. Firebase Console → Firestore Database → Rules
2. Copy rules from `firebase.rules`
3. Paste and publish

4. Firebase Console → Storage → Rules
5. Copy rules from `storage.rules`
6. Paste and publish

### 4. Create Admin Users

1. Have admin user register via /signup
2. Get their Firebase UID from Authentication console
3. Firestore → admins collection → Create document
4. Document ID: `{user_uid}`
5. Add field: `role: "admin"` or any data

### 5. Send Welcome Email (Optional)

Set up email notifications for:
- New orders
- Order status updates
- Customer inquiries

Use Firebase Extensions or third-party services.

## Performance Optimization

### 1. Enable Caching

**Vercel:**
- Automatic cache headers
- Configure in `next.config.mjs`

**Custom:**
- Set Cache-Control headers
- Implement CDN (Cloudflare, BunnyCDN)

### 2. Image Optimization

- Already enabled with Next.js Image component
- Images are automatically optimized
- Verify in production with DevTools

### 3. Database Indexing

Firestore automatically creates composite indexes.

For custom queries, create indexes via Firebase Console:
1. Firestore → Indexes
2. Check recommended indexes
3. Create suggested indexes

### 4. Monitor Performance

**Tools:**
- Google Lighthouse
- WebPageTest
- Firebase Performance Monitoring
- Vercel Analytics

## Security Hardening

### 1. Enable HTTPS

- Vercel: Automatic
- Firebase Hosting: Automatic
- Custom: Use Let's Encrypt

### 2. Update Security Headers

Already configured in `next.config.mjs`

### 3. Set Up DDoS Protection

- Cloudflare (free tier)
- Firebase DDoS protection
- Vercel security

### 4. Regular Backups

**Firestore Backups:**
```bash
gcloud firestore export gs://your-bucket/backup-$(date +%Y%m%d)
```

Schedule via Cloud Scheduler

### 5. Monitor Activity

- Enable audit logging
- Set up alerts
- Monitor failed auth attempts

## Troubleshooting Deployment

### Build Fails
```bash
pnpm build  # Test locally first
# Check logs for errors
# Verify all dependencies installed
# Check for TypeScript errors
```

### Environment Variables Not Working
- Verify all vars set in production
- Check variable names exactly
- Use NEXT_PUBLIC_ prefix for client-side vars
- Redeploy after adding vars

### Authentication Issues
- Verify Firebase config correct
- Check Google OAuth redirect URIs
- Clear browser cache
- Check Firebase rules

### Database Connection Issues
- Verify Firestore rules allow access
- Check Firebase project ID
- Test with Firebase emulator locally
- Check firestore.indexes.json

## Monitoring & Maintenance

### Set Up Alerts

**Firebase:**
- Go to Cloud Monitoring
- Create alert policies
- Monitor: CPU, Memory, Errors, Read/Write operations

**Vercel:**
- Set up log drain
- Monitor deployment logs
- Configure error notifications

### Regular Updates

```bash
# Update dependencies monthly
pnpm update
pnpm audit fix

# Test in staging
pnpm build
pnpm dev

# Deploy to production
git push origin main
```

### Database Maintenance

- Monitor Firestore usage
- Clean up old data (messages, expired sessions)
- Optimize indexes
- Archive old orders

## Support & Help

For deployment issues:

1. Check logs
2. Review error messages
3. Test locally with emulator
4. Check Firebase documentation
5. Contact support

### Firebase Support
- https://firebase.google.com/support
- Firebase Discord Community

### Vercel Support
- https://vercel.com/support

### Contact AB TRADE
- Email: islamalamin1989@gmail.com
- Phone: 01772-170145
