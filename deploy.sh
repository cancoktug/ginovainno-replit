#!/bin/bash
################################################################################
# ITU Ginova - Production Deployment Script
# Domain: ginova.itu.edu.tr
# Server: Linux cPanel
# Last Updated: November 2025
################################################################################

set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo ""
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}   ITU Ginova - Deployment Script${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Configuration - UPDATE THESE FOR YOUR SERVER
APP_DIR="${APP_DIR:-$(pwd)}"
APP_NAME="ginova-app"
UPLOAD_DIR="${APP_DIR}/uploads"

echo -e "${BLUE}[1/9] Checking prerequisites...${NC}"

# Check Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}Error: Node.js is not installed${NC}"
    exit 1
fi
NODE_VERSION=$(node -v)
echo -e "${GREEN}✓ Node.js $NODE_VERSION${NC}"

if [[ ! "$NODE_VERSION" =~ ^v(18|20|22) ]]; then
    echo -e "${YELLOW}Warning: Node.js version should be 18.x, 20.x, or 22.x${NC}"
fi

# Check npm
if ! command -v npm &> /dev/null; then
    echo -e "${RED}Error: npm is not installed${NC}"
    exit 1
fi
echo -e "${GREEN}✓ npm $(npm -v)${NC}"

# Check PM2
if ! command -v pm2 &> /dev/null; then
    echo -e "${YELLOW}Installing PM2 globally...${NC}"
    npm install -g pm2
fi
echo -e "${GREEN}✓ PM2 installed${NC}"

echo ""
echo -e "${BLUE}[2/9] Checking environment file...${NC}"

if [ ! -f ".env" ]; then
    echo -e "${RED}Error: .env file not found!${NC}"
    echo -e "${YELLOW}Please create .env file from .env.production.example${NC}"
    echo ""
    echo "Run: cp .env.production.example .env"
    echo "Then edit .env with your actual credentials"
    exit 1
fi
echo -e "${GREEN}✓ Environment file found${NC}"

echo ""
echo -e "${BLUE}[3/9] Creating upload directories...${NC}"

# Create uploads directory with proper permissions
mkdir -p "${UPLOAD_DIR}"
chmod 755 "${UPLOAD_DIR}"
echo -e "${GREEN}✓ Upload directory: ${UPLOAD_DIR}${NC}"

# Set ownership if running as root
if [ "$(id -u)" -eq 0 ]; then
    # Try to get the owner of APP_DIR
    OWNER=$(stat -c '%U:%G' "$APP_DIR" 2>/dev/null || echo "")
    if [ -n "$OWNER" ] && [ "$OWNER" != "root:root" ]; then
        chown -R "$OWNER" "${UPLOAD_DIR}"
        echo -e "${GREEN}✓ Upload directory ownership set to ${OWNER}${NC}"
    fi
fi

# Create logs directory
mkdir -p logs
chmod 755 logs
echo -e "${GREEN}✓ Logs directory created${NC}"

echo ""
echo -e "${BLUE}[4/9] Installing dependencies...${NC}"
npm install --include=optional 2>&1 | tail -5
echo -e "${GREEN}✓ Dependencies installed${NC}"

echo ""
echo -e "${BLUE}[5/9] Rebuilding native modules for this platform...${NC}"
echo -e "${YELLOW}This may take a few minutes...${NC}"

# Rebuild sharp module (optional - app works without it)
echo -e "  Checking sharp..."
if npm rebuild sharp 2>/dev/null; then
    echo -e "${GREEN}  ✓ Sharp rebuilt successfully - image optimization enabled${NC}"
else
    echo -e "${YELLOW}  ⚠ Sharp unavailable - image optimization disabled (images saved as-is)${NC}"
fi

# Rebuild bcrypt module (if exists)
if npm list bcrypt &>/dev/null; then
    echo -e "  Rebuilding bcrypt..."
    if npm rebuild bcrypt 2>/dev/null; then
        echo -e "${GREEN}  ✓ Bcrypt rebuilt successfully${NC}"
    else
        echo -e "${YELLOW}  Bcrypt rebuild failed, trying reinstall...${NC}"
        npm uninstall bcrypt 2>/dev/null || true
        npm install bcrypt 2>/dev/null || echo -e "${YELLOW}  ⚠ Bcrypt unavailable${NC}"
    fi
fi

# Rebuild any other native modules
echo -e "  Rebuilding all native modules..."
npm rebuild 2>/dev/null || true
echo -e "${GREEN}✓ Native modules processed${NC}"

echo ""
echo -e "${BLUE}[6/9] Building application...${NC}"
npm run build
echo -e "${GREEN}✓ Build complete${NC}"

echo ""
echo -e "${BLUE}[7/9] Setting up environment variables...${NC}"
# Source .env file
export $(grep -v '^#' .env | xargs 2>/dev/null) || true

# Verify critical env vars
if [ -n "$DATABASE_URL" ]; then
    echo -e "${GREEN}✓ DATABASE_URL is set${NC}"
else
    echo -e "${RED}✗ DATABASE_URL not found in .env${NC}"
fi

if [ -n "$SESSION_SECRET" ]; then
    echo -e "${GREEN}✓ SESSION_SECRET is set${NC}"
else
    echo -e "${YELLOW}⚠ SESSION_SECRET not set - using default${NC}"
fi

# Add UPLOAD_DIR to environment if not set
if ! grep -q "^UPLOAD_DIR" .env 2>/dev/null; then
    echo "" >> .env
    echo "# File Upload Directory" >> .env
    echo "UPLOAD_DIR=${UPLOAD_DIR}" >> .env
    echo -e "${GREEN}✓ UPLOAD_DIR added to .env: ${UPLOAD_DIR}${NC}"
else
    CURRENT_UPLOAD_DIR=$(grep "^UPLOAD_DIR" .env | cut -d'=' -f2)
    echo -e "${GREEN}✓ UPLOAD_DIR configured: ${CURRENT_UPLOAD_DIR}${NC}"
fi

echo ""
echo -e "${BLUE}[8/9] Setting file permissions...${NC}"
chmod 755 "${UPLOAD_DIR}"
chmod 755 logs
echo -e "${GREEN}✓ Permissions set${NC}"

echo ""
echo -e "${BLUE}[9/9] Starting application with PM2...${NC}"

# Stop existing app if running
pm2 delete "$APP_NAME" 2>/dev/null || true

# Source environment variables before starting PM2
set -a
source .env 2>/dev/null || true
set +a

# Start with ecosystem config
if [ -f "ecosystem.config.cjs" ]; then
    pm2 start ecosystem.config.cjs
else
    pm2 start dist/index.js --name "$APP_NAME" -i 1
fi

# Save PM2 process list
pm2 save

# Wait for app to start
sleep 3

# Check if app is running
if pm2 list | grep -q "$APP_NAME.*online"; then
    echo -e "${GREEN}✓ Application started successfully${NC}"
else
    echo -e "${YELLOW}⚠ Application may have issues - check logs${NC}"
fi

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}   Deployment Complete!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "Application:    ${BLUE}$APP_NAME${NC}"
echo -e "Directory:      ${BLUE}$APP_DIR${NC}"
echo -e "Uploads:        ${BLUE}$UPLOAD_DIR${NC}"
echo -e "Domain:         ${BLUE}https://ginova.itu.edu.tr${NC}"
echo ""
echo -e "${YELLOW}Useful commands:${NC}"
echo "  pm2 status              - Check app status"
echo "  pm2 logs $APP_NAME      - View logs"
echo "  pm2 restart $APP_NAME   - Restart app"
echo "  pm2 monit               - Monitor resources"
echo ""
echo -e "${YELLOW}Image Storage:${NC}"
echo "  Upload directory: $UPLOAD_DIR"
echo "  Images stored as: $UPLOAD_DIR/uuid.jpg"
echo "  Accessed via: /uploads/uuid.jpg or /objects/uploads/uuid.jpg"
echo ""
echo -e "${YELLOW}If you encounter issues:${NC}"
echo "  1. Check logs: pm2 logs $APP_NAME --lines 50"
echo "  2. Verify .env file has correct values"
echo "  3. Ensure Apache reverse proxy is configured"
echo "  4. Check uploads directory: ls -la $UPLOAD_DIR"
echo ""
