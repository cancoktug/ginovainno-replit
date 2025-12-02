# ITU Ginova - Quick Start Guide

Fast deployment guide for experienced developers.

## Prerequisites
- Ubuntu/Debian VDS with root access
- Domain name pointing to your server IP
- Node.js 18+, PostgreSQL 14+, Nginx

## 5-Minute Deployment

### 1. Install Required Software
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PostgreSQL, Nginx, and Certbot
sudo apt install postgresql postgresql-contrib nginx certbot python3-certbot-nginx -y

# Install PM2 globally
sudo npm install -g pm2
```

### 2. Setup Database
```bash
# Create database and user
sudo -u postgres psql << EOF
CREATE DATABASE ginova_db;
CREATE USER ginova_user WITH ENCRYPTED PASSWORD 'your-secure-password';
GRANT ALL PRIVILEGES ON DATABASE ginova_db TO ginova_user;
\q
EOF

# Import database
psql -U ginova_user -d ginova_db -h localhost < deployment_database.sql
```

### 3. Configure Application
```bash
# Navigate to app directory
cd /var/www/ginova

# Copy and edit environment file
cp .env.example .env
nano .env  # Update DATABASE_URL, SESSION_SECRET, SENDGRID_API_KEY, etc.
```

### 4. Deploy Application
```bash
# Run automated deployment
./deploy.sh

# OR manual deployment:
npm install
npm run build
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup
```

### 5. Configure Nginx & SSL
```bash
# Setup Nginx
sudo cp nginx.conf.example /etc/nginx/sites-available/ginova
sudo nano /etc/nginx/sites-available/ginova  # Update domain name
sudo ln -s /etc/nginx/sites-available/ginova /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# Setup SSL
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Configure firewall
sudo ufw allow 80,443/tcp
sudo ufw enable
```

## Verify Deployment

```bash
# Check PM2 status
pm2 status

# View logs
pm2 logs ginova-app

# Test application
curl https://yourdomain.com
```

## Essential Commands

### Application Management
```bash
pm2 restart ginova-app    # Restart
pm2 logs ginova-app       # View logs
pm2 monit                 # Monitor
```

### Updates
```bash
cd /var/www/ginova
git pull                  # Get latest code
npm install              # Update dependencies
npm run build            # Build
pm2 restart ginova-app   # Restart
```

### Backup
```bash
# Database backup
pg_dump -U ginova_user -d ginova_db > backup_$(date +%Y%m%d).sql
```

## Environment Variables

**Required in .env:**
```env
DATABASE_URL=postgresql://ginova_user:password@localhost:5432/ginova_db
SESSION_SECRET=<generate-with: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))">
SENDGRID_API_KEY=your-sendgrid-key
FROM_EMAIL=noreply@yourdomain.com
ADMIN_EMAIL=admin@yourdomain.com
NODE_ENV=production
```

## Troubleshooting

**App won't start?**
```bash
pm2 logs ginova-app --lines 100
```

**Database connection error?**
```bash
psql -U ginova_user -d ginova_db -h localhost
```

**Nginx issues?**
```bash
sudo nginx -t
sudo tail -f /var/log/nginx/error.log
```

## Next Steps

1. ✅ Test all functionality on https://yourdomain.com
2. ✅ Setup automated backups (see DEPLOYMENT.md)
3. ✅ Configure monitoring
4. ✅ Review security checklist

For detailed instructions, see **DEPLOYMENT.md**
