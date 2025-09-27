# Collection Database
Database of my collections. Written as a MERN stack.

## App Architecture
- backend
- docker
- frontend
- nginx

## Prerequisite Libraries to Install Locally
- git
- docker
- docker compose v2
- make
- nvm
- npm

## Development Container Purposes
- Frontend container
    - Runs development react app (npm run dev)
- Nginx container
    - A reverse proxy that serves app to localhost

## Production Container Purposes
- Frontend container
    - Uses multi-stage docker build
        - Builds production app (npm run build)
        - Copies built app into nginx html directory
    - A reverse proxy that serves app to elastic IP
- Certbot container
    - renews certbot certificates when they expire
    - requires an initial generation of certificates before deploying

## Run Development
- make -C docker dev-up
- make -C docker dev-down

## Run Production
- make -C docker prod-up
- make -C docker prod-down

## Generate Certbot Certificates
- ./nginx/generate_ssl_cert.sh
- NOTE: This should place certs in /etc/letsencrypt/live/*
- NOTE: compose.prod.yml copies /etc/letsencrypt/* into both prod containers
