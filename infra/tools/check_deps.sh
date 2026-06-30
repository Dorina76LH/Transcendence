#!/bin/bash

RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m'

echo "Checking dependencies..."

# 1. Vérifier Docker
if ! command -v docker &> /dev/null; then
    echo -e "${RED}Error: Docker is not installed.${NC}"
    echo "Please install it: https://docs.docker.com/get-docker/"
    exit 1
fi

# 2. Vérifier Docker Compose
if ! docker compose version &> /dev/null; then
    echo -e "${RED}Error: Docker Compose plugin is missing.${NC}"
    echo "Please install it: https://docs.docker.com/compose/install/"
    exit 1
fi

# # 3. Vérifier si les ports sont libres
# if ss -tuln | grep -qE ':80\b|:443\b'; then
#     echo -e "${RED}Error: Port 80 or 443 is already in use.${NC}"
#     echo "Stop any other web server (nginx, apache) before running."
#     exit 1
# fi

echo -e "${GREEN}All dependencies are OK! Starting the engine...${NC}"
exit 0
