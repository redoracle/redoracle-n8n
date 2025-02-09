# Use the official n8n image as the base
FROM n8nio/n8n:latest

# Maintainer label
LABEL maintainer="Redoracle <support@redoracle.com>"

# Switch to root to install additional dependencies
USER root

# Install fonts
RUN apk --no-cache add --virtual fonts msttcorefonts-installer fontconfig && \
    update-ms-fonts && \
    fc-cache -f && \
    apk del fonts && \
    find /usr/share/fonts/truetype/msttcorefonts/ -type l -exec unlink {} \;

# Install additional OS dependencies
RUN apk add --no-cache \
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

# Install additional Python packages
# RUN pip install --no-cache-dir --break-system-packages \
#     selenium \
#     shodan \
#     trafilatura \
#     neo4j \
#     Levenshtein \
#     spacy \ 
#     nltk

# # Download NLTK data
# RUN python3 -m spacy download en_core_web_sm

# # Add Python virtual environment to PATH
# ENV PATH="/app/venv/bin:$PATH"

# Set environment variables for n8n's existing node_modules
ENV NODE_PATH="/usr/local/lib/node_modules/n8n/node_modules"
ENV PATH="$NODE_PATH/.bin:$PATH"

# # Set PNPM Global Directory
# ENV PNPM_HOME="/home/node/.pnpm"
# ENV PATH="$PNPM_HOME:$PATH"

# # Ensure npm and pnpm are up-to-date, using existing installations if available
# RUN if command -v npm >/dev/null 2>&1; then \
#         npm config set fetch-retry-mintimeout 20000 && \
#         npm config set fetch-retry-maxtimeout 120000 && \
#         npm config set fetch-timeout 300000 && \
#         npm update -g; \
#     else \
#         npm install -g npm@9.9.2 --fetch-timeout=300000; \
#     fi

# # Enable Corepack and install/update pnpm properly
# RUN corepack enable \
#     && corepack prepare pnpm@latest --activate \
#     && pnpm self-update

# # Ensure the correct owner for PNPM_HOME
# RUN mkdir -p $PNPM_HOME && chown -R node:node $PNPM_HOME

# Set working directory to n8n’s existing node_modules for package installation
WORKDIR /usr/local/lib/node_modules/n8n

# Install additional dependencies within n8n’s existing node_modules directory
RUN npm install -g --unsafe-perm \
    full-icu@1.5.0 \
    neo4j-driver \
    fast-levenshtein \
    axios \
    compromise \
    natural \
    wink-nlp \
    wink-ner \
    shodan \
    node-readability \
    selenium-webdriver

# Ensure correct ownership for the node user
# RUN chown -R node:node /usr/local/lib/node_modules/n8n/node_modules

# Clean up unnecessary files
RUN rm -rf /lib/apk/db /var/cache/apk/ /tmp/* /root/.npm /root/.cache/node /opt/yarn* /tmp/v8-compile-cache*

# Switch back to the node user for security
USER node
WORKDIR /home/node

# Optional environment variables for logging
ENV REDORACLE_VERBOSE_LOGGING=false
ENV REDORACLE_LOG_FILE=""

# Switch to root for copying Python scripts
USER root

# Copy Python scripts
RUN mkdir -p /app/scripts/
COPY redoracle-n8n-plugins/scripts/ /app/scripts/
RUN chmod +x /app/scripts/*.py

# Copy plugin directories
COPY redoracle-n8n-plugins/redoracle-scraper/ /app/redoracle-scraper
COPY redoracle-n8n-plugins/redoracle-security/ /app/redoracle-security
COPY redoracle-n8n-plugins/redoracle-automation/ /app/redoracle-automation

# Install plugins inside n8n's existing node_modules
WORKDIR /usr/local/lib/node_modules/n8n

RUN npm install -g --no-save n8n-workflow /app/redoracle-scraper /app/redoracle-security /app/redoracle-automation

# Ensure correct ownership for the node user
# RUN chown -R node:node /usr/local/lib/node_modules/n8n/node_modules

# Switch back to the node user
USER node
WORKDIR /app

# Expose n8n's default port
EXPOSE 5678

# Use node to start n8n explicitly
CMD ["/usr/local/bin/n8n"]
