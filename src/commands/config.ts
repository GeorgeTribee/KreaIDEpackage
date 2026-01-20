import chalk from 'chalk';
import { setConfig, getConfig, KreaConfig } from '../utils/config.js';
import { colors, printSuccess, printError, printInfo } from '../ui/terminal.js';

const VALID_KEYS: (keyof KreaConfig)[] = [
    'apiProvider',
    'openaiApiKey',
    'anthropicApiKey',
    'defaultModel',
    'outputDir'
];

export async function configCommand(action?: string, key?: string, value?: string): Promise<void> {
    if (!action || action === 'list' || action === 'show') {
        showConfig();
        return;
    }

    if (action === 'set') {
        if (!key || !value) {
            printError('Usage: krea config set <key> <value>');
            console.log();
            console.log(colors.muted('Available keys:'));
            VALID_KEYS.forEach(k => console.log(`  ${chalk.white(k)}`));
            return;
        }

        if (!VALID_KEYS.includes(key as keyof KreaConfig)) {
            printError(`Invalid key: ${key}`);
            console.log(colors.muted(`Valid keys: ${VALID_KEYS.join(', ')}`));
            return;
        }

        setConfig(key as keyof KreaConfig, value as any);
        printSuccess(`Set ${colors.code(key)} = ${colors.muted(maskSecret(key, value))}`);
        return;
    }

    if (action === 'get') {
        if (!key) {
            printError('Usage: krea config get <key>');
            return;
        }

        const config = getConfig();
        const val = config[key as keyof KreaConfig];
        if (val !== undefined) {
            console.log(maskSecret(key, String(val)));
        } else {
            console.log(colors.muted('(not set)'));
        }
        return;
    }

    printError(`Unknown action: ${action}`);
    console.log(colors.muted('Available actions: list, set, get'));
}

function showConfig(): void {
    const config = getConfig();

    console.log();
    printInfo('Current Configuration:');
    console.log();

    console.log(`  ${colors.muted('API Provider:')}     ${config.apiProvider}`);
    console.log(`  ${colors.muted('Default Model:')}    ${config.defaultModel}`);
    console.log(`  ${colors.muted('Output Dir:')}       ${config.outputDir}`);
    console.log(`  ${colors.muted('OpenAI Key:')}       ${maskSecret('openaiApiKey', config.openaiApiKey || '(not set)')}`);
    console.log(`  ${colors.muted('Anthropic Key:')}    ${maskSecret('anthropicApiKey', config.anthropicApiKey || '(not set)')}`);
    console.log();

    console.log(colors.muted('Use `krea config set <key> <value>` to update.'));
}

function maskSecret(key: string, value: string): string {
    if (key.toLowerCase().includes('key') && value.length > 8) {
        return value.slice(0, 4) + '****' + value.slice(-4);
    }
    return value;
}
