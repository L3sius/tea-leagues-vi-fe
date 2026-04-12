# Deployment

All commands run from /root/tea-leagues-vi-fe.

## Common operations

- Start:   docker compose up -d
- Stop:    docker compose down
- Restart: docker compose restart
- Logs:    docker compose logs -f
- Rebuild: docker compose up -d --build

## Architecture

- Nginx (systemd) listens on ports 80/443 publicly
- HTTP auto-redirects to HTTPS (Let's Encrypt, auto-renews)
- Nginx proxies to Docker container on 127.0.0.1:3000
- Config: /etc/nginx/sites-enabled/tea-frontend

## Useful commands

- nginx status:  systemctl status nginx
- nginx restart: systemctl restart nginx
- cert status:   certbot certificates
- cert renew:    certbot renew --dry-run