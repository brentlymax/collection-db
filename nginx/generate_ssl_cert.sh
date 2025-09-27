#!/bin/bash

DOMAIN="brentlymax.com"
EMAIL="brentlymaxwell@gmail.com"

/usr/bin/sudo certbot certonly \
    --standalone \
    --agree-tos \
    --email "$EMAIL" \
    -d "$DOMAIN" \
    -d "www.$DOMAIN"

echo "Certbot certificate creation process complete."
