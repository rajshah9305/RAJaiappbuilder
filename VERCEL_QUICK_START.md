# ⚡ Vercel Deployment - Quick Start

## 🎯 3-Step Deployment

### Step 1: Setup Cloud Services (5 minutes)

**PostgreSQL Database** (Choose one):
- **Neon** (Recommended): https://neon.tech → Create DB → Copy URL
- **Vercel Postgres**: Vercel Dashboard → Storage → Create

**Redis Cache**:
- **Upstash**: https://upstash.com → Create DB → Copy REST URL

### Step 2: Deploy to Vercel

```bash
# Option A: Automated Script
./deploy-vercel.sh

# Option B: Manual
npm i -g vercel
vercel login
vercel --prod
```

### Step 3: Configure Environment Variables

In **Vercel Dashboard → Settings → Environment Variables**, add:

```
DATABASE_URL=postgresql://[from-neon-or-vercel]
REDIS_URL=https://[from-upstash]
CEREBRAS_API_KEY=csk-48ey6ck36ccr6eep9hp4t8dkyhfn8858kmwwc9xx93h8kmc9
E2B_API_KEY=e2b_ab95837fb3d377f1893800f01fe4e5bbb5575225
NEXTAUTH_SECRET=dev_secret_key_12345
NEXTAUTH_URL=https://[your-vercel-url]
JWT_SECRET=dev_jwt_secret_12345
ENCRYPTION_KEY=dev_encryption_key_12345
GITHUB_TOKEN=your_github_token_here
VERCEL_TOKEN=your_vercel_token_here
```

Then redeploy: `vercel --prod`

---

## 🐛 Troubleshooting

**Build fails?**
```bash
# Check logs
vercel logs --follow
```

**Database error?**
- Verify DATABASE_URL is PostgreSQL (not SQLite)
- Format: `postgresql://user:pass@host:5432/db`

**Redis error?**
- Use Upstash REST URL (not TCP redis://)
- Install: `npm install @upstash/redis`

---

## 📞 Support

- Full guide: `DEPLOYMENT_FIX.md`
- Vercel docs: https://vercel.com/docs
- Issues: Check build logs in Vercel Dashboard

---

**Total time: ~10 minutes** ⚡
