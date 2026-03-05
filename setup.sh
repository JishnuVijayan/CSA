#!/bin/bash

# State Portal Setup Script
# This script helps set up the application for deployment

echo "================================"
echo "State Portal Setup Script"
echo "================================"
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "Creating .env file from template..."
    cp .env.example .env
    echo "✓ .env file created"
    echo ""
    echo "⚠️  Please edit .env and update the following:"
    echo "   - DB_PASSWORD: Set a secure database password"
    echo "   - BACKEND_URL: Set your Lightsail instance IP or domain"
    echo ""
else
    echo "✓ .env file already exists"
fi

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed"
    echo "   Please install Docker: https://docs.docker.com/get-docker/"
    exit 1
else
    echo "✓ Docker is installed"
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed"
    echo "   Please install Docker Compose: https://docs.docker.com/compose/install/"
    exit 1
else
    echo "✓ Docker Compose is installed"
fi

echo ""
echo "================================"
echo "Setup Complete!"
echo "================================"
echo ""
echo "Next steps:"
echo "1. Edit .env file with your configuration"
echo "2. Run: docker-compose up -d --build"
echo "3. Access frontend at: http://localhost:3000"
echo "4. Access backend at: http://localhost:3001"
echo ""
echo "For deployment to AWS Lightsail, see DEPLOYMENT.md"
echo ""
