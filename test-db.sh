#!/bin/bash

# Test Neon Database Connection

export DATABASE_URL="postgresql://neondb_owner@ep-little-term-a5jn438w-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require&host=pg.neon.tech"

echo "🔍 Testing Neon connection..."
npx prisma db push --skip-generate

echo ""
echo "✅ Database connection successful!"
