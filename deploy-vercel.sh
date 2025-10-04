#!/bin/bash

echo "🚀 NLP-to-App Vercel Deployment"
echo "================================"
echo ""

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

echo "✅ Vercel CLI ready"
echo ""

# Check for required environment variables
echo "🔍 Checking configuration..."
if [ ! -f ".env" ]; then
    echo "⚠️  Warning: .env file not found"
fi

echo ""
echo "📋 Pre-deployment checklist:"
echo "   1. ✅ vercel.json configured"
echo "   2. ✅ package.json build script updated"
echo "   3. ⚠️  Setup PostgreSQL database (Neon/Vercel Postgres)"
echo "   4. ⚠️  Setup Redis (Upstash)"
echo "   5. ⚠️  Add environment variables in Vercel Dashboard"
echo ""

read -p "Have you completed steps 3-5? (y/n) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo ""
    echo "📖 Please complete the setup first:"
    echo ""
    echo "1. PostgreSQL Database:"
    echo "   - Neon: https://neon.tech (Free)"
    echo "   - Vercel Postgres: https://vercel.com/storage/postgres"
    echo ""
    echo "2. Redis:"
    echo "   - Upstash: https://upstash.com (Free)"
    echo ""
    echo "3. Environment Variables:"
    echo "   - Add in Vercel Dashboard after importing project"
    echo ""
    echo "See DEPLOYMENT_FIX.md for detailed instructions"
    exit 1
fi

echo ""
echo "🚀 Starting deployment..."
echo ""

# Login to Vercel
echo "🔐 Logging in to Vercel..."
vercel login

echo ""
echo "📤 Deploying to production..."
vercel --prod

echo ""
echo "✅ Deployment complete!"
echo ""
echo "📝 Next steps:"
echo "   1. Copy your Vercel URL"
echo "   2. Update NEXTAUTH_URL in Vercel environment variables"
echo "   3. Redeploy: vercel --prod"
echo ""
