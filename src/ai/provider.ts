export interface Message {
    role: 'system' | 'user' | 'assistant';
    content: string;
}

export interface AIProvider {
    name: string;
    generate(prompt: string, systemPrompt?: string): AsyncIterable<string>;
    chat(messages: Message[]): AsyncIterable<string>;
}

export interface StreamChunk {
    type: 'text' | 'done' | 'error';
    content: string;
}
