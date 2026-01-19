# MPPMS Deployment Guide

## 🐳 Docker Deployment

### Prerequisites

- Docker 20.10+
- Docker Compose 2.0+
- Environment variables configured in `.env`

### Quick Start

1. **Build the Docker image**
   ```bash
   docker build -t mppms:latest .
   ```

2. **Run with Docker Compose**
   ```bash
   docker-compose up -d
   ```

3. **Access the application**
   - Open `http://localhost` in your browser
   - Admin panel: `http://localhost/admin`

### Production Deployment

#### Using Docker

```bash
# Build production image
docker build -t mppms:1.0.0 -t mppms:latest .

# Run container
docker run -d \
  --name mppms-prod \
  -p 80:80 \
  -p 443:443 \
  --restart unless-stopped \
  mppms:latest

# View logs
docker logs -f mppms-prod

# Stop container
docker stop mppms-prod

# Remove container
docker rm mppms-prod
```

#### Using Docker Compose

```bash
# Start services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Rebuild and restart
docker-compose up -d --build
```

### Environment Variables

Ensure your `.env` file contains all required variables:

```env
# Admin Credentials
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=SecurePassword123!

# Firebase
VITE_FIREBASE_API_KEY=your_key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_id
VITE_FIREBASE_APP_ID=your_app_id

# Stripe
VITE_STRIPE_PUBLIC_KEY=pk_live_your_key
```

### SSL/TLS Configuration

For HTTPS, modify `docker-compose.yml` to include SSL certificates:

```yaml
services:
  mppms-web:
    volumes:
      - ./ssl/cert.pem:/etc/nginx/ssl/cert.pem:ro
      - ./ssl/key.pem:/etc/nginx/ssl/key.pem:ro
```

Update `nginx.conf`:
```nginx
server {
    listen 443 ssl http2;
    ssl_certificate /etc/nginx/ssl/cert.pem;
    ssl_certificate_key /etc/nginx/ssl/key.pem;
    # ... rest of config
}
```

### Health Checks

The container includes a health check that runs every 30 seconds:

```bash
# Check container health
docker ps

# Expected output: STATUS shows "(healthy)"
```

### Scaling & Performance

#### CPU & Memory Limits

```bash
docker run -d \
  --name mppms-prod \
  --cpus="2.0" \
  --memory="1g" \
  --memory-swap="1g" \
  -p 80:80 \
  mppms:latest
```

#### Multi-container Setup

For high availability, use a reverse proxy (e.g., Traefik, Nginx Proxy Manager) with multiple MPPMS instances.

### Monitoring

#### View Logs

```bash
# Real-time logs
docker logs -f mppms-prod

# Last 100 lines
docker logs --tail 100 mppms-prod

# Since timestamp
docker logs --since 2024-01-01T00:00:00 mppms-prod
```

#### Container Stats

```bash
docker stats mppms-prod
```

### Backup & Restore

#### Backup

```bash
# Export container
docker export mppms-prod > mppms-backup.tar

# Save image
docker save mppms:latest > mppms-image.tar
```

#### Restore

```bash
# Load image
docker load < mppms-image.tar

# Run from backup
docker import mppms-backup.tar mppms:backup
```

### Troubleshooting

#### Container won't start

```bash
# Check logs
docker logs mppms-prod

# Inspect container
docker inspect mppms-prod

# Enter container shell
docker exec -it mppms-prod sh
```

#### Port already in use

```bash
# Find process using port 80
lsof -i :80

# Or use different port
docker run -p 8080:80 mppms:latest
```

#### Build fails

```bash
# Clear build cache
docker builder prune -a

# Rebuild with no cache
docker build --no-cache -t mppms:latest .
```

### Security Best Practices

1. **Use non-root user** (already configured in Dockerfile)
2. **Scan images** for vulnerabilities:
   ```bash
   docker scan mppms:latest
   ```
3. **Keep base images updated**:
   ```bash
   docker pull nginx:alpine
   docker build -t mppms:latest .
   ```
4. **Use secrets** for sensitive data (Docker Swarm or Kubernetes)

### Production Checklist

- [ ] Environment variables configured
- [ ] SSL certificates installed
- [ ] Firestore security rules deployed
- [ ] Firebase Authentication providers enabled
- [ ] Stripe webhook configured (if using)
- [ ] Health checks passing
- [ ] Logs monitoring set up
- [ ] Backup strategy in place
- [ ] Domain DNS configured

---

## 🚀 Alternative Deployment Options

### Firebase Hosting

```bash
npm run build
firebase deploy --only hosting
```

### Vercel

```bash
npm install -g vercel
vercel --prod
```

### Netlify

```bash
npm install -g netlify-cli
netlify deploy --prod
```

---

## 📞 Support

For deployment issues, contact:
- Email: devops@mppms.app
- Issues: [GitHub Issues](https://github.com/yourusername/mppms/issues)
