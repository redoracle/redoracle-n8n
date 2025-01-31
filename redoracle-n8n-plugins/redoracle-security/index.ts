import { whoisLookup } from './nodes/whoisLookup';
import { shodanLookup } from './nodes/shodanLookup';
import { geoipLookup } from './nodes/geoipLookup';
import { virusTotalLookup } from './nodes/virusTotalLookup';
import { abuseIPDBLookup } from './nodes/abuseIPDBLookup';

import { ShodanApi } from './credentials/shodanApi.credentials';
import { VirusTotalApi } from './credentials/virusTotalApi.credentials';
import { AbuseIPDBApi } from './credentials/abuseIPDBApi.credentials';

export const data = {
    nodes: [
        whoisLookup,
        shodanLookup,
        geoipLookup,
        virusTotalLookup,
        abuseIPDBLookup,
    ],
    credentials: [
        ShodanApi,
        VirusTotalApi,
        AbuseIPDBApi,
    ],
};