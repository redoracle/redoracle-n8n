import * as shodan from 'shodan-client';
import * as fs from 'fs';

function logToConsoleAndFile(message: string): void {
    if (process.env.REDORACLE_VERBOSE_LOGGING === 'true') {
        console.log('[SHODAN-LOOKUP]', message);
    }
    if (process.env.REDORACLE_LOG_FILE) {
        fs.appendFileSync(process.env.REDORACLE_LOG_FILE, `[SHODAN-LOOKUP] ${message}\n`);
    }
}

interface ShodanCredentials {
    apiKey: string;
}

interface ShodanLookupInputs {
    ip?: string;
}

export const shodanLookup = {
    name: 'shodanLookup',
    displayName: 'Shodan Lookup',
    description: 'Query Shodan for information about an IP or domain',

    credentials: [
        {
            name: 'shodanApi',
            required: true,
        },
    ],

    execute: async function (
        this: { getCredentials: (name: string) => Promise<ShodanCredentials> },
        inputs: ShodanLookupInputs
    ): Promise<Array<{ result: any }>> {
        const credentials = await this.getCredentials('shodanApi');
        const ip = inputs.ip || '8.8.8.8';

        try {
            const result = await shodan.host(ip, credentials.apiKey);
            logToConsoleAndFile(`Shodan query success for IP: ${ip}`);
            return [{ result }];
        } catch (error: any) {
            logToConsoleAndFile(`Shodan error: ${error.message}`);
            throw new Error(`Shodan Lookup error: ${error.message}`);
        }
    },
};