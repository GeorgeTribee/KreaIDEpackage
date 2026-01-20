#!/usr/bin/env node
import { Command } from 'commander';
import { printWelcome, printLogo, printInfo } from './ui/terminal.js';
import { initCommand, generateCommand, configCommand, chatCommand } from './commands/index.js';
import { isInProject } from './utils/project.js';

const program = new Command();

program
    .name('krea')
    .description('AI-Powered React IDE - Generate React + TailwindCSS + shadcn/ui components from your terminal')
    .version('1.2.8');

// Default command - check for project and enter chat
program
    .action(async () => {
        const inProject = await isInProject();

        if (!inProject) {
            printLogo();
            console.log();
            printInfo('No React project detected in this folder.');
            printInfo('Let\'s set one up for you!');
            console.log();
            await initCommand({});
            return;
        }

        printWelcome();
        await chatCommand();
    });

// Init command
program
    .command('init')
    .description('Initialize a new React project with Vite, TailwindCSS, and shadcn/ui')
    .option('--typescript', 'Use TypeScript (default)', true)
    .option('--no-typescript', 'Use JavaScript')
    .action(async (options) => {
        printLogo();
        await initCommand(options);
    });

// Generate command
program
    .command('generate <prompt...>')
    .alias('g')
    .description('Generate a React component from a text prompt')
    .option('-o, --output <dir>', 'Output directory', './src/components')
    .option('--no-save', 'Don\'t save to file, only print')
    .option('--no-inject', 'Don\'t auto-add component to App.tsx')
    .action(async (promptParts: string[], options) => {
        const prompt = promptParts.join(' ');
        await generateCommand(prompt, options);
    });

// Chat command
program
    .command('chat')
    .alias('c')
    .description('Enter interactive chat mode')
    .action(async () => {
        printLogo();
        await chatCommand();
    });

// Config command
program
    .command('config [action] [key] [value]')
    .description('Manage configuration (list, set, get)')
    .action(async (action?: string, key?: string, value?: string) => {
        await configCommand(action, key, value);
    });

program.parse();
