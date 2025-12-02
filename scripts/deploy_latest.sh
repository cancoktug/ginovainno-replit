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
    
    # Step 3: Install dependencies (including dev for build tools like vite)
    echo ""
    log "${BLUE}[3/7] Installing dependencies...${NC}"
    npm ci 2>&1 || npm install 2>&1 || error_exit "npm install failed"
    echo -e "${GREEN}✓ Dependencies installed${NC}"
    
    # Step 4: Build application
    echo ""
    log "${BLUE}[4/7] Building application...${NC}"
    npm run build 2>&1 || error_exit "Build failed"
    echo -e "${GREEN}✓ Application built successfully${NC}"
    
    # Step 5: Ensure upload directory exists and sync images
    echo ""
    log "${BLUE}[5/7] Setting up directories and syncing images...${NC}"
    UPLOAD_DIR=$(grep UPLOAD_DIR .env | cut -d '=' -f2 | tr -d '"' | tr -d "'")
    UPLOAD_DIR=${UPLOAD_DIR:-"${APP_DIR}/uploads"}
    mkdir -p "$UPLOAD_DIR"
    mkdir -p "$LOG_DIR"
    
    # Copy images from repo uploads folder to UPLOAD_DIR if different
    if [ -d "${APP_DIR}/uploads" ] && [ "${APP_DIR}/uploads" != "$UPLOAD_DIR" ]; then
        echo -e "${YELLOW}Copying images from repo to upload directory...${NC}"
        cp -n ${APP_DIR}/uploads/*.jpg "$UPLOAD_DIR/" 2>/dev/null || true
        cp -n ${APP_DIR}/uploads/*.png "$UPLOAD_DIR/" 2>/dev/null || true
        cp -n ${APP_DIR}/uploads/*.webp "$UPLOAD_DIR/" 2>/dev/null || true
    fi
    
    # Ensure images in repo uploads are available
    if [ -d "${APP_DIR}/uploads" ]; then
        IMAGE_COUNT=$(ls -1 ${APP_DIR}/uploads/*.jpg 2>/dev/null | wc -l)
        echo -e "${GREEN}✓ Found ${IMAGE_COUNT} images in repository${NC}"
    fi
    
    chmod -R 755 "$UPLOAD_DIR"
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
    
    # Step 7: Verify application is running
    echo ""
    log "${BLUE}[7/7] Verifying application status...${NC}"
    sleep 3  # Wait for app to start
    
    # Check if PM2 process is running
    if pm2 describe "$APP_NAME" > /dev/null 2>&1; then
        PM2_STATUS=$(pm2 jlist | grep -o '"status":"[^"]*"' | head -1 | cut -d'"' -f4)
        if [ "$PM2_STATUS" = "online" ]; then
            echo -e "${GREEN}✓ Application is running (PM2 status: $PM2_STATUS)${NC}"
        else
            echo -e "${YELLOW}! Application status: $PM2_STATUS (may need a moment to start)${NC}"
        fi
    else
        echo -e "${YELLOW}! Could not verify PM2 status${NC}"
    fi
    
    # Show last few log lines for verification
    echo -e "${BLUE}Recent application logs:${NC}"
    pm2 logs "$APP_NAME" --lines 5 --nostream 2>/dev/null || true
    
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
