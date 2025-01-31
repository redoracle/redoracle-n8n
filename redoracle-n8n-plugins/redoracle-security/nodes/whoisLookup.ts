import { exec } from 'child_process';
import * as fs from 'fs';

function logToConsoleAndFile(message: string): void {
    if (process.env.REDORACLE_VERBOSE_LOGGING === 'true') {
        console.log('[WHOIS-LOOKUP]', message);
    }
    if (process.env.REDORACLE_LOG_FILE) {
        fs.appendFileSync(process.env.REDORACLE_LOG_FILE, `[WHOIS-LOOKUP] ${message}\n`);
    }
}

interface WhoisLookupInputs {
    target?: string;
}

export const whoisLookup = {
    name: 'whoisLookup',
    displayName: 'WHOIS Lookup',
    description: 'Perform a WHOIS lookup on a domain or IP',

    execute: async function (inputs: WhoisLookupInputs): Promise<Array<{ output: string }>> {
        const target = inputs.target || 'example.com';
        return new Promise((resolve, reject) => {
            exec(`whois ${target}`, (err, stdout, stderr) => {
                if (err) {
                    logToConsoleAndFile(`WHOIS error: ${stderr || err.message}`);
                    return reject(new Error(`WHOIS Lookup error: ${stderr || err.message}`));
                }
                logToConsoleAndFile(`WHOIS Lookup success for: ${target}`);
                resolve([{ output: stdout }]);
            });
        });
    },
};