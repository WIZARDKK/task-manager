#!/bin/bash

# Task Manager Backend Deployment Script for Amazon Linux
# This script automates the deployment process

set -e  # Exit on any error

echo "=========================================="
echo "Task Manager Backend Deployment"
echo "Amazon Linux"
echo "=========================================="

# Variables
PROJECT_DIR="/home/ec2-user/task-manager/taskmanager-backend"
VENV_DIR="$PROJECT_DIR/venv"
SERVICE_NAME="gunicorn"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Navigate to project directory
cd $PROJECT_DIR

echo -e "${YELLOW}[1/7] Pulling latest code from repository...${NC}"
git pull origin deploy

echo -e "${YELLOW}[2/7] Activating virtual environment...${NC}"
source $VENV_DIR/bin/activate

echo -e "${YELLOW}[3/7] Installing/updating dependencies...${NC}"
pip install -r requirements.txt

echo -e "${YELLOW}[4/7] Running database migrations...${NC}"
python manage.py migrate --noinput

echo -e "${YELLOW}[5/7] Collecting static files...${NC}"
python manage.py collectstatic --noinput

echo -e "${YELLOW}[6/7] Restarting Gunicorn service...${NC}"
sudo systemctl restart $SERVICE_NAME

echo -e "${YELLOW}[7/7] Checking service status...${NC}"
sudo systemctl status $SERVICE_NAME --no-pager

echo -e "${GREEN}=========================================="
echo -e "✅ Deployment completed successfully!"
echo -e "==========================================${NC}"
