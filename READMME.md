# Redoracle Plugins for n8n

Welcome to the **Redoracle Plugins** project — a comprehensive, modular set of n8n custom nodes and integrations tailored for scraping, security, automation, and threat intelligence workflows. These plugins are designed to streamline tasks such as web content extraction, IP reputation checks, breach monitoring, and automated notifications, all within the powerful, no-code/low-code environment of [n8n](https://n8n.io/).

## Key Resources

- **GitHub Repository**: [redoracle/n8n-plugins](https://github.com/redoracle/n8n-plugins)  
- **Docker Hub Image**: [redoracle-n8n-plugins](https://hub.docker.com/r/redoracle/redoracle-n8n-plugins)  
- **GitHub Container Registry Image**: [http://ghcr.io](http://ghcr.io)  

The **Redoracle n8n Node** image contains all the plugins and tools you need for an enhanced n8n experience — a true n8n node on steroids.

## Key Features

- **Scraping (Static & Dynamic)**:  
  - **Static Scraper Node**: Fetch and parse static web pages.  
  - **Dynamic Scraper Node**: Utilize Selenium-based Python scripts to render and extract content from JavaScript-heavy websites.

- **Security & Threat Intelligence**:  
  - **WHOIS Lookup**: Retrieve domain/IP ownership and registration details.  
  - **Shodan Lookup**: Query Shodan to uncover open ports, exposed services, and other host insights.  
  - **GeoIP Lookup**: Determine geographic location data from IP addresses.  
  - **VirusTotal Lookup**: Check domains, IPs, or file hashes against the VirusTotal database for malicious indicators.  
  - **AbuseIPDB Lookup**: Assess IP reputations to identify malicious activity.  
  - **Have I Been Pwned (HIBP) Lookup**: Quickly check if an email has appeared in known data breaches.

- **Automation & Integration**:  
  - **Telegram Bot**: Automatically send messages or alerts to Telegram chats.  
  - **Helpdesk Ticket**: Create tickets in helpdesk platforms (e.g., Zendesk, Freshdesk) for incident response or customer support.

- **Extensible & Customizable**:  
  Easily integrate additional APIs, services, and scripts. The project structure and modular codebase support straightforward expansions and custom credentials.

## Project Structure

```bash
redoracle-n8n-plugins/
├── redoracle-scraper/
│   ├── package.json
│   ├── index.js
│   └── nodes/
│       ├── staticScraper.js
│       └── dynamicScraper.js
├── redoracle-security/
│   ├── package.json
│   ├── index.js
│   ├── credentials/
│   │   ├── shodanApi.credentials.js
│   │   ├── virusTotalApi.credentials.js
│   │   ├── abuseIPDBApi.credentials.js
│   │   └── haveIBeenPwnedApi.credentials.js
│   └── nodes/
│       ├── whoisLookup.js
│       ├── shodanLookup.js
│       ├── geoipLookup.js
│       ├── virusTotalLookup.js
│       ├── abuseIPDBLookup.js
│       └── haveIBeenPwnedLookup.js
├── redoracle-automation/
│   ├── package.json
│   ├── index.js
│   ├── credentials/
│   │   └── telegramBot.credentials.js
│   └── nodes/
│       ├── telegramBot.js
│       └── helpdeskTicket.js
├── scripts/
│   ├── selenium_scraper.py
│   ├── geoip_lookup.py
│   ├── shodan_lookup.py
│   ├── whois_lookup.py
│   ├── virusTotal_lookup.py
│   └── abuseIPDB_lookup.py
├── Dockerfile
└── docker-compose.yml
```

Prerequisites
 • Docker & Docker Compose: To build and run the n8n container.
 • n8n: The workflow automation tool this project extends.
 • API Keys (optional but recommended):
 • Shodan, VirusTotal, AbuseIPDB, Have I Been Pwned, Telegram Bot, etc.
Store these securely using n8n’s Credentials feature.

Installation & Setup

 1. Clone the Repository:

```
git clone https://github.com/redoracle/n8n-plugins.git
cd redoracle-n8n-plugins
```

2. Create Data & Logs Directories (Optional):

```
mkdir -p n8n_data
mkdir -p logs
```

 3. Build the Docker Image:

```
docker-compose build
```

 4. Run the Container:

```
docker-compose up -d
```

By default, n8n’s UI will be accessible at <http://localhost:5678>.

Example Use Cases & Workflows

 1. Security QuickScan: Check IP/domain with WHOIS, Shodan, GeoIP, VirusTotal, and AbuseIPDB, then alert via Telegram if malicious.
 2. Email Breach Check: Use Have I Been Pwned to detect compromised emails and notify users or security teams.
 3. Scraping & Forensic Analysis: Compare static/dynamic scraping results, analyze them, and open helpdesk tickets for suspicious findings.
 4. DFIR Integration: Combine threat intelligence lookups with MISP/TheHive (via custom nodes) for automated incident response pipelines.

Contributing
 • Pull Requests Welcome: Submit PRs to add new nodes, credentials, or improve documentation.
 • Issue Tracking: Report bugs or request features via the repository’s issue tracker.

```
License

This project is released under the MIT License.

Maintainer

Redoracle – support@redoracle.com
```
