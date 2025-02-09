#!/bin/bash
set -euo pipefail

# Install fonts and update font cache
apk --no-cache add --virtual fonts msttcorefonts-installer fontconfig
update-ms-fonts
fc-cache -f
apk del fonts
find /usr/share/fonts/truetype/msttcorefonts/ -type l -exec unlink {} \;

# Install additional OS dependencies
apk add --no-cache \
    python3 \
    py3-pip \
    python3-dev \
    py3-requests \
    py3-geoip2 \
    py3-pillow \
    py3-openssl \
    py3-cryptography \
    gcc \
    musl-dev \
    libffi-dev \
    openssl-dev \
    chromium \
    chromium-chromedriver \
    jq \
    whois \
    geoip \
    nmap \
    wget \
    curl \
    git \
    openssh \
    graphicsmagick \
    tini \
    tzdata \
    ca-certificates \
    libc6-compat