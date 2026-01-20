export { AIProvider, Message, StreamChunk } from './provider.js';
export { OpenAIProvider } from './openai.js';
export { AnthropicProvider } from './anthropic.js';
export { SYSTEM_PROMPT, COMPONENT_PROMPT, PAGE_PROMPT } from './prompts.js';
import { getConfig } from '../utils/config.js';
import { OpenAIProvider } from './openai.js';
import { AnthropicProvider } from './anthropic.js';
import { AIProvider } from './provider.js';

export function createProvider(): AIProvider {
    const config = getConfig();

    if (config.apiProvider === 'anthropic') {
        return new AnthropicProvider();
    }

    return new OpenAIProvider();
}
