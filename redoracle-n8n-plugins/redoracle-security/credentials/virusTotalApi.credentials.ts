import { ICredentialType, INodeProperties } from 'n8n-workflow';

export class VirusTotalApi implements ICredentialType {
    name = 'virusTotalApi';
    displayName = 'VirusTotal API';
    properties: INodeProperties[] = [
        {
            displayName: 'API Key',
            name: 'apiKey',
            type: 'string',
            default: '',
            placeholder: 'Inserisci la tua VirusTotal API Key',
        },
    ];
}