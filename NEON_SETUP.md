# 🐘 Neon Database Setup

## Your Neon Project
- **Project ID**: red-cloud-21047203
- **Region**: us-east-2 (AWS)

## 📋 Get Your Connection String

1. Go to https://console.neon.tech/app/projects/red-cloud-21047203
2. Click **Connection Details**
3. Copy the **Connection String**
4. It looks like:
   ```
   postgresql://neondb_owner:PASSWORD@ep-red-cloud-21047203.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```

## 🔧 Add to Vercel

In **Vercel Dashboard → Environment Variables**, add:

```
DATABASE_URL=postgresql://neondb_owner:YOUR_PASSWORD@ep-red-cloud-21047203.us-east-2.aws.neon.tech/neondb?sslmode=require
```

Replace `YOUR_PASSWORD` with your actual Neon password.

## ✅ Test Connection

```bash
# Update .env with your Neon URL
# Then run:
npx prisma db push
```

## 🚀 Deploy

```bash
vercel --prod
```
