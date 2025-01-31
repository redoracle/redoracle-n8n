import axios from 'axios';
import * as fs from 'fs';

function logToConsoleAndFile(message: string): void {
    if (process.env.REDORACLE_VERBOSE_LOGGING === 'true') {
        console.log('[STATIC-SCRAPER]', message);
    }
    if (process.env.REDORACLE_LOG_FILE) {
        fs.appendFileSync(process.env.REDORACLE_LOG_FILE, `[STATIC-SCRAPER] ${message}\n`);
    }
}

interface StaticScraperInputs {
    url?: string;
}

export const staticScraper = {
    name: 'staticScraper',
    displayName: 'Static Web Scraper',
    description: 'Scrape static web pages and extract HTML content',

    execute: async function (inputs: StaticScraperInputs): Promise<Array<{ html: string }>> {
        const url = inputs.url || 'https://example.com';
        try {
            const response = await axios.get(url);
            logToConsoleAndFile(`Scraped URL: ${url}, status: ${response.status}`);
            return [{ html: response.data }];
        } catch (error: any) {
            logToConsoleAndFile(`Error scraping ${url}: ${error.message}`);
            throw new Error(`StaticScraper error: ${error.message}`);
        }
    },
};