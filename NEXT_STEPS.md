# 🚀 Next Steps - Deploy to Vercel

## ✅ Completed
- [x] Fixed vercel.json configuration
- [x] Setup Neon PostgreSQL database
- [x] Updated environment variables
- [x] Created deployment scripts

## 📋 Deploy Now (3 Steps)

### Step 1: Setup Upstash Redis (2 minutes)

1. Go to https://console.upstash.com/redis
2. Click **Create Database**
3. Name: `nlptoapp-redis`
4. Region: **us-east-1** (closest to Neon)
5. Click **Create**
6. Copy **REST URL** (looks like: `https://xxx.upstash.io`)

### Step 2: Deploy to Vercel (5 minutes)

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

### Step 3: Add Environment Variables in Vercel

Go to **Vercel Dashboard → Your Project → Settings → Environment Variables**

Add these 10 variables:

```bash
CEREBRAS_API_KEY=csk-48ey6ck36ccr6eep9hp4t8dkyhfn8858kmwwc9xx93h8kmc9
E2B_API_KEY=e2b_ab95837fb3d377f1893800f01fe4e5bbb5575225
DATABASE_URL=postgresql://neondb_owner@ep-little-term-a5jn438w-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require&host=pg.neon.tech
NEXTAUTH_SECRET=dev_secret_key_12345
NEXTAUTH_URL=https://your-vercel-url.vercel.app
REDIS_URL=https://your-upstash-url.upstash.io
JWT_SECRET=dev_jwt_secret_12345
ENCRYPTION_KEY=dev_encryption_key_12345
GITHUB_TOKEN=your_github_token_here
VERCEL_TOKEN=your_vercel_token_here
```

**Important:** Update `NEXTAUTH_URL` with your actual Vercel URL after first deployment.

Then redeploy:
```bash
vercel --prod
```

---

## 🎯 Quick Commands

```bash
# Test database locally
./test-db.sh

# Deploy to Vercel
./deploy-vercel.sh

# Check deployment status
vercel ls

# View logs
vercel logs
```

---

## 🔧 Optional: GitHub Actions Setup

For automatic PR preview deployments:

1. Go to **GitHub → Settings → Secrets and variables → Actions**
2. Add **Variable**: `NEON_PROJECT_ID` = `red-cloud-21047203`
3. Add **Secret**: `NEON_API_KEY` (get from Neon dashboard)

See `GITHUB_SECRETS_SETUP.md` for details.

---

## ✅ Verification Checklist

After deployment:

- [ ] Visit your Vercel URL
- [ ] Homepage loads correctly
- [ ] Try generating an app
- [ ] Check browser console (no errors)
- [ ] Test database connection
- [ ] Verify Redis caching works

---

## 🐛 Troubleshooting

**Build fails?**
```bash
vercel logs --follow
```

**Database error?**
- Verify DATABASE_URL in Vercel matches exactly
- Check Neon dashboard for connection issues

**Redis error?**
- Verify REDIS_URL is the REST URL from Upstash
- Install: `npm install @upstash/redis`

---

## 📞 Need Help?

- Full guide: `DEPLOYMENT_FIX.md`
- Quick start: `VERCEL_QUICK_START.md`
- Neon setup: `NEON_PASSWORDLESS.md`
- GitHub Actions: `GITHUB_SECRETS_SETUP.md`

---

**Ready to deploy? Run:** `vercel --prod` 🚀
