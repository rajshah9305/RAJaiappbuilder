#!/bin/bash

echo "🚀 Pushing cleaned project to GitHub..."
echo ""

# Check if git is initialized
if [ ! -d .git ]; then
    echo "📦 Initializing git repository..."
    git init
    git remote add origin https://github.com/rajshah9305/NLPtoapp.git
fi

# Ensure we're on main branch
echo "🔄 Switching to main branch..."
git checkout -b main 2>/dev/null || git checkout main

# Stage all changes
echo "📝 Staging changes..."
git add .

# Show what will be committed
echo ""
echo "📋 Files to be committed:"
git status --short

# Commit changes
echo ""
echo "💾 Committing changes..."
git commit -m "refactor: Clean up project structure and remove unnecessary files

- Remove Python backend (replaced by Next.js API routes)
- Remove Vite frontend (replaced by Next.js app)
- Remove Docker configuration (using Vercel deployment)
- Remove redundant documentation files
- Consolidate to essential Next.js structure
- Add PROJECT_STRUCTURE.md for clarity
- Enterprise-ready codebase with clean architecture"

# Push to GitHub
echo ""
echo "⬆️  Pushing to GitHub..."
git push -u origin main --force

echo ""
echo "✅ Successfully pushed to GitHub!"
echo ""
echo "🔗 Repository: https://github.com/rajshah9305/NLPtoapp"
echo ""
