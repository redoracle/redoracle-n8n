import { ICredentialType, INodeProperties } from 'n8n-workflow';

export class ShodanApi implements ICredentialType {
    name = 'shodanApi';
    displayName = 'Shodan API';
    properties: INodeProperties[] = [
        {
            displayName: 'API Key',
            name: 'apiKey',
            type: 'string',
            default: '',
            placeholder: 'Inserisci la tua Shodan API Key',
        },
    ];
}