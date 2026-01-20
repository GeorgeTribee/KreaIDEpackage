import chalk from 'chalk';
import ora from 'ora';
import { highlight } from 'cli-highlight';

export const colors = {
    primary: chalk.hex('#6366f1'),    // Indigo
    secondary: chalk.hex('#8b5cf6'),  // Violet
    success: chalk.hex('#22c55e'),    // Green
    warning: chalk.hex('#f59e0b'),    // Amber
    error: chalk.hex('#ef4444'),      // Red
    muted: chalk.hex('#64748b'),      // Slate
    code: chalk.hex('#e879f9'),       // Fuchsia
};

export const icons = {
    success: '✓',
    error: '✗',
    warning: '⚠',
    info: 'ℹ',
    arrow: '→',
    sparkle: '✦',
    code: '⌘',
    chat: '💬',
    ai: '🤖',
    component: '🧩',
};

export function printLogo(): void {
    console.log();
    console.log(colors.primary.bold(`
  ██╗  ██╗██████╗ ███████╗ █████╗ 
  ██║ ██╔╝██╔══██╗██╔════╝██╔══██╗
  █████╔╝ ██████╔╝█████╗  ███████║
  ██╔═██╗ ██╔══██╗██╔══╝  ██╔══██║
  ██║  ██╗██║  ██║███████╗██║  ██║
  ╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝
  `));
    console.log(colors.muted('  AI-Powered React Component Generator'));
    console.log(colors.muted('  React • TailwindCSS • shadcn/ui'));
    console.log();
}

export function printWelcome(): void {
    printLogo();
    console.log(colors.primary('  Welcome to Krea IDE!'));
    console.log();
    console.log(`  ${colors.muted('Commands:')} ${chalk.white('generate <prompt>')}, ${chalk.white('chat')}, ${chalk.white('init')}, ${chalk.white('config')}`);
    console.log(`  ${colors.muted('Type')} ${chalk.white('/help')} ${colors.muted('for more options')}`);
    console.log();
}

export function printSuccess(message: string): void {
    console.log(`${colors.success(icons.success)} ${message}`);
}

export function printError(message: string): void {
    console.log(`${colors.error(icons.error)} ${message}`);
}

export function printWarning(message: string): void {
    console.log(`${colors.warning(icons.warning)} ${message}`);
}

export function printInfo(message: string): void {
    console.log(`${colors.primary(icons.info)} ${message}`);
}

export function printCode(code: string, language: string = 'typescript'): void {
    console.log();
    try {
        const highlighted = highlight(code, { language, ignoreIllegals: true });
        console.log(highlighted);
    } catch {
        console.log(code);
    }
    console.log();
}

export function createSpinner(text: string) {
    return ora({
        text,
        color: 'magenta',
        spinner: 'dots'
    });
}

export function printDivider(): void {
    console.log(colors.muted('─'.repeat(50)));
}

export function formatComponentPath(path: string): string {
    return colors.code(path);
}
