import OpenAI from 'openai';
import { AIProvider, Message } from './provider.js';
import { getConfig, getApiKey } from '../utils/config.js';

export class OpenAIProvider implements AIProvider {
    name = 'OpenAI';
    private client: OpenAI;
    private model: string;

    constructor(apiKey?: string) {
        const key = apiKey || getApiKey();
        if (!key) {
            throw new Error('OpenAI API key not found. Set it with: krea config set openaiApiKey <your-key>');
        }
        this.client = new OpenAI({ apiKey: key });
        this.model = getConfig().defaultModel || 'gpt-4o';
    }

    async *generate(prompt: string, systemPrompt?: string): AsyncIterable<string> {
        const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [];

        if (systemPrompt) {
            messages.push({ role: 'system', content: systemPrompt });
        }
        messages.push({ role: 'user', content: prompt });

        const stream = await this.client.chat.completions.create({
            model: this.model,
            messages,
            stream: true,
            temperature: 0.7,
            max_tokens: 4096
        });

        for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content;
            if (content) {
                yield content;
            }
        }
    }

    async *chat(messages: Message[]): AsyncIterable<string> {
        const openaiMessages: OpenAI.Chat.ChatCompletionMessageParam[] = messages.map(m => ({
            role: m.role as 'system' | 'user' | 'assistant',
            content: m.content
        }));

        const stream = await this.client.chat.completions.create({
            model: this.model,
            messages: openaiMessages,
            stream: true,
            temperature: 0.7,
            max_tokens: 4096
        });

        for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content;
            if (content) {
                yield content;
            }
        }
    }
}
