#!/bin/bash
################################################################################
# Nginx Configuration Script for ginova.itu.edu.tr
################################################################################

set -e

echo "🔧 Configuring Nginx for ginova.itu.edu.tr..."

DOMAIN="ginova.itu.edu.tr"
APP_PORT=5000

# Create Nginx configuration
cat > /etc/nginx/conf.d/ginova.conf << 'NGINXCONF'
server {
    listen 80;
    listen [::]:80;
    server_name ginova.itu.edu.tr;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Logging
    access_log /var/log/nginx/ginova_access.log;
    error_log /var/log/nginx/ginova_error.log;

    # Proxy to Node.js application
    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 300s;
        proxy_connect_timeout 300s;
    }

    # Static files (if any)
    location /media/ {
        alias /home/ginova/public/media/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Handle large uploads
    client_max_body_size 10M;
}
NGINXCONF

echo "✓ Nginx configuration created"

# Test Nginx configuration
echo "Testing Nginx configuration..."
nginx -t

# Restart Nginx
echo "Restarting Nginx..."
systemctl restart nginx

echo ""
echo "✅ Nginx configured successfully!"
echo "===================================="
echo "Your site should now be accessible at:"
echo "  http://ginova.itu.edu.tr"
echo ""
echo "To enable HTTPS with Let's Encrypt, run:"
echo "  certbot --nginx -d ginova.itu.edu.tr"
echo ""
