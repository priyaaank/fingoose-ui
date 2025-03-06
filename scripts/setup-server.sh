#!/bin/bash
set -e

# Update system
sudo apt update && sudo apt upgrade -y

# Install required packages
sudo apt install -y nginx certbot python3-certbot-nginx

# Install Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Configure firewall
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw --force enable

# Create application directory
sudo mkdir -p /var/www/wealthtracker
sudo chown -R $USER:$USER /var/www/wealthtracker

# Remove default nginx site
sudo rm -f /etc/nginx/sites-enabled/default

# Create SSL certificate (uncomment and update domain)
# sudo certbot --nginx -d yourdomain.com

# Create nginx configuration
sudo tee /etc/nginx/sites-available/react-app << EOF
server {
    listen 80;
    server_name \$host;

    root /var/www/html;
    index index.html;

    # Handle React routing
    location / {
        try_files \$uri \$uri/ /index.html;
        add_header Cache-Control "no-cache";
    }

    # Static files caching
    location /static {
        expires 1y;
        add_header Cache-Control "public, no-transform";
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-XSS-Protection "1; mode=block";
    add_header X-Content-Type-Options "nosniff";
    
    # Enable CORS
    add_header 'Access-Control-Allow-Origin' '*';
    add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS, PUT, DELETE';
    add_header 'Access-Control-Allow-Headers' 'DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range';
}
EOF

# Enable the site
sudo ln -sf /etc/nginx/sites-available/react-app /etc/nginx/sites-enabled/

# Test and restart nginx
sudo nginx -t && sudo systemctl restart nginx 