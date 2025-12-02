# 🚀 ITU Ginova - YOUR DEPLOYMENT GUIDE

## ✅ What's Ready

- **Deployment Package:** ginova-deployment.tar.gz (365MB)
- **Server Access:** SSH credentials confirmed
- **Database:** ginvai_db already imported and ready
- **Scripts:** Automated deployment and Nginx configuration
- **Domain:** ginova.itu.edu.tr

---

## 📥 STEP 1: Download Deployment Package

Download `ginova-deployment.tar.gz` from Replit:
1. Click on Files tab in Replit
2. Find `ginova-deployment.tar.gz`
3. Right-click → Download

---

## 🔐 STEP 2: Connect to Server

Open terminal (Mac/Linux) or PuTTY (Windows):

```bash
ssh -p 49636 root@185.171.24.91
```

When prompted, enter password: `ZqYWCgBs71`

---

## 📤 STEP 3: Upload Files

### Option A: Using SCP (Recommended)

From your computer (NOT from server):
```bash
scp -P 49636 /path/to/ginova-deployment.tar.gz root@185.171.24.91:/root/
```

### Option B: Using CWP File Manager

1. Go to: http://185.171.24.91:2030
2. Login with root credentials
3. File Manager → Upload → Select ginova-deployment.tar.gz
4. Upload to /root/

---

## 🔧 STEP 4: Extract and Deploy

SSH to server:
```bash
ssh -p 49636 root@185.171.24.91
```

Then run:
```bash
cd /root
tar -xzf ginova-deployment.tar.gz
mkdir -p /home/ginova
cp -r ginova-deploy/* /home/ginova/
cd /home/ginova
chmod +x DEPLOY_TO_SERVER.sh
./DEPLOY_TO_SERVER.sh
```

**Wait for script to complete (5-10 minutes)**

---

## 🌐 STEP 5: Configure Nginx

Still on server:
```bash
cd /home/ginova
chmod +x CONFIGURE_NGINX.sh
./CONFIGURE_NGINX.sh
```

---

## ✅ STEP 6: Verify Deployment

### Check Application
```bash
pm2 status
pm2 logs ginova-app --lines 20
```

### Test Website
Open browser: `http://ginova.itu.edu.tr`

You should see the ITU Ginova website!

---

## 🔒 STEP 7: Enable HTTPS (Recommended)

```bash
certbot --nginx -d ginova.itu.edu.tr
```

Follow prompts. Website will be available at: `https://ginova.itu.edu.tr`

---

## 🔥 STEP 8: Configure Firewall

```bash
firewall-cmd --permanent --add-service=http
firewall-cmd --permanent --add-service=https
firewall-cmd --reload
```

---

## 🎯 Quick Commands Reference

### Application Management
```bash
pm2 status                    # Check status
pm2 logs ginova-app          # View logs
pm2 restart ginova-app       # Restart app
pm2 stop ginova-app          # Stop app
pm2 monit                    # Monitor resources
```

### Database Check
```bash
psql -U ginovai_user -d ginvai_db -c "SELECT COUNT(*) FROM users;"
# Password: njG6r1sfI99I
```

### Nginx Management
```bash
systemctl status nginx       # Check Nginx status
systemctl restart nginx      # Restart Nginx
nginx -t                     # Test configuration
tail -f /var/log/nginx/ginova_error.log  # View errors
```

---

## 🐛 Troubleshooting

### Application Not Starting?
```bash
pm2 logs ginova-app --lines 50
cat /home/ginova/.env | grep DATABASE
```

### Database Connection Error?
```bash
psql -U postgres -l | grep ginvai
psql -U ginovai_user -d ginvai_db
# Password: njG6r1sfI99I
```

### Nginx 502 Bad Gateway?
```bash
pm2 status  # Check if app is running
curl -I localhost:5000  # Test local connection
tail -f /var/log/nginx/ginova_error.log
```

### Port Already in Use?
```bash
lsof -i :5000
netstat -tulpn | grep 5000
# Kill process if needed:
kill -9 <PID>
```

---

## ✅ Post-Deployment Checklist

- [ ] Application running (pm2 status shows "online")
- [ ] Website accessible at ginova.itu.edu.tr
- [ ] Database connection working
- [ ] Admin panel accessible (/admin)
- [ ] HTTPS/SSL configured
- [ ] PM2 auto-start configured
- [ ] Firewall rules set
- [ ] Logs directory created

---

## 📁 Important Locations

- **Application:** `/home/ginova/`
- **Environment:** `/home/ginova/.env`
- **Logs:** `/home/ginova/logs/`
- **Nginx Config:** `/etc/nginx/conf.d/ginova.conf`
- **PM2 Config:** `/home/ginova/ecosystem.config.cjs`

---

## ⏱️ Timeline

- **Upload files:** 5-10 minutes
- **Extract & deploy:** 5-10 minutes
- **Configure Nginx:** 2 minutes
- **SSL setup:** 2-5 minutes
- **Testing:** 5 minutes

**TOTAL TIME:** 20-30 minutes

---

## 🎉 Success!

Your ITU Ginova platform is now live at **ginova.itu.edu.tr**

If you need any help, check the troubleshooting section above or contact support.

**Happy deploying!** 🚀
