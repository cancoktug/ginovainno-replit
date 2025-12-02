#!/bin/bash
echo "Creating deployment package..."

# Create a temporary directory
mkdir -p /tmp/ginova-deploy

# Copy all necessary files
rsync -av \
  --exclude='node_modules' \
  --exclude='.git' \
  --exclude='.replit' \
  --exclude='replit.nix' \
  --exclude='*.log' \
  --exclude='.env' \
  --exclude='deployment_package' \
  --exclude='/tmp' \
  ./ /tmp/ginova-deploy/

# Copy deployment scripts
cp DEPLOY_TO_SERVER.sh /tmp/ginova-deploy/
cp CONFIGURE_NGINX.sh /tmp/ginova-deploy/
cp DEPLOY_NOW.md /tmp/ginova-deploy/

# Create tarball
cd /tmp
tar -czf ginova-deployment.tar.gz ginova-deploy/

# Move to current directory
mv ginova-deployment.tar.gz /workspace/

echo "✅ Deployment package created: ginova-deployment.tar.gz"
ls -lh /workspace/ginova-deployment.tar.gz
