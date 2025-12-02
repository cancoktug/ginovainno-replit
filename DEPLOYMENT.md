# ITU Ginova - VDS Deployment Guide

Complete guide for deploying ITU Ginova application to your VDS (Virtual Dedicated Server).

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Step 1: Environment Review & Setup](#step-1-environment-review--setup)
3. [Step 2: Database Migration](#step-2-database-migration)
4. [Step 3: App Deployment](#step-3-app-deployment)
5. [Step 4: Testing & Optimisation](#step-4-testing--optimisation)
6. [Step 5: Maintenance & Monitoring](#step-5-maintenance--monitoring)
7. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Server Requirements
- **OS**: Ubuntu 20.04+ / Debian 11+ / CentOS 8+
- **RAM**: Minimum 2GB (4GB recommended)
- **Storage**: Minimum 10GB free space
- **Node.js**: Version 18.x, 20.x, or 22.x
- **PostgreSQL**: Version 14+ 
- **Root or sudo access**

### Required Software
- Git
- PM2 (Process Manager)
- Nginx or Apache
- SSL Certificate (Let's Encrypt recommended)

---

## Step 1: Environment Review & Setup

### 1.1 Update System Packages

```bash
# Ubuntu/Debian
sudo apt update && sudo apt upgrade -y

# CentOS/RHEL
sudo yum update -y
```

### 1.2 Install Node.js

```bash
# Install Node.js 20.x (LTS)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node -v  # Should output v20.x.x
npm -v   # Should output 10.x.x
```

### 1.3 Install PostgreSQL

```bash
# Ubuntu/Debian
sudo apt install postgresql postgresql-contrib -y

# Start PostgreSQL service
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Verify installation
sudo -u postgres psql --version
```

### 1.4 Install PM2

```bash
sudo npm install -g pm2

# Verify installation
pm2 --version
```

### 1.5 Install Nginx

```bash
# Ubuntu/Debian
sudo apt install nginx -y

# Start Nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# Verify installation
nginx -v
```

---

## Step 2: Database Migration

### 2.1 Create PostgreSQL Database

```bash
# Switch to postgres user
sudo -u postgres psql

# In PostgreSQL prompt:
CREATE DATABASE ginova_db;
CREATE USER ginova_user WITH ENCRYPTED PASSWORD 'your-secure-password';
GRANT ALL PRIVILEGES ON DATABASE ginova_db TO ginova_user;
\q
```

### 2.2 Import Database Schema and Data

The project includes `deployment_database.sql` with complete schema and data.

```bash
# Import database
psql -U ginova_user -d ginova_db -h localhost < deployment_database.sql

# Enter password when prompted
```

### 2.3 Verify Database Import

```bash
psql -U ginova_user -d ginova_db -h localhost

# Check tables
\dt

# You should see tables like: users, programs, mentors, events, blog_posts, etc.
\q
```

---

## Step 3: App Deployment

### 3.1 Transfer Application Files

Upload the entire project to your VDS:

```bash
# Option 1: Using SCP
scp -r /path/to/project root@your-vds-ip:/var/www/ginova

# Option 2: Using Git
cd /var/www
git clone your-repo-url ginova
cd ginova
```

### 3.2 Configure Environment Variables

```bash
cd /var/www/ginova

# Create .env file from example
cp .env.example .env

# Edit with your actual credentials
nano .env
```

**Required environment variables:**

```env
# Database
DATABASE_URL=postgresql://ginova_user:your-secure-password@localhost:5432/ginova_db

# Session Secret (generate random string)
SESSION_SECRET=generate-a-long-random-secure-string-here

# Email (SendGrid)
SENDGRID_API_KEY=your-sendgrid-api-key
FROM_EMAIL=noreply@yourdomain.com
ADMIN_EMAIL=admin@yourdomain.com

# Server
NODE_ENV=production
PORT=5000
HOST=0.0.0.0
```

**Generate a secure SESSION_SECRET:**

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 3.3 Automated Deployment (Recommended)

```bash
# Run the deployment script
./deploy.sh
```

The script will:
- Check Node.js version
- Install dependencies
- Build the application
- Setup logs directory
- Verify database connection
- Optionally import database
- Install PM2 if needed
- Start the application

### 3.4 Manual Deployment (Alternative)

```bash
# Install dependencies
npm install

# Build application
npm run build

# Create logs directory
mkdir -p logs

# Start with PM2
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup
```

### 3.5 Configure Nginx Reverse Proxy

```bash
# Copy Nginx configuration
sudo cp nginx.conf.example /etc/nginx/sites-available/ginova

# Update domain name in the file
sudo nano /etc/nginx/sites-available/ginova
# Replace 'yourdomain.com' with your actual domain

# Enable the site
sudo ln -s /etc/nginx/sites-available/ginova /etc/nginx/sites-enabled/

# Test Nginx configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

### 3.6 Setup SSL Certificate (Let's Encrypt)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Obtain SSL certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Certbot will automatically configure Nginx with SSL

# Test auto-renewal
sudo certbot renew --dry-run
```

### 3.7 Configure Firewall

```bash
# Allow necessary ports
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw allow 22/tcp    # SSH

# Enable firewall
sudo ufw enable

# Check status
sudo ufw status
```

---

## Step 4: Testing & Optimisation

### 4.1 Verify Application is Running

```bash
# Check PM2 status
pm2 status

# View application logs
pm2 logs ginova-app

# Check if app responds locally
curl http://localhost:5000
```

### 4.2 Test Domain Access

```bash
# Test HTTP redirect
curl -I http://yourdomain.com

# Test HTTPS
curl -I https://yourdomain.com

# Or open in browser
# https://yourdomain.com
```

### 4.3 Performance Monitoring

```bash
# Monitor PM2 processes
pm2 monit

# Install PM2 log rotation (optional)
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
```

### 4.4 Optimization Settings

**PM2 Configuration (ecosystem.config.cjs):**
- Already configured for cluster mode
- Auto-restart on crashes
- Memory limit: 1GB per instance
- Log rotation enabled

**Nginx Configuration:**
- Gzip compression enabled
- Static file caching (1 year)
- Client body size: 100MB (for file uploads)
- Proper proxy headers

---

## Step 5: Maintenance & Monitoring

### 5.1 Daily Operations

**View Application Logs:**
```bash
pm2 logs ginova-app
pm2 logs ginova-app --lines 100
```

**Restart Application:**
```bash
pm2 restart ginova-app
```

**Stop Application:**
```bash
pm2 stop ginova-app
```

**Monitor Resources:**
```bash
pm2 monit
```

### 5.2 Database Backup

```bash
# Create backup
pg_dump -U ginova_user -d ginova_db > backup_$(date +%Y%m%d).sql

# Automate daily backups (add to crontab)
crontab -e

# Add this line:
0 2 * * * pg_dump -U ginova_user -d ginova_db > /backups/ginova_$(date +\%Y\%m\%d).sql
```

### 5.3 Application Updates

When deploying new versions:

```bash
cd /var/www/ginova

# Pull latest changes
git pull

# Install new dependencies
npm install

# Build new version
npm run build

# Restart application
pm2 restart ginova-app

# Check logs for errors
pm2 logs ginova-app --lines 50
```

### 5.4 Health Monitoring

**Setup PM2 monitoring dashboard (optional):**

```bash
pm2 register

# Or use PM2 web interface
pm2 web
```

### 5.5 Log Management

**View Nginx logs:**
```bash
# Access logs
tail -f /var/log/nginx/ginova_access.log

# Error logs
tail -f /var/log/nginx/ginova_error.log
```

**Application logs location:**
- PM2 logs: `./logs/out.log` and `./logs/err.log`
- Or use: `pm2 logs`

---

## Troubleshooting

### Application Won't Start

**Check PM2 status:**
```bash
pm2 status
pm2 logs ginova-app --lines 100
```

**Common issues:**
1. Missing .env file → Create from .env.example
2. Database connection error → Check DATABASE_URL
3. Port already in use → Change PORT in .env

### Database Connection Errors

```bash
# Test connection manually
psql -U ginova_user -d ginova_db -h localhost

# Check PostgreSQL is running
sudo systemctl status postgresql

# Restart PostgreSQL
sudo systemctl restart postgresql
```

### Nginx Issues

```bash
# Test configuration
sudo nginx -t

# View error logs
sudo tail -f /var/log/nginx/error.log

# Restart Nginx
sudo systemctl restart nginx
```

### SSL Certificate Issues

```bash
# Renew certificate manually
sudo certbot renew

# Check certificate status
sudo certbot certificates
```

### Memory Issues

```bash
# Check memory usage
free -h

# PM2 memory monitoring
pm2 monit

# Restart app to clear memory
pm2 restart ginova-app
```

### Performance Issues

1. **Enable Gzip compression** (already in nginx.conf)
2. **Use CDN** for static assets
3. **Add more RAM** to server
4. **Scale horizontally** with PM2 cluster mode (already configured)

---

## Security Checklist

- [ ] Change default database password
- [ ] Generate strong SESSION_SECRET
- [ ] Setup firewall (ufw)
- [ ] Enable HTTPS with SSL certificate
- [ ] Keep Node.js and system packages updated
- [ ] Regular database backups
- [ ] Monitor logs for suspicious activity
- [ ] Disable root SSH login
- [ ] Use SSH keys instead of passwords

---

## Useful Commands Reference

### PM2 Commands
```bash
pm2 start ecosystem.config.cjs    # Start app
pm2 stop ginova-app                # Stop app
pm2 restart ginova-app             # Restart app
pm2 reload ginova-app              # Reload without downtime
pm2 delete ginova-app              # Remove from PM2
pm2 logs ginova-app                # View logs
pm2 monit                          # Monitor resources
pm2 save                           # Save PM2 config
pm2 startup                        # Setup auto-start
```

### Nginx Commands
```bash
sudo nginx -t                      # Test config
sudo systemctl restart nginx       # Restart Nginx
sudo systemctl status nginx        # Check status
```

### Database Commands
```bash
psql -U ginova_user -d ginova_db  # Connect to DB
pg_dump -U ginova_user ginova_db > backup.sql  # Backup
psql -U ginova_user ginova_db < backup.sql     # Restore
```

---

## Support

For technical issues:
1. Check logs: `pm2 logs ginova-app`
2. Review this documentation
3. Check application GitHub issues
4. Contact technical support

---

## Application Structure

```
/var/www/ginova/
├── client/                 # Frontend React application
├── server/                 # Backend Express application
├── dist/                   # Built files (generated)
│   ├── public/            # Frontend build
│   └── index.js           # Backend build
├── public/media/          # Uploaded media files
├── .env                   # Environment variables (create this)
├── .env.example           # Environment template
├── ecosystem.config.cjs   # PM2 configuration
├── nginx.conf.example     # Nginx configuration template
├── deploy.sh              # Deployment script
├── deployment_database.sql # Database dump
└── package.json           # Dependencies
```

---

**Version**: 1.0  
**Last Updated**: 2025  
**Platform**: ITU Ginova - Girişimcilik ve İnovasyon Merkezi
