# Amazon Linux 2023 Deployment - Quick Start

## 🚀 Amazon Linux Specific Instructions

Amazon Linux uses different package manager (`dnf` instead of `apt`) and paths.

### Key Differences from Ubuntu:

| Aspect | Amazon Linux 2023 | Ubuntu 22.04 |
|--------|-------------------|--------------|
| User | `ec2-user` | `ubuntu` |
| Package Manager | `dnf` | `apt` |
| Database | MySQL 8.0 | MySQL 8.0 |
| Nginx Group | `nginx` | `www-data` |
| Python | Python 3.9/3.11 | Python 3.10/3.11 |
| Config Location | `/etc/nginx/conf.d/` | `/etc/nginx/sites-available/` |

---

## 📋 Quick Start for Amazon Linux

### 1. Launch EC2 Instance
- **AMI**: Amazon Linux 2023 (Free tier eligible)
- **Instance Type**: t2.micro or t2.small
- **Security Groups**: SSH (22), HTTP (80), HTTPS (443)

### 2. Connect to EC2
```bash
ssh -i "your-key.pem" ec2-user@YOUR-EC2-IP
```

### 3. Install System Packages
```bash
# Update system
sudo dnf update -y

# Install Python 3.11
sudo dnf install -y python3.11 python3.11-pip python3.11-devel

# Install MySQL 8.0
sudo dnf install -y mysql-community-server mysql-community-client mysql-community-devel

# Install Nginx
sudo dnf install -y nginx

# Install development tools
sudo dnf install -y git gcc gcc-c++ make
```

### 4. Start and Configure MySQL
```bash
# Start MySQL
sudo systemctl start mysqld
sudo systemctl enable mysqld

# Get temporary root password
sudo grep 'temporary password' /var/log/mysqld.log

# Secure installation (use temporary password when prompted)
sudo mysql_secure_installation
# Answer: Y, Y, Y, Y, Y (set new root password)

# Create database
sudo mysql -u root -p
```

```sql
CREATE DATABASE taskmanager_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'taskmanager_user'@'localhost' IDENTIFIED BY 'YOUR_STRONG_PASSWORD';
GRANT ALL PRIVILEGES ON taskmanager_db.* TO 'taskmanager_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### 5. Clone Repository
```bash
cd /home/ec2-user
git clone https://github.com/WIZARDKK/task-manager.git
cd task-manager/taskmanager-backend
```

### 6. Setup Python Environment
```bash
# Create virtual environment with Python 3.11
python3.11 -m venv venv
source venv/bin/activate

# Upgrade pip
pip install --upgrade pip

# Install dependencies
pip install -r requirements.txt
```

### 7. Configure Environment
```bash
# Edit .env file
nano .env
```

Update these values:
```env
DEBUG=False
ALLOWED_HOSTS=YOUR-EC2-IP,your-domain.com
DB_NAME=taskmanager_db
DB_USER=taskmanager_user
DB_PASSWORD=YOUR_STRONG_PASSWORD
```

### 8. Run Django Setup
```bash
# Check configuration
python manage.py check

# Run migrations
python manage.py migrate

# Collect static files
python manage.py collectstatic --noinput

# Create superuser (optional)
python manage.py createsuperuser
```

### 9. Setup Gunicorn Service
```bash
# Create log directories
sudo mkdir -p /var/log/gunicorn
sudo mkdir -p /var/run/gunicorn
sudo chown -R ec2-user:nginx /var/log/gunicorn
sudo chown -R ec2-user:nginx /var/run/gunicorn

# Copy service file
sudo cp deploy/gunicorn-amazonlinux.service /etc/systemd/system/gunicorn.service

# Start and enable service
sudo systemctl daemon-reload
sudo systemctl start gunicorn
sudo systemctl enable gunicorn

# Check status
sudo systemctl status gunicorn
```

### 10. Setup Nginx
```bash
# Copy Nginx configuration
sudo cp deploy/nginx-amazonlinux.conf /etc/nginx/conf.d/taskmanager.conf

# Edit the file to update domain/IP
sudo nano /etc/nginx/conf.d/taskmanager.conf
# Replace 'your-domain.com' with your EC2 IP or domain

# Test configuration
sudo nginx -t

# Start and enable Nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# Check status
sudo systemctl status nginx
```

### 11. Configure Firewall (Optional but Recommended)
```bash
# Amazon Linux uses firewalld
sudo systemctl start firewalld
sudo systemctl enable firewalld

# Allow HTTP and HTTPS
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --reload

# Check rules
sudo firewall-cmd --list-all
```

### 12. Test Deployment
Visit in browser:
- `http://YOUR-EC2-IP/admin/`
- `http://YOUR-EC2-IP/api/`

---

## 🔄 Update Deployment (After Initial Setup)

```bash
cd /home/ec2-user/task-manager/taskmanager-backend
chmod +x deploy/deploy-amazonlinux.sh
./deploy/deploy-amazonlinux.sh
```

---

## 🔍 Common Commands for Amazon Linux

### Service Management
```bash
# Restart services
sudo systemctl restart gunicorn nginx mysqld

# Check status
sudo systemctl status gunicorn nginx mysqld

# View logs
sudo journalctl -u gunicorn -f
sudo journalctl -u nginx -f
sudo journalctl -u mysqld -f
```

### Package Management
```bash
# Update system
sudo dnf update -y

# Install package
sudo dnf install -y package-name

# Search for package
sudo dnf search package-name

# List installed packages
sudo dnf list installed
```

### Database Management
```bash
# Connect to MySQL
mysql -u taskmanager_user -p taskmanager_db

# Backup database
mysqldump -u taskmanager_user -p taskmanager_db > backup.sql

# Restore database
mysql -u taskmanager_user -p taskmanager_db < backup.sql
```

---

## 🔒 SSL Certificate Setup

```bash
# Install Certbot
sudo dnf install -y certbot python3-certbot-nginx

# Obtain certificate
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# Auto-renewal test
sudo certbot renew --dry-run
```

---

## 🆘 Troubleshooting Amazon Linux Specific Issues

### SELinux Issues
```bash
# Check SELinux status
getenforce

# If enforcing, you may need to set permissions
sudo chcon -Rt httpd_sys_content_t /home/ec2-user/task-manager/taskmanager-backend/staticfiles/
sudo chcon -Rt httpd_sys_content_t /home/ec2-user/task-manager/taskmanager-backend/media/

# Or temporarily set to permissive (not recommended for production)
sudo setenforce 0
```

### Python MySQL Connector Issues
```bash
# If mysqlclient fails to install
sudo dnf install -y python3-devel mysql-community-devel gcc
pip install mysqlclient
```

### Nginx Permission Denied
```bash
# Fix ownership
sudo chown -R ec2-user:nginx /home/ec2-user/task-manager/taskmanager-backend
sudo chmod -R 755 /home/ec2-user/task-manager/taskmanager-backend

# Set proper permissions for static files
sudo chmod -R 755 /home/ec2-user/task-manager/taskmanager-backend/staticfiles
```

---

## 📊 Monitoring

```bash
# Check system resources
top
htop  # (install with: sudo dnf install htop)

# Check disk space
df -h

# Check memory
free -h

# Check network
ss -tulpn
```

---

## 🎯 Performance Tips for Amazon Linux

1. **Enable HTTP/2** in Nginx for better performance
2. **Use CloudWatch** for monitoring (built into AWS)
3. **Enable caching** with Redis (optional)
4. **Use RDS** for production database (optional)
5. **Set up Auto Scaling** if traffic increases

---

## 📞 Quick Reference

**Project Path:** `/home/ec2-user/task-manager/taskmanager-backend`

**Configuration Files:**
- Nginx: `/etc/nginx/conf.d/taskmanager.conf`
- Gunicorn Service: `/etc/systemd/system/gunicorn.service`
- Environment: `/home/ec2-user/task-manager/taskmanager-backend/.env`
- MySQL: `/etc/my.cnf`

**Log Files:**
- Gunicorn: `/var/log/gunicorn/error.log`
- Nginx: `/var/log/nginx/error.log`
- MySQL: `/var/log/mysqld.log`

**Restart All:**
```bash
sudo systemctl restart gunicorn nginx mysqld
```

---

## ✅ Deployment Checklist

- [ ] EC2 instance launched with Amazon Linux 2023
- [ ] Connected via SSH as ec2-user
- [ ] System updated: `sudo dnf update -y`
- [ ] Python 3.11 installed
- [ ] MySQL 8.0 installed and configured
- [ ] Nginx installed
- [ ] Repository cloned
- [ ] Virtual environment created
- [ ] Dependencies installed
- [ ] .env configured
- [ ] Database migrations run
- [ ] Static files collected
- [ ] Gunicorn service running
- [ ] Nginx configured and running
- [ ] Firewall configured (optional)
- [ ] SSL certificate installed (optional)
- [ ] Mobile app updated with production URL
- [ ] All endpoints tested

---

**Estimated Time:** 2-3 hours for first deployment

**Need Help?** Check the main `AWS_DEPLOYMENT_GUIDE.md` for detailed explanations.
