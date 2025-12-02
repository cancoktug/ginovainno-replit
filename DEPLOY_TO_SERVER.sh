#!/bin/bash
################################################################################
# ITU Ginova - Production Deployment Script
# Server: 185.171.24.91:49636
# Domain: ginova.itu.edu.tr
# Date: October 1, 2025
################################################################################

set -e  # Exit on any error

echo "🚀 Starting ITU Ginova Deployment..."
echo "===================================="

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Configuration
APP_DIR="/home/ginova"
DOMAIN="ginova.itu.edu.tr"
APP_PORT=5000

echo -e "${BLUE}Step 1/8: Checking prerequisites...${NC}"
# Check if running as root
if [ "$EUID" -ne 0 ]; then 
  echo -e "${RED}Please run as root${NC}"
  exit 1
fi

# Check Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}Node.js is not installed!${NC}"
    exit 1
fi
echo "✓ Node.js version: $(node -v)"

# Check PostgreSQL
if ! command -v psql &> /dev/null; then
    echo -e "${RED}PostgreSQL is not installed!${NC}"
    exit 1
fi
echo "✓ PostgreSQL installed"

echo -e "${BLUE}Step 2/8: Creating application directory...${NC}"
mkdir -p $APP_DIR
cd $APP_DIR

echo -e "${BLUE}Step 3/8: Copying application files...${NC}"
# Note: Files should already be uploaded to this directory
# If not, copy them from the upload location
if [ ! -f "package.json" ]; then
    echo -e "${RED}Error: package.json not found. Please upload application files first.${NC}"
    exit 1
fi
echo "✓ Application files found"

echo -e "${BLUE}Step 4/8: Creating production environment file...${NC}"
cat > .env << 'EOF'
# Production Environment Variables
NODE_ENV=production
PORT=5000

# Database Configuration
DATABASE_URL=postgresql://ginovai_user:njG6r1sfI99I@localhost:5432/ginvai_db
PGHOST=localhost
PGPORT=5432
PGDATABASE=ginvai_db
PGUSER=ginovai_user
PGPASSWORD=njG6r1sfI99I

# Session Secret (IMPORTANT: Change this to a secure random string)
SESSION_SECRET=ginova_production_secret_$(openssl rand -hex 32)

# Domain
REPLIT_DOMAINS=ginova.itu.edu.tr

# SendGrid (add your API key if available)
SENDGRID_API_KEY=
SENDGRID_FROM_EMAIL=noreply@ginova.itu.edu.tr
EOF
echo "✓ Environment file created"

echo -e "${BLUE}Step 5/8: Installing dependencies...${NC}"
npm install --production
echo "✓ Dependencies installed"

echo -e "${BLUE}Step 6/8: Installing PM2 process manager...${NC}"
if ! command -v pm2 &> /dev/null; then
    npm install -g pm2
fi
echo "✓ PM2 installed"

echo -e "${BLUE}Step 7/8: Building application for production...${NC}"
npm run build
echo "✓ Application built successfully"

echo -e "${BLUE}Step 8/8: Starting application with PM2...${NC}"
# Create logs directory
mkdir -p logs

# Stop if already running
pm2 delete ginova-app 2>/dev/null || true

# Start the application using ecosystem config
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup

echo ""
echo -e "${GREEN}✅ Application deployed successfully!${NC}"
echo "===================================="
echo -e "Application is running on port ${APP_PORT}"
echo -e "Next step: Configure Nginx reverse proxy"
echo ""
echo "Check application status:"
echo "  pm2 status"
echo "  pm2 logs ginova-app"
echo ""
