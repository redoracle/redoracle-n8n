import axios from 'axios';
import * as fs from 'fs';

function logToConsoleAndFile(message: string): void {
    if (process.env.REDORACLE_VERBOSE_LOGGING === 'true') {
        console.log('[VIRUSTOTAL-LOOKUP]', message);
    }
    if (process.env.REDORACLE_LOG_FILE) {
        fs.appendFileSync(process.env.REDORACLE_LOG_FILE, `[VIRUSTOTAL-LOOKUP] ${message}\n`);
    }
}

interface VirusTotalCredentials {
    apiKey: string;
}

interface VirusTotalInputs {
    target?: string;
}

export const virusTotalLookup = {
    name: 'virusTotalLookup',
    displayName: 'VirusTotal Lookup',
    description: 'Check file hash, domain, or IP reputation via VirusTotal',

    credentials: [
        {
            name: 'virusTotalApi',
            required: true,
        },
    ],

    execute: async function (
        this: { getCredentials: (name: string) => Promise<VirusTotalCredentials> },
        inputs: VirusTotalInputs
    ): Promise<Array<{ vtData: any }>> {
        const credentials = await this.getCredentials('virusTotalApi');
        const target = inputs.target || '8.8.8.8';
        const apiKey = credentials.apiKey;

        const url = `https://www.virustotal.com/api/v3/ip_addresses/${target}`;
        try {
            const response = await axios.get(url, {
                headers: { 'x-apikey': apiKey },
            });
            logToConsoleAndFile(`VirusTotal Lookup success for: ${target}`);
            return [{ vtData: response.data }];
        } catch (error: any) {
            logToConsoleAndFile(`VirusTotal error: ${error.message}`);
            throw new Error(`VirusTotal Lookup error: ${error.message}`);
        }
    },
};