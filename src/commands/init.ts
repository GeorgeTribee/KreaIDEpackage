import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs/promises';
import path from 'path';
import inquirer from 'inquirer';
import { colors, createSpinner, printSuccess, printError, printInfo } from '../ui/terminal.js';
import { detectProject, isInProject } from '../utils/project.js';
import { setConfig } from '../utils/config.js';

const execAsync = promisify(exec);

interface InitOptions {
  typescript?: boolean;
  tailwind?: boolean;
  shadcn?: boolean;
}

// Tailwind config content
const TAILWIND_CONFIG = `/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
`;

// PostCSS config content (Tailwind v4)
const POSTCSS_CONFIG = `export default {
  plugins: {
    "@tailwindcss/postcss": {},
  },
}
`;

// CSS with Tailwind v4 + shadcn theme
const TAILWIND_CSS = `@import "tailwindcss";
@import "tw-animate-css";

@custom-variant dark (&:is(.dark *));

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-destructive-foreground: var(--destructive-foreground);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  --color-chart-1: var(--chart-1);
  --color-chart-2: var(--chart-2);
  --color-chart-3: var(--chart-3);
  --color-chart-4: var(--chart-4);
  --color-chart-5: var(--chart-5);
  --color-sidebar: var(--sidebar);
  --color-sidebar-foreground: var(--sidebar-foreground);
  --color-sidebar-primary: var(--sidebar-primary);
  --color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
  --color-sidebar-accent: var(--sidebar-accent);
  --color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
  --color-sidebar-border: var(--sidebar-border);
  --color-sidebar-ring: var(--sidebar-ring);
  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);
}

:root {
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.145 0 0);
  --popover: oklch(1 0 0);
  --popover-foreground: oklch(0.145 0 0);
  --primary: oklch(0.205 0 0);
  --primary-foreground: oklch(0.985 0 0);
  --secondary: oklch(0.97 0 0);
  --secondary-foreground: oklch(0.205 0 0);
  --muted: oklch(0.97 0 0);
  --muted-foreground: oklch(0.556 0 0);
  --accent: oklch(0.97 0 0);
  --accent-foreground: oklch(0.205 0 0);
  --destructive: oklch(0.577 0.245 27.325);
  --destructive-foreground: oklch(0.577 0.245 27.325);
  --border: oklch(0.922 0 0);
  --input: oklch(0.922 0 0);
  --ring: oklch(0.708 0 0);
  --chart-1: oklch(0.646 0.222 41.116);
  --chart-2: oklch(0.6 0.118 184.704);
  --chart-3: oklch(0.398 0.07 227.392);
  --chart-4: oklch(0.828 0.189 84.429);
  --chart-5: oklch(0.769 0.188 70.08);
  --radius: 0.625rem;
  --sidebar: oklch(0.985 0 0);
  --sidebar-foreground: oklch(0.145 0 0);
  --sidebar-primary: oklch(0.205 0 0);
  --sidebar-primary-foreground: oklch(0.985 0 0);
  --sidebar-accent: oklch(0.97 0 0);
  --sidebar-accent-foreground: oklch(0.205 0 0);
  --sidebar-border: oklch(0.922 0 0);
  --sidebar-ring: oklch(0.708 0 0);
}

.dark {
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
  --card: oklch(0.145 0 0);
  --card-foreground: oklch(0.985 0 0);
  --popover: oklch(0.145 0 0);
  --popover-foreground: oklch(0.985 0 0);
  --primary: oklch(0.985 0 0);
  --primary-foreground: oklch(0.205 0 0);
  --secondary: oklch(0.269 0 0);
  --secondary-foreground: oklch(0.985 0 0);
  --muted: oklch(0.269 0 0);
  --muted-foreground: oklch(0.708 0 0);
  --accent: oklch(0.269 0 0);
  --accent-foreground: oklch(0.985 0 0);
  --destructive: oklch(0.396 0.141 25.723);
  --destructive-foreground: oklch(0.637 0.237 25.331);
  --border: oklch(0.269 0 0);
  --input: oklch(0.269 0 0);
  --ring: oklch(0.439 0 0);
  --chart-1: oklch(0.488 0.243 264.376);
  --chart-2: oklch(0.696 0.17 162.48);
  --chart-3: oklch(0.769 0.188 70.08);
  --chart-4: oklch(0.627 0.265 303.9);
  --chart-5: oklch(0.645 0.246 16.439);
  --sidebar: oklch(0.205 0 0);
  --sidebar-foreground: oklch(0.985 0 0);
  --sidebar-primary: oklch(0.488 0.243 264.376);
  --sidebar-primary-foreground: oklch(0.985 0 0);
  --sidebar-accent: oklch(0.269 0 0);
  --sidebar-accent-foreground: oklch(0.985 0 0);
  --sidebar-border: oklch(0.269 0 0);
  --sidebar-ring: oklch(0.439 0 0);
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}
`;

// shadcn components.json
const COMPONENTS_JSON = `{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "default",
  "rsc": false,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.js",
    "css": "src/index.css",
    "baseColor": "neutral",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  }
}
`;

// cn utility function
const CN_UTILS = `import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
`;

// Custom App.tsx with simple welcome
const APP_TSX = `function App() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-light text-white mb-2">
          Welcome to Krea-IDE
        </h1>
        <p className="text-lg text-white/70">
          Your AI-Powered React IDE
        </p>
      </div>
    </div>
  )
}

export default App
`;

export async function initCommand(options: InitOptions = {}): Promise<void> {
  const inProject = await isInProject();

  if (inProject) {
    const projectInfo = await detectProject();
    console.log();
    printInfo('Detected existing project:');
    console.log(`  ${colors.muted('React:')} ${projectInfo.isReactProject ? colors.success('✓') : colors.error('✗')}`);
    console.log(`  ${colors.muted('TailwindCSS:')} ${projectInfo.hasTailwind ? colors.success('✓') : colors.error('✗')}`);
    console.log(`  ${colors.muted('shadcn/ui:')} ${projectInfo.hasShadcn ? colors.success('✓') : colors.error('✗')}`);
    console.log();

    const { proceed } = await inquirer.prompt([{
      type: 'confirm',
      name: 'proceed',
      message: 'Install missing dependencies?',
      default: true
    }]);

    if (!proceed) return;

    // Install missing dependencies
    if (!projectInfo.hasTailwind) {
      await setupTailwind();
    }
    if (!projectInfo.hasShadcn) {
      await setupShadcn();
    }

    printSuccess('Project configured for Krea IDE!');
    return;
  }

  // New project setup
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'projectName',
      message: 'Project name:',
      default: 'my-krea-app'
    },
    {
      type: 'confirm',
      name: 'typescript',
      message: 'Use TypeScript?',
      default: true
    }
  ]);

  const spinner = createSpinner('Creating React project with Vite...');
  spinner.start();

  try {
    // Create Vite project
    const template = answers.typescript ? 'react-ts' : 'react';
    await execAsync(`npm create vite@latest ${answers.projectName} -- --template ${template}`);
    spinner.succeed('Created React project');

    process.chdir(answers.projectName);

    // Install base dependencies
    spinner.text = 'Installing dependencies...';
    spinner.start();
    await execAsync('npm install');
    spinner.succeed('Dependencies installed');

    // Install Tailwind and utilities
    spinner.text = 'Installing TailwindCSS...';
    spinner.start();
    await execAsync('npm install -D tailwindcss @tailwindcss/postcss tw-animate-css');
    spinner.succeed('TailwindCSS installed');

    // Install shadcn dependencies
    spinner.text = 'Installing shadcn/ui dependencies...';
    spinner.start();
    await execAsync('npm install lucide-react clsx tailwind-merge class-variance-authority @radix-ui/react-slot');
    spinner.succeed('shadcn/ui dependencies installed');

    // Configure Tailwind
    spinner.text = 'Configuring TailwindCSS...';
    spinner.start();
    await fs.writeFile('tailwind.config.js', TAILWIND_CONFIG);
    await fs.writeFile('postcss.config.js', POSTCSS_CONFIG);
    await fs.writeFile('src/index.css', TAILWIND_CSS);
    spinner.succeed('TailwindCSS configured');

    // Configure path aliases for shadcn
    spinner.text = 'Configuring path aliases...';
    spinner.start();
    await configureTsConfig('tsconfig.json');
    await configureTsConfig('tsconfig.app.json');
    await configureViteAlias();
    spinner.succeed('Path aliases configured');

    // Setup shadcn
    spinner.text = 'Setting up shadcn/ui...';
    spinner.start();
    await fs.writeFile('components.json', COMPONENTS_JSON);
    await fs.mkdir('src/lib', { recursive: true });
    await fs.writeFile('src/lib/utils.ts', CN_UTILS);
    await fs.mkdir('src/components/ui', { recursive: true });
    spinner.succeed('shadcn/ui configured');

    // Install all shadcn components
    spinner.text = 'Installing all shadcn/ui components (this may take a few minutes)...';
    spinner.start();
    try {
      await execAsync('npx shadcn@latest add --all --yes', { timeout: 300000 });
      spinner.succeed('All shadcn/ui components installed');
    } catch (error: any) {
      spinner.fail('Failed to install some shadcn components');
      printInfo('You can install them manually: npx shadcn@latest add --all');
    }

    // Replace default Vite files with shadcn demo
    spinner.text = 'Setting up demo app...';
    spinner.start();
    try {
      await fs.unlink('src/App.css');
    } catch {
      // File might not exist
    }
    await fs.writeFile('src/App.tsx', APP_TSX);
    spinner.succeed('Demo app configured');

    // Set output directory
    setConfig('outputDir', './src/components');

    console.log();
    printSuccess(`Project ${colors.primary(answers.projectName)} is ready!`);
    console.log();
    console.log(colors.primary.bold('  🚀 Get Started:'));
    console.log();
    console.log(`  ${colors.secondary('1.')} cd ${answers.projectName}`);
    console.log(`  ${colors.secondary('2.')} npm run dev`);
    console.log(`  ${colors.secondary('3.')} krea`);
    console.log();

  } catch (error: any) {
    spinner.fail('Failed to create project');
    printError(error.message);
  }
}

async function configureTsConfig(filename: string): Promise<void> {
  try {
    const content = await fs.readFile(filename, 'utf-8');
    const config = JSON.parse(content);

    if (!config.compilerOptions) {
      config.compilerOptions = {};
    }

    config.compilerOptions.baseUrl = '.';
    config.compilerOptions.paths = {
      '@/*': ['./src/*']
    };

    await fs.writeFile(filename, JSON.stringify(config, null, 2));
  } catch (error) {
    // File might not exist, that's ok
  }
}

async function configureViteAlias(): Promise<void> {
  const viteConfig = `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
`;
  await fs.writeFile('vite.config.ts', viteConfig);
}

async function setupTailwind(): Promise<void> {
  const spinner = createSpinner('Installing TailwindCSS...');
  spinner.start();

  try {
    await execAsync('npm install -D tailwindcss @tailwindcss/postcss tw-animate-css');
    await fs.writeFile('tailwind.config.js', TAILWIND_CONFIG);
    await fs.writeFile('postcss.config.js', POSTCSS_CONFIG);

    // Prepend tailwind directives to index.css
    try {
      const existingCss = await fs.readFile('src/index.css', 'utf-8');
      await fs.writeFile('src/index.css', TAILWIND_CSS + '\n' + existingCss);
    } catch {
      await fs.writeFile('src/index.css', TAILWIND_CSS);
    }

    spinner.succeed('TailwindCSS installed');
  } catch (error: any) {
    spinner.fail('Failed to install TailwindCSS');
    throw error;
  }
}

async function setupShadcn(): Promise<void> {
  const spinner = createSpinner('Setting up shadcn/ui...');
  spinner.start();

  try {
    await execAsync('npm install lucide-react clsx tailwind-merge class-variance-authority @radix-ui/react-slot');
    await configureTsConfig('tsconfig.json');
    await configureTsConfig('tsconfig.app.json');
    await configureViteAlias();
    await fs.writeFile('components.json', COMPONENTS_JSON);
    await fs.mkdir('src/lib', { recursive: true });
    await fs.writeFile('src/lib/utils.ts', CN_UTILS);
    await fs.mkdir('src/components/ui', { recursive: true });
    spinner.succeed('shadcn/ui configured');
  } catch (error: any) {
    spinner.fail('Failed to setup shadcn/ui');
    throw error;
  }
}
