import * as geoip from 'geoip-lite';
import * as fs from 'fs';

function logToConsoleAndFile(message: string): void {
    if (process.env.REDORACLE_VERBOSE_LOGGING === 'true') {
        console.log('[GEOIP-LOOKUP]', message);
    }
    if (process.env.REDORACLE_LOG_FILE) {
        fs.appendFileSync(process.env.REDORACLE_LOG_FILE, `[GEOIP-LOOKUP] ${message}\n`);
    }
}

interface GeoipLookupInputs {
    ip?: string;
}

export const geoipLookup = {
    name: 'geoipLookup',
    displayName: 'GeoIP Lookup',
    description: 'Get geographical data for an IP address',

    execute: async function (inputs: GeoipLookupInputs): Promise<Array<{ geoData: any }>> {
        const ip = inputs.ip || '8.8.8.8';
        const geoData = geoip.lookup(ip) || {};
        logToConsoleAndFile(`GeoIP lookup for IP: ${ip}`);
        return [{ geoData }];
    },
};