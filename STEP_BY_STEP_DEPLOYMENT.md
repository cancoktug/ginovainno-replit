# 🚀 ITU Ginova - Step-by-Step Deployment Guide

## Server Information
- **IP:** 185.171.24.91
- **SSH Port:** 49636
- **User:** root
- **Password:** ZqYWCgBs71
- **Domain:** ginova.itu.edu.tr
- **Database:** ginvai_db (✅ already imported)

---

## Step 1: Upload Files to Server (Choose One Method)

### Method A: Using SCP (From Your Computer)
1. Download `ginova-deployment.tar.gz` from Replit
2. Open terminal on your computer
3. Run:
```bash
scp -P 49636 ginova-deployment.tar.gz root@185.171.24.91:/root/
```

### Method B: Using CWP File Manager
1. Download `ginova-deployment.tar.gz` from Replit
2. Log into CWP at http://185.171.24.91:2030
3. Go to File Manager
4. Upload to /root/ directory

### Method C: Using wget (If file is on GitHub)
```bash
ssh -p 49636 root@185.171.24.91
cd /root
wget YOUR_GITHUB_REPO_DOWNLOAD_URL -O ginova-deployment.tar.gz
```

---

## Step 2: Connect to Server

Open terminal and connect:
```bash
ssh -p 49636 root@185.171.24.91
```
Password: `ZqYWCgBs71`

---

## Step 3: Extract Files

```bash
cd /root
tar -xzf ginova-deployment.tar.gz
mkdir -p /home/ginova
mv ginova-deploy/* /home/ginova/
cd /home/ginova
ls -la
```

---

## Step 4: Run Deployment Script

```bash
cd /home/ginova
chmod +x DEPLOY_TO_SERVER.sh
./DEPLOY_TO_SERVER.sh
```

This script will:
- Create .env file with correct database credentials
- Install all npm dependencies
- Install PM2 process manager
- Start the application

---

## Step 5: Configure Nginx

```bash
chmod +x CONFIGURE_NGINX.sh
./CONFIGURE_NGINX.sh
```

This will:
- Create Nginx reverse proxy configuration
- Test configuration
- Restart Nginx

---

## Step 6: Test Website

Open browser: `http://ginova.itu.edu.tr`

You should see the ITU Ginova website!

---

## Step 7: Enable HTTPS (Recommended)

```bash
certbot --nginx -d ginova.itu.edu.tr
```

Follow the prompts to get free SSL certificate from Let's Encrypt.

---

## Verification Commands

### Check Application Status
```bash
pm2 status
pm2 logs ginova-app --lines 20
```

### Check Database Connection
```bash
psql -U ginovai_user -d ginvai_db -c "SELECT COUNT(*) FROM users;"
```
Password: `njG6r1sfI99I`

### Check Nginx Status
```bash
systemctl status nginx
curl -I localhost:5000
```

---

## Quick Troubleshooting

**Application not starting?**
```bash
pm2 logs ginova-app --lines 50
```

**Database connection error?**
```bash
cat /home/ginova/.env | grep DATABASE
psql -U postgres -l | grep ginvai
```

**Nginx 502 error?**
```bash
pm2 status  # Check if app is running
tail -f /var/log/nginx/ginova_error.log
```

**Port already in use?**
```bash
lsof -i :5000
netstat -tulpn | grep 5000
```

---

## Post-Deployment

### Set PM2 to Auto-Start on Reboot
```bash
pm2 startup
pm2 save
```

### Monitor Application
```bash
pm2 monit
```

---

**TOTAL TIME:** 20-30 minutes

**You are now ready to deploy! Start with Step 1.** 🎉
