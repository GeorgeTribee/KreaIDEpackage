import Conf from 'conf';

export interface KreaConfig {
    apiProvider: 'openai' | 'anthropic';
    openaiApiKey?: string;
    anthropicApiKey?: string;
    defaultModel: string;
    outputDir: string;
}

const config = new Conf<KreaConfig>({
    projectName: 'krea-ide',
    defaults: {
        apiProvider: 'openai',
        defaultModel: 'gpt-4o',
        outputDir: './src/components'
    }
});

export function getConfig(): KreaConfig {
    return config.store;
}

export function setConfig<K extends keyof KreaConfig>(key: K, value: KreaConfig[K]): void {
    config.set(key, value);
}

export function getApiKey(): string | undefined {
    const provider = config.get('apiProvider');
    if (provider === 'openai') {
        return config.get('openaiApiKey') || process.env.OPENAI_API_KEY;
    }
    return config.get('anthropicApiKey') || process.env.ANTHROPIC_API_KEY;
}

export function hasApiKey(): boolean {
    return !!getApiKey();
}

export { config };
