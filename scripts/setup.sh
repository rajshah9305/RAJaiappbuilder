#!/bin/bash

# NLP-to-App Platform Setup Script
# This script sets up the development environment

set -e

echo "🚀 Setting up NLP-to-App Platform..."

# Check if required tools are installed
check_requirements() {
    echo "📋 Checking requirements..."
    
    if ! command -v node &> /dev/null; then
        echo "❌ Node.js is not installed. Please install Node.js 18+ first."
        exit 1
    fi
    
    if ! command -v python3 &> /dev/null; then
        echo "❌ Python 3 is not installed. Please install Python 3.9+ first."
        exit 1
    fi
    
    if ! command -v docker &> /dev/null; then
        echo "❌ Docker is not installed. Please install Docker first."
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        echo "❌ Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi
    
    echo "✅ All requirements satisfied"
}

# Install dependencies
install_dependencies() {
    echo "📦 Installing dependencies..."
    
    # Install root dependencies
    npm install
    
    # Install backend dependencies
    cd backend
    pip install -r requirements.txt
    cd ..
    
    # Install frontend dependencies
    cd frontend
    npm install
    cd ..
    
    echo "✅ Dependencies installed"
}

# Setup environment
setup_environment() {
    echo "🔧 Setting up environment..."
    
    # Copy environment file
    if [ ! -f .env ]; then
        cp env.example .env
        echo "📝 Created .env file. Please update with your API keys."
    fi
    
    # Create necessary directories
    mkdir -p backend/chroma_db
    mkdir -p logs
    
    echo "✅ Environment setup complete"
}

# Start services
start_services() {
    echo "🐳 Starting services with Docker Compose..."
    
    # Start database and cache services
    docker-compose up -d postgres redis
    
    # Wait for services to be ready
    echo "⏳ Waiting for services to be ready..."
    sleep 10
    
    # Start backend
    docker-compose up -d backend
    
    # Wait for backend to be ready
    echo "⏳ Waiting for backend to be ready..."
    sleep 15
    
    # Start frontend
    docker-compose up -d frontend
    
    echo "✅ All services started"
}

# Main setup
main() {
    echo "🎯 NLP-to-App Platform Setup"
    echo "=============================="
    
    check_requirements
    install_dependencies
    setup_environment
    
    echo ""
    echo "🎉 Setup complete!"
    echo ""
    echo "Next steps:"
    echo "1. Update .env file with your API keys"
    echo "2. Run: docker-compose up -d"
    echo "3. Visit: http://localhost:3000"
    echo ""
    echo "API Documentation: http://localhost:8000/api/docs"
    echo "Health Check: http://localhost:8000/health"
}

# Run main function
main "$@"
