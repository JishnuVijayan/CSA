#!/bin/bash

# State Portal Deployment Script
# Run this on your Lightsail instance to deploy/update the application

echo "================================"
echo "State Portal Deployment"
echo "================================"
echo ""

# Pull latest changes
echo "📥 Pulling latest changes from GitHub..."
git pull origin main

if [ $? -ne 0 ]; then
    echo "❌ Failed to pull from GitHub"
    exit 1
fi

echo "✓ Code updated"
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "❌ .env file not found!"
    echo "   Please create .env file with your configuration"
    echo "   See .env.example for template"
    exit 1
fi

# Stop existing containers
echo "🛑 Stopping existing containers..."
docker-compose down

# Build and start containers
echo "🔨 Building and starting containers..."
docker-compose up -d --build

if [ $? -ne 0 ]; then
    echo "❌ Failed to start containers"
    exit 1
fi

echo ""
echo "⏳ Waiting for services to start..."
sleep 10

# Check if containers are running
echo ""
echo "📊 Container Status:"
docker-compose ps

echo ""
echo "================================"
echo "Deployment Complete!"
echo "================================"
echo ""
echo "View logs: docker-compose logs -f"
echo "Check status: docker-compose ps"
echo ""
