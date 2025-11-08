#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}🚀 Starting Todo App setup...${NC}\n"

# Get the script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Function to check if .env file exists
check_env_file() {
    local dir=$1
    if [ ! -f "$dir/.env" ]; then
        echo -e "${YELLOW}⚠️  Warning: $dir/.env not found${NC}"
        if [ -f "$dir/env.example" ]; then
            echo -e "${YELLOW}   Creating .env from env.example...${NC}"
            cp "$dir/env.example" "$dir/.env"
            echo -e "${GREEN}   ✓ Created $dir/.env (please update it with your values)${NC}"
        else
            echo -e "${RED}   ✗ env.example not found in $dir${NC}"
            return 1
        fi
    fi
    return 0
}

# Start Backend
echo -e "${YELLOW}📦 Starting Backend...${NC}"
if [ -d "backend" ]; then
    cd backend
    
    # Check for .env file
    check_env_file "."
    
    echo -e "${YELLOW}   Building and starting backend containers...${NC}"
    docker-compose up -d --build
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}   ✓ Backend started successfully${NC}"
    else
        echo -e "${RED}   ✗ Failed to start backend${NC}"
        cd ..
        exit 1
    fi
    
    cd ..
else
    echo -e "${RED}   ✗ Backend directory not found${NC}"
    exit 1
fi

echo ""

# Wait a bit for backend to be ready
echo -e "${YELLOW}⏳ Waiting for backend to be ready...${NC}"
sleep 5

# Start Frontend
echo -e "${YELLOW}📦 Starting Frontend...${NC}"
if [ -d "frontend" ]; then
    cd frontend
    
    # Check for .env file
    check_env_file "."
    
    echo -e "${YELLOW}   Building and starting frontend container...${NC}"
    docker-compose up -d --build
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}   ✓ Frontend started successfully${NC}"
    else
        echo -e "${RED}   ✗ Failed to start frontend${NC}"
        cd ..
        exit 1
    fi
    
    cd ..
else
    echo -e "${RED}   ✗ Frontend directory not found${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}✅ Setup completed successfully!${NC}\n"
echo -e "${YELLOW}📋 Useful commands:${NC}"
echo -e "   View logs:        docker-compose logs -f"
echo -e "   Stop all:         ./stop.sh (or docker-compose down in each directory)"
echo -e "   Backend logs:     cd backend && docker-compose logs -f"
echo -e "   Frontend logs:    cd frontend && docker-compose logs -f"
echo ""

