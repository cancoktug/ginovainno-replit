#!/bin/bash

# =============================================================================
# ITU Ginova - Production Deployment Script
# This script is called by GitHub Actions or manually on the server
# =============================================================================

set -e
set -o pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
APP_DIR="/home/ginovalno/public_html"
APP_NAME="ginova-app"
LOG_DIR="${APP_DIR}/logs"
LOCK_FILE="/tmp/ginova-deploy.lock"
NVM_DIR="$HOME/.nvm"

# Load NVM
load_nvm() {
    if [ -s "$NVM_DIR/nvm.sh" ]; then
        source "$NVM_DIR/nvm.sh"
        nvm use 20 || nvm use node
        echo -e "${GREEN}✓ Node.js $(node -v) loaded via NVM${NC}"
    else
        echo -e "${YELLOW}! NVM not found, using system Node.js${NC}"
    fi
}

# Acquire deployment lock
acquire_lock() {
    if [ -f "$LOCK_FILE" ]; then
        LOCK_PID=$(cat "$LOCK_FILE")
        if kill -0 "$LOCK_PID" 2>/dev/null; then
            echo -e "${RED}✗ Another deployment is in progress (PID: $LOCK_PID)${NC}"
            exit 1
        else
            echo -e "${YELLOW}! Stale lock file found, removing...${NC}"
            rm -f "$LOCK_FILE"
        fi
    fi
    echo $$ > "$LOCK_FILE"
    trap "rm -f $LOCK_FILE" EXIT
}

# Log function
log() {
    echo -e "${BLUE}[$(date '+%Y-%m-%d %H:%M:%S')]${NC} $1"
}

# Error handler
error_exit() {
    echo -e "${RED}✗ Deployment failed: $1${NC}"
    echo -e "${YELLOW}Check logs at: ${LOG_DIR}/deploy.log${NC}"
    exit 1
}

# Main deployment
main() {
    echo ""
    echo -e "${BLUE}========================================${NC}"
    echo -e "${BLUE}   ITU Ginova Deployment Script${NC}"
    echo -e "${BLUE}========================================${NC}"
    echo ""
    
    # Acquire lock
    acquire_lock
    log "Deployment started"
    
    # Navigate to app directory
    cd "$APP_DIR" || error_exit "Cannot access $APP_DIR"
    log "Working directory: $(pwd)"
    
    # Load NVM and Node.js
    load_nvm
    
    # Create logs directory
    mkdir -p "$LOG_DIR"
    
    # Step 1: Fetch latest code
    echo ""
    log "${BLUE}[1/7] Fetching latest code from GitHub...${NC}"
    git fetch --all || error_exit "Git fetch failed"
    git reset --hard origin/main || error_exit "Git reset failed"
    echo -e "${GREEN}✓ Code updated to latest version${NC}"
    
    # Step 2: Verify .env file exists
    echo ""
    log "${BLUE}[2/7] Checking environment configuration...${NC}"
    if [ ! -f ".env" ]; then
        if [ -f ".env.example" ]; then
            echo -e "${YELLOW}! .env not found, copying from .env.example${NC}"
            cp .env.example .env
            echo -e "${RED}! Please update .env with your actual credentials${NC}"
        else
            error_exit ".env file not found and no .env.example available"
        fi
    fi
    echo -e "${GREEN}✓ Environment configuration found${NC}"
    
    # Step 3: Install dependencies
    echo ""
    log "${BLUE}[3/7] Installing dependencies...${NC}"
    npm ci --omit=dev 2>&1 || npm install --omit=dev 2>&1 || error_exit "npm install failed"
    echo -e "${GREEN}✓ Dependencies installed${NC}"
    
    # Step 4: Build application
    echo ""
    log "${BLUE}[4/7] Building application...${NC}"
    npm run build 2>&1 || error_exit "Build failed"
    echo -e "${GREEN}✓ Application built successfully${NC}"
    
    # Step 5: Ensure upload directory exists
    echo ""
    log "${BLUE}[5/7] Setting up directories and permissions...${NC}"
    UPLOAD_DIR=$(grep UPLOAD_DIR .env | cut -d '=' -f2 | tr -d '"' | tr -d "'")
    UPLOAD_DIR=${UPLOAD_DIR:-"${APP_DIR}/uploads"}
    mkdir -p "$UPLOAD_DIR"
    mkdir -p "$LOG_DIR"
    chmod 755 "$UPLOAD_DIR"
    chmod 755 "$LOG_DIR"
    echo -e "${GREEN}✓ Directories configured${NC}"
    
    # Step 6: Restart PM2
    echo ""
    log "${BLUE}[6/7] Restarting application with PM2...${NC}"
    
    # Check if PM2 process exists
    if pm2 describe "$APP_NAME" > /dev/null 2>&1; then
        pm2 reload "$APP_NAME" --update-env || error_exit "PM2 reload failed"
    else
        pm2 delete "$APP_NAME" 2>/dev/null || true
        pm2 start ecosystem.config.cjs || error_exit "PM2 start failed"
    fi
    pm2 save
    echo -e "${GREEN}✓ Application restarted${NC}"
    
    # Step 7: Health check
    echo ""
    log "${BLUE}[7/7] Running health check...${NC}"
    sleep 3  # Wait for app to start
    
    HEALTH_CHECK_URL="http://127.0.0.1:5000/api/health"
    MAX_RETRIES=10
    RETRY_COUNT=0
    
    while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
        HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$HEALTH_CHECK_URL" 2>/dev/null || echo "000")
        if [ "$HTTP_CODE" = "200" ]; then
            echo -e "${GREEN}✓ Health check passed (HTTP $HTTP_CODE)${NC}"
            break
        fi
        RETRY_COUNT=$((RETRY_COUNT + 1))
        if [ $RETRY_COUNT -lt $MAX_RETRIES ]; then
            echo -e "${YELLOW}! Health check attempt $RETRY_COUNT failed (HTTP $HTTP_CODE), retrying in 2s...${NC}"
            sleep 2
        fi
    done
    
    if [ $RETRY_COUNT -eq $MAX_RETRIES ]; then
        echo -e "${RED}✗ Health check failed after $MAX_RETRIES attempts${NC}"
        echo -e "${YELLOW}Checking PM2 logs for errors...${NC}"
        pm2 logs "$APP_NAME" --lines 20 --nostream
        error_exit "Health check failed"
    fi
    
    # Done
    echo ""
    echo -e "${GREEN}========================================${NC}"
    echo -e "${GREEN}   Deployment completed successfully!${NC}"
    echo -e "${GREEN}========================================${NC}"
    echo ""
    log "Deployment finished at $(date)"
    
    # Show PM2 status
    pm2 status
}

# Run main function and capture exit code
{
    main "$@" 2>&1 | tee -a "${LOG_DIR:-/tmp}/deploy.log"
    exit_code=${PIPESTATUS[0]}
} || exit_code=$?

exit $exit_code
