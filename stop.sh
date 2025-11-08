#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}🛑 Stopping Todo App...${NC}\n"

# Get the script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Stop Frontend
echo -e "${YELLOW}📦 Stopping Frontend...${NC}"
if [ -d "frontend" ]; then
    cd frontend
    docker-compose down
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}   ✓ Frontend stopped${NC}"
    else
        echo -e "${RED}   ✗ Failed to stop frontend${NC}"
    fi
    cd ..
else
    echo -e "${RED}   ✗ Frontend directory not found${NC}"
fi

echo ""

# Stop Backend
echo -e "${YELLOW}📦 Stopping Backend...${NC}"
if [ -d "backend" ]; then
    cd backend
    docker-compose down
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}   ✓ Backend stopped${NC}"
    else
        echo -e "${RED}   ✗ Failed to stop backend${NC}"
    fi
    cd ..
else
    echo -e "${RED}   ✗ Backend directory not found${NC}"
fi

echo ""
echo -e "${GREEN}✅ All services stopped!${NC}\n"

