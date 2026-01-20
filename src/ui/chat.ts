import inquirer from 'inquirer';
import chalk from 'chalk';
import { createProvider, SYSTEM_PROMPT, Message } from '../ai/index.js';
import { colors, icons, printDivider, createSpinner, printError, printSuccess, printInfo } from './terminal.js';
import { extractCodeBlocks, extractComponentName, writeComponent } from '../utils/file.js';
import { addComponentToApp } from '../utils/inject.js';
import { getConfig } from '../utils/config.js';

const HELP_TEXT = `
${colors.primary.bold('Commands:')}
  ${chalk.white('/help')}     - Show this help message
  ${chalk.white('/clear')}    - Clear chat history
  ${chalk.white('/config')}   - Show current configuration
  ${chalk.white('/exit')}     - Exit chat mode

${colors.primary.bold('Tips:')}
  • Describe your component in natural language
  • Components are automatically saved to your project
  • Ask for modifications to refine the output
`;

export async function startChatMode(): Promise<void> {
    const messages: Message[] = [
        { role: 'system', content: SYSTEM_PROMPT }
    ];

    console.log();
    console.log(colors.primary.bold(`${icons.chat} Chat Mode`));
    console.log(colors.muted('Describe the React component you want to create.'));
    console.log(colors.muted('Components will be auto-saved to your project.'));
    console.log(colors.muted('Type /help for commands, /exit to quit.'));
    printDivider();

    while (true) {
        const { input } = await inquirer.prompt([
            {
                type: 'input',
                name: 'input',
                message: colors.secondary('You:'),
                prefix: ''
            }
        ]);

        const trimmedInput = input.trim();

        if (!trimmedInput) continue;

        // Handle commands
        if (trimmedInput.startsWith('/')) {
            const command = trimmedInput.toLowerCase();

            if (command === '/exit' || command === '/quit') {
                console.log(colors.muted('Goodbye! 👋'));
                break;
            }

            if (command === '/help') {
                console.log(HELP_TEXT);
                continue;
            }

            if (command === '/clear') {
                messages.length = 1; // Keep system prompt
                console.log(colors.success('Chat history cleared.'));
                continue;
            }

            if (command === '/config') {
                console.log(colors.muted(JSON.stringify(getConfig(), null, 2)));
                continue;
            }

            printError(`Unknown command: ${trimmedInput}`);
            continue;
        }

        // Add user message
        messages.push({ role: 'user', content: trimmedInput });

        // Generate response
        const spinner = createSpinner('Generating...');
        spinner.start();

        try {
            const provider = createProvider();
            let response = '';

            spinner.stop();
            process.stdout.write(`\n${colors.primary('Krea:')} `);

            for await (const chunk of provider.chat(messages)) {
                response += chunk;
                process.stdout.write(chunk);
            }

            console.log('\n');

            // Extract code and AUTO-SAVE
            const codeBlocks = extractCodeBlocks(response);
            if (codeBlocks.length > 0) {
                const code = codeBlocks[0];
                const componentName = extractComponentName(code);
                const outputDir = getConfig().outputDir;

                try {
                    // Save component
                    const filePath = await writeComponent(componentName, code, outputDir);
                    printSuccess(`Component saved to ${colors.code(filePath)}`);

                    // Auto-inject into App
                    const result = await addComponentToApp(componentName, filePath);
                    if (result.success && result.appFile) {
                        printSuccess(`Component added to ${colors.code(result.appFile)}`);
                    } else if (result.error) {
                        printInfo(`Auto-import: ${result.error}`);
                    }
                } catch (error: any) {
                    printError(`Failed to save: ${error.message}`);
                }
            }

            // Add assistant response to history
            messages.push({ role: 'assistant', content: response });

            printDivider();
        } catch (error: any) {
            spinner.stop();
            printError(`Generation failed: ${error.message}`);

            // Don't add failed message to history
            messages.pop();
        }
    }
}
