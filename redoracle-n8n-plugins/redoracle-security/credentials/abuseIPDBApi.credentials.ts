import { ICredentialType, INodeProperties } from 'n8n-workflow';

export class AbuseIPDBApi implements ICredentialType {
    name = 'abuseIPDBApi';
    displayName = 'AbuseIPDB API';
    properties: INodeProperties[] = [
        {
            displayName: 'API Key',
            name: 'apiKey',
            type: 'string',
            default: '',
            placeholder: 'Inserisci la tua AbuseIPDB API Key',
        },
    ];
}