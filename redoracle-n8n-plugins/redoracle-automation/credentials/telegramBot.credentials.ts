import { ICredentialType, INodeProperties } from 'n8n-workflow';

export class TelegramBotApi implements ICredentialType {
    name = 'telegramBotApi';
    displayName = 'Telegram Bot API';
    properties: INodeProperties[] = [
        {
            displayName: 'Bot Token',
            name: 'botToken',
            type: 'string',
            default: '',
            placeholder: '123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11',
        },
    ];
}