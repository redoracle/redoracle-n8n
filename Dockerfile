ARG NODE_VERSION=20

# 1. Create an image to build n8n
FROM n8nio/base:${NODE_VERSION} AS builder

# Disable lefthook installation during build
ENV LEFTHOOK_SKIP_INSTALL=1

# Install additional OS dependencies
RUN apk --no-cache add --virtual fonts msttcorefonts-installer fontconfig && \
    update-ms-fonts && \
    fc-cache -f && \
    apk del fonts && \
    find /usr/share/fonts/truetype/msttcorefonts/ -type l -exec unlink {} \; && \
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

# Build the application from source
WORKDIR /src
COPY . /src
# Configure pnpm to use longer timeout and retries
RUN corepack disable && \
    pnpm config set fetch-timeout 600000 && \
    pnpm config set fetch-retries 5 && \
    pnpm config set registry https://registry.npmjs.org/

RUN --mount=type=cache,id=pnpm-store,target=/root/.local/share/pnpm/store \
    --mount=type=cache,id=pnpm-metadata,target=/root/.cache/pnpm/metadata \
    DOCKER_BUILD=true pnpm install --frozen-lockfile

# Install additional JS libraries without running lifecycle scripts
RUN pnpm install --ignore-scripts --save -w \
        full-icu@1.5.0 \
        @aws-sdk/client-sso-oidc@">=3.664.0 <4.0.0-0" \
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
        
RUN pnpm install --ignore-scripts --save-dev -w @types/natural

RUN pnpm build

# Delete all dev dependencies
RUN jq 'del(.pnpm.patchedDependencies)' package.json > package.json.tmp; mv package.json.tmp package.json
RUN node .github/scripts/trim-fe-packageJson.js

# Delete any source code, source-mapping, or typings
RUN find . -type f -name "*.ts" -o -name "*.js.map" -o -name "*.vue" -o -name "tsconfig.json" -o -name "*.tsbuildinfo" | xargs rm -rf

# Deploy the `n8n` package into /compiled
RUN mkdir /compiled
RUN NODE_ENV=production DOCKER_BUILD=true pnpm --filter=n8n --prod --no-optional deploy /compiled

# 2. Start with a new clean image with just the code that is needed to run n8n
FROM n8nio/base:${NODE_VERSION}
ENV NODE_ENV=production

ARG N8N_RELEASE_TYPE=dev
ENV N8N_RELEASE_TYPE=${N8N_RELEASE_TYPE}

WORKDIR /home/node
COPY --from=builder /compiled /usr/local/lib/node_modules/n8n
COPY docker/images/n8n/docker-entrypoint.sh /

# Setup the Task Runner Launcher
ARG TARGETPLATFORM
ARG LAUNCHER_VERSION=1.1.0
COPY docker/images/n8n/n8n-task-runners.json /etc/n8n-task-runners.json
# Download, verify, then extract the launcher binary
RUN \
	if [[ "$TARGETPLATFORM" = "linux/amd64" ]]; then export ARCH_NAME="amd64"; \
	elif [[ "$TARGETPLATFORM" = "linux/arm64" ]]; then export ARCH_NAME="arm64"; fi; \
	mkdir /launcher-temp && \
	cd /launcher-temp && \
	wget https://github.com/n8n-io/task-runner-launcher/releases/download/${LAUNCHER_VERSION}/task-runner-launcher-${LAUNCHER_VERSION}-linux-${ARCH_NAME}.tar.gz && \
	wget https://github.com/n8n-io/task-runner-launcher/releases/download/${LAUNCHER_VERSION}/task-runner-launcher-${LAUNCHER_VERSION}-linux-${ARCH_NAME}.tar.gz.sha256 && \
	# The .sha256 does not contain the filename --> Form the correct checksum file
	echo "$(cat task-runner-launcher-${LAUNCHER_VERSION}-linux-${ARCH_NAME}.tar.gz.sha256) task-runner-launcher-${LAUNCHER_VERSION}-linux-${ARCH_NAME}.tar.gz" > checksum.sha256 && \
	sha256sum -c checksum.sha256 && \
	tar xvf task-runner-launcher-${LAUNCHER_VERSION}-linux-${ARCH_NAME}.tar.gz --directory=/usr/local/bin && \
	cd - && \
	rm -r /launcher-temp

RUN \
	cd /usr/local/lib/node_modules/n8n && \
	npm rebuild sqlite3 && \
	cd - && \
	ln -s /usr/local/lib/node_modules/n8n/bin/n8n /usr/local/bin/n8n && \
	mkdir .n8n && \
	chown node:node .n8n

ENV SHELL /bin/sh
USER node
ENTRYPOINT ["tini", "--", "/docker-entrypoint.sh"]	