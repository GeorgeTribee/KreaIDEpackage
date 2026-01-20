import { createProvider, SYSTEM_PROMPT, COMPONENT_PROMPT } from '../ai/index.js';
import { colors, createSpinner, printSuccess, printError, printInfo, printDivider } from '../ui/terminal.js';
import { extractCodeBlocks, extractComponentName, writeComponent } from '../utils/file.js';
import { addComponentToApp } from '../utils/inject.js';
import { getConfig } from '../utils/config.js';

interface GenerateOptions {
    output?: string;
    save?: boolean;
    inject?: boolean;
}

export async function generateCommand(prompt: string, options: GenerateOptions = {}): Promise<void> {
    if (!prompt || prompt.trim().length === 0) {
        printError('Please provide a description for the component.');
        console.log(colors.muted('Example: krea generate "Create a pricing card component"'));
        return;
    }

    const spinner = createSpinner('Generating component...');
    spinner.start();

    try {
        const provider = createProvider();
        const fullPrompt = COMPONENT_PROMPT(prompt);

        let response = '';
        spinner.stop();

        console.log();
        console.log(colors.primary.bold('Krea IDE'));
        printDivider();

        for await (const chunk of provider.generate(fullPrompt, SYSTEM_PROMPT)) {
            response += chunk;
            process.stdout.write(chunk);
        }

        console.log('\n');
        printDivider();

        // Extract code blocks
        const codeBlocks = extractCodeBlocks(response);

        if (codeBlocks.length === 0) {
            printError('No code generated. Please try again with a more specific prompt.');
            return;
        }

        const code = codeBlocks[0];
        const componentName = extractComponentName(code);

        // Save component
        if (options.save !== false) {
            const outputDir = options.output || getConfig().outputDir;
            const filePath = await writeComponent(componentName, code, outputDir);
            printSuccess(`Component saved to ${colors.code(filePath)}`);

            // Auto-inject into App.tsx (default behavior, can be disabled with --no-inject)
            if (options.inject !== false) {
                const result = await addComponentToApp(componentName, filePath);

                if (result.success && result.appFile) {
                    printSuccess(`Component added to ${colors.code(result.appFile)}`);
                    if (result.error) {
                        printInfo(result.error);
                    }
                } else if (result.error) {
                    printInfo(`Auto-import skipped: ${result.error}`);
                }
            }
        }

        console.log();
        console.log(colors.muted('To add shadcn/ui components mentioned above:'));
        console.log(colors.muted('  npx shadcn@latest add <component-name>'));
        console.log();

    } catch (error: any) {
        spinner.stop();
        printError(`Generation failed: ${error.message}`);

        if (error.message.includes('API key')) {
            console.log();
            console.log(colors.muted('Set your API key with:'));
            console.log(colors.muted('  krea config set openaiApiKey <your-key>'));
            console.log(colors.muted('  krea config set anthropicApiKey <your-key>'));
        }
    }
}
