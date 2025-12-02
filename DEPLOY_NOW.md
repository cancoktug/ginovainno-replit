# 🚀 Deploy ITU Ginova to Server - EXECUTE NOW

## Server Information
- **IP:** 185.171.24.91
- **SSH Port:** 49636
- **User:** root
- **Password:** ZqYWCgBs71
- **Domain:** ginova.itu.edu.tr
- **Database:** ginvai_db (already imported ✅)

---

## Quick Deployment (30 minutes)

### Step 1: Connect to Server
```bash
ssh -p 49636 root@185.171.24.91
```
Password: `ZqYWCgBs71`

### Step 2: Upload Project Files

**Option A: Using SCP from local machine (if you downloaded project)**
```bash
scp -P 49636 -r /path/to/project/* root@185.171.24.91:/home/ginova/
```

**Option B: Using Git (if pushed to GitHub)**
```bash
cd /home
git clone YOUR_GITHUB_REPO_URL ginova
cd ginova
```

**Option C: Download from URL**
```bash
cd /home
mkdir ginova
cd ginova
# Upload files manually via FTP or CWP file manager
```

### Step 3: Run Deployment Script
```bash
cd /home/ginova
chmod +x DEPLOY_TO_SERVER.sh
./DEPLOY_TO_SERVER.sh
```

### Step 4: Configure Nginx
```bash
chmod +x CONFIGURE_NGINX.sh
./CONFIGURE_NGINX.sh
```

### Step 5: Enable HTTPS (Optional but Recommended)
```bash
certbot --nginx -d ginova.itu.edu.tr
```

### Step 6: Open Firewall Ports
```bash
# Allow HTTP and HTTPS
firewall-cmd --permanent --add-service=http
firewall-cmd --permanent --add-service=https
firewall-cmd --reload
```

---

## Verification

### Check if Application is Running
```bash
pm2 status
pm2 logs ginova-app
```

### Test the Website
Open browser: `http://ginova.itu.edu.tr`

### Check Nginx
```bash
systemctl status nginx
nginx -t
```

### Check Database Connection
```bash
psql -U ginovai_user -d ginvai_db -c "SELECT COUNT(*) FROM users;"
```

---

## Troubleshooting

### Application won't start
```bash
pm2 logs ginova-app --lines 50
```

### Database connection error
- Verify database password in `/home/ginova/.env`
- Check if PostgreSQL is running: `systemctl status postgresql`
- Verify database exists: `psql -U postgres -l | grep ginvai`

### Nginx error
```bash
tail -f /var/log/nginx/ginova_error.log
nginx -t
```

### Port already in use
```bash
lsof -i :5000
# Kill the process if needed
kill -9 PID
```

---

## Post-Deployment Checklist

- [ ] Application running (pm2 status shows "online")
- [ ] Website accessible at ginova.itu.edu.tr
- [ ] Database connected successfully
- [ ] Admin panel accessible (/admin)
- [ ] SSL certificate installed (HTTPS working)
- [ ] PM2 configured to start on boot
- [ ] Firewall rules configured
- [ ] Logs are working (pm2 logs)

---

## Important Files

- **Environment:** `/home/ginova/.env`
- **Logs:** Use `pm2 logs ginova-app`
- **Nginx Config:** `/etc/nginx/conf.d/ginova.conf`
- **Application:** `/home/ginova/`

---

## Need Help?

Common issues and solutions:

1. **"npm: command not found"** → Install Node.js first
2. **"Cannot connect to database"** → Check .env file credentials
3. **"502 Bad Gateway"** → Application not running, check pm2 logs
4. **"Connection refused"** → Nginx not running or misconfigured

---

**TIME ESTIMATE:** 20-30 minutes from start to finish

**STATUS:** Ready to deploy! All scripts and configurations prepared.
