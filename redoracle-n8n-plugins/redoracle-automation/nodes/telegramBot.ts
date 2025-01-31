import axios from 'axios';
import * as fs from 'fs';

function logToConsoleAndFile(message: string): void {
    if (process.env.REDORACLE_VERBOSE_LOGGING === 'true') {
        console.log('[TELEGRAM-BOT]', message);
    }
    if (process.env.REDORACLE_LOG_FILE) {
        fs.appendFileSync(process.env.REDORACLE_LOG_FILE, `[TELEGRAM-BOT] ${message}\n`);
    }
}

interface TelegramBotCredentials {
    botToken: string;
}

interface TelegramBotInputs {
    chatId?: string;
    message?: string;
}

export const telegramBot = {
    name: 'telegramBot',
    displayName: 'Telegram Bot',
    description: 'Send messages to a Telegram chat',

    credentials: [
        {
            name: 'telegramBotApi',
            required: true,
        },
    ],

    execute: async function (
        this: { getCredentials: (name: string) => Promise<TelegramBotCredentials> },
        inputs: TelegramBotInputs
    ): Promise<Array<{ status: any }>> {
        const credentials = await this.getCredentials('telegramBotApi');
        const chatId = inputs.chatId || 'YOUR_CHAT_ID';
        const message = inputs.message || 'Hello from Redoracle!';
        const url = `https://api.telegram.org/bot${credentials.botToken}/sendMessage`;

        try {
            const response = await axios.post(url, { chat_id: chatId, text: message });
            logToConsoleAndFile(`Telegram message sent to chat: ${chatId}`);
            return [{ status: response.data }];
        } catch (error: any) {
            logToConsoleAndFile(`Telegram Bot error: ${error.message}`);
            throw new Error(`Telegram Bot error: ${error.message}`);
        }
    },
};