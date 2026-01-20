import Anthropic from '@anthropic-ai/sdk';
import { AIProvider, Message } from './provider.js';
import { getConfig, getApiKey } from '../utils/config.js';

export class AnthropicProvider implements AIProvider {
    name = 'Anthropic';
    private client: Anthropic;
    private model: string;

    constructor(apiKey?: string) {
        const key = apiKey || getApiKey();
        if (!key) {
            throw new Error('Anthropic API key not found. Set it with: krea config set anthropicApiKey <your-key>');
        }
        this.client = new Anthropic({ apiKey: key });
        this.model = getConfig().defaultModel || 'claude-sonnet-4-20250514';
    }

    async *generate(prompt: string, systemPrompt?: string): AsyncIterable<string> {
        const stream = await this.client.messages.stream({
            model: this.model,
            max_tokens: 4096,
            system: systemPrompt || '',
            messages: [{ role: 'user', content: prompt }]
        });

        for await (const event of stream) {
            if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
                yield event.delta.text;
            }
        }
    }

    async *chat(messages: Message[]): AsyncIterable<string> {
        const systemMessage = messages.find(m => m.role === 'system');
        const chatMessages = messages
            .filter(m => m.role !== 'system')
            .map(m => ({
                role: m.role as 'user' | 'assistant',
                content: m.content
            }));

        const stream = await this.client.messages.stream({
            model: this.model,
            max_tokens: 4096,
            system: systemMessage?.content || '',
            messages: chatMessages
        });

        for await (const event of stream) {
            if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
                yield event.delta.text;
            }
        }
    }
}
