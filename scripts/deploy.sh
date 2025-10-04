#!/bin/bash

# NLP-to-App Platform Deployment Script
# This script deploys the application to production

set -e

echo "🚀 Deploying NLP-to-App Platform..."

# Check if Vercel CLI is installed
check_vercel() {
    if ! command -v vercel &> /dev/null; then
        echo "❌ Vercel CLI is not installed. Installing..."
        npm install -g vercel
    fi
    echo "✅ Vercel CLI ready"
}

# Build application
build_app() {
    echo "🔨 Building application..."
    
    # Build frontend
    cd frontend
    npm run build
    cd ..
    
    echo "✅ Build complete"
}

# Deploy to Vercel
deploy_vercel() {
    echo "🌐 Deploying to Vercel..."
    
    # Login to Vercel (if not already logged in)
    vercel login
    
    # Deploy
    vercel --prod
    
    echo "✅ Deployment complete"
}

# Setup environment variables
setup_env() {
    echo "🔧 Setting up environment variables..."
    
    echo "Please set the following environment variables in Vercel:"
    echo "- CEREBRAS_API_KEY: Your Cerebras API key"
    echo "- DATABASE_URL: Your PostgreSQL connection string"
    echo "- REDIS_URL: Your Redis connection string"
    echo "- NEXTAUTH_SECRET: A random secret for authentication"
    echo "- NEXTAUTH_URL: Your production URL"
    
    read -p "Press Enter to continue after setting environment variables..."
}

# Main deployment
main() {
    echo "🎯 NLP-to-App Platform Deployment"
    echo "=================================="
    
    check_vercel
    build_app
    setup_env
    deploy_vercel
    
    echo ""
    echo "🎉 Deployment complete!"
    echo ""
    echo "Your application is now live on Vercel!"
    echo "Check your Vercel dashboard for the deployment URL."
}

# Run main function
main "$@"
