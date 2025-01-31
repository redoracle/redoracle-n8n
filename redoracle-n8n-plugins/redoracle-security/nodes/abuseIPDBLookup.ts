import axios from 'axios';
import * as fs from 'fs';

function logToConsoleAndFile(message: string): void {
    if (process.env.REDORACLE_VERBOSE_LOGGING === 'true') {
        console.log('[ABUSEIPDB-LOOKUP]', message);
    }
    if (process.env.REDORACLE_LOG_FILE) {
        fs.appendFileSync(process.env.REDORACLE_LOG_FILE, `[ABUSEIPDB-LOOKUP] ${message}\n`);
    }
}

interface AbuseIPDBCredentials {
    apiKey: string;
}

interface AbuseIPDBInputs {
    ip?: string;
}

export const abuseIPDBLookup = {
    name: 'abuseIPDBLookup',
    displayName: 'AbuseIPDB Lookup',
    description: 'Check an IP reputation via AbuseIPDB',

    credentials: [
        {
            name: 'abuseIPDBApi',
            required: true,
        },
    ],

    execute: async function (
        this: { getCredentials: (name: string) => Promise<AbuseIPDBCredentials> },
        inputs: AbuseIPDBInputs
    ): Promise<Array<{ abuseData: any }>> {
        const credentials = await this.getCredentials('abuseIPDBApi');
        const ip = inputs.ip || '8.8.8.8';
        const url = 'https://api.abuseipdb.com/api/v2/check';

        try {
            const response = await axios.get(url, {
                params: { ipAddress: ip },
                headers: {
                    'Key': credentials.apiKey,
                    'Accept': 'application/json'
                }
            });
            logToConsoleAndFile(`AbuseIPDB lookup success for IP: ${ip}`);
            return [{ abuseData: response.data }];
        } catch (error: any) {
            logToConsoleAndFile(`AbuseIPDB error: ${error.message}`);
            throw new Error(`AbuseIPDB Lookup error: ${error.message}`);
        }
    },
};