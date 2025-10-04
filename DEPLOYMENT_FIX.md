# 🚀 Vercel Deployment Fix Guide

## Issues Found & Fixed

### 1. ❌ Incorrect vercel.json Configuration
**Problem**: Configured for monorepo but project is Next.js at root  
**Fixed**: Simplified to Next.js framework detection

### 2. ❌ SQLite Database Won't Work on Vercel
**Problem**: `file:./dev.db` doesn't work in serverless environment  
**Solution**: Use cloud database (see below)

### 3. ❌ Localhost Redis URL
**Problem**: `redis://localhost:6379` won't work in production  
**Solution**: Use Upstash Redis (see below)

---

## 🎯 Quick Deployment Steps

### Option A: Deploy with Vercel CLI (Fastest)

```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Login to Vercel
vercel login

# 3. Deploy
vercel --prod
```

### Option B: Deploy via Vercel Dashboard

1. Go to https://vercel.com/new
2. Import your GitHub repository
3. Framework: **Next.js** (auto-detected)
4. Root Directory: `./`
5. Add environment variables (see below)
6. Click **Deploy**

---

## 🔧 Required Setup Before Deployment

### 1. Setup PostgreSQL Database (Required)

**Option A: Vercel Postgres (Recommended)**
```bash
# In Vercel Dashboard:
# Storage → Create Database → Postgres
# Copy the DATABASE_URL automatically
```

**Option B: Neon (Free Tier)**
1. Go to https://neon.tech
2. Create free account
3. Create database
4. Copy connection string
5. Add to Vercel env vars as `DATABASE_URL`

### 2. Setup Redis (Required)

**Upstash Redis (Free Tier)**
1. Go to https://upstash.com
2. Create free account
3. Create Redis database
4. Copy REST URL
5. Add to Vercel env vars as `REDIS_URL`

---

## 📋 Environment Variables for Vercel

Add these in **Vercel Dashboard → Project Settings → Environment Variables**:

```bash
# Required - Already have these
CEREBRAS_API_KEY=csk-48ey6ck36ccr6eep9hp4t8dkyhfn8858kmwwc9xx93h8kmc9
E2B_API_KEY=e2b_ab95837fb3d377f1893800f01fe4e5bbb5575225
NEXTAUTH_SECRET=dev_secret_key_12345
JWT_SECRET=dev_jwt_secret_12345
ENCRYPTION_KEY=dev_encryption_key_12345
GITHUB_TOKEN=your_github_token_here
VERCEL_TOKEN=your_vercel_token_here

# Update after setup
DATABASE_URL=postgresql://user:password@host/database?sslmode=require
REDIS_URL=https://your-redis-url.upstash.io
NEXTAUTH_URL=https://your-project.vercel.app
```

---

## 🚀 Deployment Commands

### Deploy to Production
```bash
vercel --prod
```

### Deploy Preview
```bash
vercel
```

### Check Deployment Status
```bash
vercel ls
```

### View Logs
```bash
vercel logs
```

---

## ✅ Post-Deployment Steps

### 1. Update NEXTAUTH_URL
After first deployment:
1. Copy your Vercel URL (e.g., `https://your-project.vercel.app`)
2. Update `NEXTAUTH_URL` in Vercel environment variables
3. Redeploy: `vercel --prod`

### 2. Run Database Migrations
```bash
# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push
```

### 3. Test Your Deployment
- Visit your Vercel URL
- Test app generation
- Check browser console for errors

---

## 🐛 Common Deployment Errors & Fixes

### Error: "Module not found"
```bash
# Fix: Ensure all dependencies are in package.json
npm install
git add package.json package-lock.json
git commit -m "Update dependencies"
git push
```

### Error: "Database connection failed"
```bash
# Fix: Verify DATABASE_URL is set correctly
# Must be PostgreSQL, not SQLite
# Format: postgresql://user:password@host:5432/database
```

### Error: "Build timeout"
```bash
# Fix: Optimize build in next.config.js
# Add to next.config.js:
experimental: {
  outputFileTracingIncludes: {
    '/api/**/*': ['./node_modules/**/*.wasm', './node_modules/**/*.node'],
  },
}
```

### Error: "Redis connection failed"
```bash
# Fix: Use Upstash Redis REST API
# Install: npm install @upstash/redis
# Update code to use REST instead of TCP
```

---

## 📦 Alternative: Deploy Without Database/Redis

If you want to deploy quickly without external services:

### 1. Update package.json
```json
{
  "scripts": {
    "build": "next build",
    "postinstall": "prisma generate || true"
  }
}
```

### 2. Make Database Optional
Create `src/lib/db-optional.ts`:
```typescript
import { PrismaClient } from '@prisma/client'

export const db = process.env.DATABASE_URL 
  ? new PrismaClient()
  : null

export const isDbAvailable = !!db
```

### 3. Update API Routes
```typescript
import { db, isDbAvailable } from '@/lib/db-optional'

export async function POST(req: Request) {
  if (!isDbAvailable) {
    return Response.json({ error: 'Database not configured' }, { status: 503 })
  }
  // ... rest of code
}
```

---

## 🎯 Recommended Production Setup

### Free Tier Services
- **Hosting**: Vercel (Free)
- **Database**: Neon PostgreSQL (Free 0.5GB)
- **Redis**: Upstash (Free 10K commands/day)
- **Total Cost**: $0/month

### Paid Tier (For Production)
- **Hosting**: Vercel Pro ($20/month)
- **Database**: Neon Scale ($19/month)
- **Redis**: Upstash Pro ($10/month)
- **Total Cost**: $49/month

---

## 📞 Need Help?

### Check Build Logs
```bash
vercel logs --follow
```

### Check Deployment Status
```bash
vercel inspect [deployment-url]
```

### Vercel Support
- Docs: https://vercel.com/docs
- Discord: https://vercel.com/discord
- GitHub: https://github.com/vercel/vercel/discussions

---

## ✨ Quick Deploy Checklist

- [ ] Fixed vercel.json ✅
- [ ] Setup PostgreSQL database
- [ ] Setup Redis (Upstash)
- [ ] Add all environment variables to Vercel
- [ ] Run `vercel --prod`
- [ ] Update NEXTAUTH_URL after deployment
- [ ] Test the deployed app
- [ ] Run database migrations

---

**Your project is now ready to deploy! 🚀**

Run: `vercel --prod`
