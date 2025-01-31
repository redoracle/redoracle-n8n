import { exec } from 'child_process';
import * as fs from 'fs';

function logToConsoleAndFile(message: string): void {
    if (process.env.REDORACLE_VERBOSE_LOGGING === 'true') {
        console.log('[DYNAMIC-SCRAPER]', message);
    }
    if (process.env.REDORACLE_LOG_FILE) {
        fs.appendFileSync(process.env.REDORACLE_LOG_FILE, `[DYNAMIC-SCRAPER] ${message}\n`);
    }
}

interface DynamicScraperInputs {
    url?: string;
}

export const dynamicScraper = {
    name: 'dynamicScraper',
    displayName: 'Dynamic Web Scraper',
    description: 'Scrape JavaScript-based webpages via Selenium',

    execute: async function (inputs: DynamicScraperInputs): Promise<Array<{ html: string }>> {
        const targetUrl = inputs.url || 'https://example.com';
        return new Promise((resolve, reject) => {
            const command = `python3 /app/scripts/selenium_scraper.py ${targetUrl}`;
            exec(command, (err, stdout, stderr) => {
                if (err) {
                    logToConsoleAndFile(`Selenium error: ${stderr || err.message}`);
                    return reject(new Error(`DynamicScraper error: ${stderr || err.message}`));
                }
                logToConsoleAndFile(`Dynamically scraped: ${targetUrl}`);
                resolve([{ html: stdout }]);
            });
        });
    },
};