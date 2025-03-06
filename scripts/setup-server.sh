#!/bin/bash
set -e

# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker dependencies
sudo apt install -y \
    apt-transport-https \
    ca-certificates \
    curl \
    gnupg \
    lsb-release

# Add Docker's official GPG key
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# Set up Docker repository
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Install Docker
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io

# Add user to docker group
sudo usermod -aG docker $USER

# Configure firewall
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw --force enable

# Start Docker
sudo systemctl enable docker
sudo systemctl start docker

# Install required packages
sudo apt install -y nginx certbot python3-certbot-nginx

# Install Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

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