import { telegramBot } from './nodes/telegramBot';
import { helpdeskTicket } from './nodes/helpdeskTicket';
import { TelegramBotApi } from './credentials/telegramBot.credentials';

export const data = {
    nodes: [
        telegramBot,
        helpdeskTicket,
    ],
    credentials: [
        TelegramBotApi,
    ],
};