# Deploy to Vercel

## Quick Deploy

1. **Push to GitHub** (already done ✅)
   ```bash
   git push origin main
   ```

2. **Deploy to Vercel**
   - Go to https://vercel.com/new
   - Import `rajshah9305/NLPtoapp`
   - Add environment variables:
     - `CEREBRAS_API_KEY` = your Cerebras API key
     - `DATABASE_URL` = your Neon PostgreSQL URL
   - Click Deploy

## Or use Vercel CLI

```bash
npm i -g vercel
vercel login
vercel --prod
```

## Set Environment Variables in Vercel

```bash
vercel env add CEREBRAS_API_KEY
vercel env add DATABASE_URL
```

## Test Deployment

Once deployed, visit your Vercel URL and:
1. Enter a prompt like "counter app"
2. Watch AI agents generate code
3. See live preview on the right

---

**Repository:** https://github.com/rajshah9305/NLPtoapp
**Built by:** [Raj Shah](https://github.com/rajshah9305)
