# ITU Ginova - Production Deployment Guide

## Prerequisites

- Node.js 18.x, 20.x, or 22.x
- PM2 (will be installed automatically)
- Apache with mod_proxy and mod_rewrite enabled
- PostgreSQL database (Neon)

## Server Setup

### 1. Apache Modules

Enable required Apache modules on your cPanel server:

```bash
# Check if modules are enabled
httpd -M | grep -E "proxy|rewrite|headers"

# If not enabled, ask your hosting provider to enable:
# - mod_proxy
# - mod_proxy_http
# - mod_rewrite
# - mod_headers
```

### 2. Create Environment File

```bash
cd /home/ginovalno/public_html
cp .env.production.example .env
nano .env  # Edit with your actual credentials
```

**Important .env values:**
```
NODE_ENV=production
PORT=5000
DATABASE_URL=postgresql://neondb_owner:YOUR_PASSWORD@ep-patient-shape-ad0pcixl-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require
SESSION_SECRET=generate-a-strong-random-string
BASE_URL=https://ginova.itu.edu.tr
UPLOAD_DIR=/home/ginovalno/public_html/uploads
```

### 3. Deploy

```bash
cd /home/ginovalno/public_html
git pull origin main
chown ginovalno. -R .*
chmod +x deploy.sh
sh deploy.sh
```

## Troubleshooting

### API Returns HTML Instead of JSON

This means Apache is not proxying requests to Node.js properly.

1. Check if the .htaccess file exists:
```bash
ls -la /home/ginovalno/public_html/.htaccess
```

2. Check if mod_proxy is enabled:
```bash
httpd -M | grep proxy
```

3. Check PM2 status:
```bash
pm2 status
pm2 logs ginova-app --lines 50
```

4. Test if Node.js is responding on port 5000:
```bash
curl http://127.0.0.1:5000/api/programs
```

### Database Connection Issues

1. Verify DATABASE_URL is set correctly:
```bash
grep DATABASE_URL .env
```

2. Check PM2 logs for connection errors:
```bash
pm2 logs ginova-app --lines 100 | grep -i "database\|postgres\|error"
```

### Images Not Loading

1. Check uploads directory exists:
```bash
ls -la /home/ginovalno/public_html/uploads
```

2. Check UPLOAD_DIR in .env:
```bash
grep UPLOAD_DIR .env
```

3. Test image access:
```bash
curl -I http://127.0.0.1:5000/uploads/some-image.jpg
```

### Login/Session Issues

1. Check SESSION_SECRET is set:
```bash
grep SESSION_SECRET .env
```

2. Ensure cookies are working with HTTPS:
```bash
grep SESSION_COOKIE .env
```

## Useful Commands

```bash
# View PM2 status
pm2 status

# View application logs
pm2 logs ginova-app

# Restart application
pm2 restart ginova-app

# Stop application
pm2 stop ginova-app

# Check memory usage
pm2 monit

# Reload with zero downtime
pm2 reload ginova-app
```

## File Structure

```
/home/ginovalno/public_html/
├── .env                    # Environment variables (create from .env.production.example)
├── .htaccess              # Apache reverse proxy config
├── deploy.sh              # Deployment script
├── ecosystem.config.cjs   # PM2 configuration
├── dist/                  # Built application
│   ├── index.js          # Server entry point
│   └── public/           # Static frontend files
├── uploads/              # Uploaded images
└── logs/                 # Application logs
    ├── out.log           # Standard output
    └── err.log           # Error output
```

## Support

If you encounter issues not covered here:
1. Check PM2 logs: `pm2 logs ginova-app --lines 100`
2. Check Apache error logs: `/var/log/apache2/error.log` or `/var/log/httpd/error_log`
3. Verify all environment variables are set correctly
