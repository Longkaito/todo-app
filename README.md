# Todo App

Todo application with authentication and admin panel.

## Quick Start

### Make scripts executable

```bash
chmod +x setup.sh stop.sh
```

### Start all services

```bash
./setup.sh
```

### Stop all services

```bash
./stop.sh
```

### Prerequisites

- **⚠️ Make sure Docker service is running** (start Docker Desktop or Docker daemon)
- Docker and Docker Compose installed
- `.env` files in both `backend/` and `frontend/` directories (will be created automatically from `env.example` if not exists)

## Services

- **Backend**: http://localhost:8999 (configurable via `backend/.env`)
- **Frontend**: http://localhost:3000 (configurable via `frontend/.env`)

## Useful Commands

### View logs

```bash
# Backend logs
cd backend && docker-compose logs -f

# Frontend logs
cd frontend && docker-compose logs -f
```

### Stop services individually

```bash
# Stop backend
cd backend && docker-compose down

# Stop frontend
cd frontend && docker-compose down
```

### Restart services

```bash
./stop.sh
./setup.sh
```

## Default Admin Account

After first setup, you can login with:

- **Username**: `admin@example.com`
- **Password**: `admin123`
