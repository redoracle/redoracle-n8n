import axios from 'axios';
import * as fs from 'fs';

function logToConsoleAndFile(message: string): void {
    if (process.env.REDORACLE_VERBOSE_LOGGING === 'true') {
        console.log('[HELPDESK-TICKET]', message);
    }
    if (process.env.REDORACLE_LOG_FILE) {
        fs.appendFileSync(process.env.REDORACLE_LOG_FILE, `[HELPDESK-TICKET] ${message}\n`);
    }
}

interface HelpdeskTicketInputs {
    apiEndpoint?: string;
    apiKey?: string;
    subject?: string;
    description?: string;
    priority?: string;
}

export const helpdeskTicket = {
    name: 'helpdeskTicket',
    displayName: 'Helpdesk Ticket',
    description: 'Create a ticket in a helpdesk system (e.g. Zendesk, Freshdesk)',
    
    // credentials: [
    //     {
    //         name: 'helpdeskApi',
    //         required: true,
    //     },
    // ],

    execute: async function (inputs: HelpdeskTicketInputs): Promise<Array<{ ticket: any }>> {
        const apiEndpoint = inputs.apiEndpoint || 'https://your-helpdesk.com/api/tickets';
        const apiKey = inputs.apiKey || 'YOUR_HELPDESK_API_KEY';
        const ticketData = {
            subject: inputs.subject || 'Example Ticket',
            description: inputs.description || 'Issue details here...',
            priority: inputs.priority || 'low',
        };

        try {
            const response = await axios.post(apiEndpoint, ticketData, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`,
                },
            });
            logToConsoleAndFile(`Helpdesk ticket created. ID: ${response.data.id || 'unknown'}`);
            return [{ ticket: response.data }];
        } catch (error: any) {
            logToConsoleAndFile(`Helpdesk ticket error: ${error.message}`);
            throw new Error(`Helpdesk Ticket error: ${error.message}`);
        }
    },
};