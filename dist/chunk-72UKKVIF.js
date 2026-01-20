// src/ui/terminal.ts
import chalk from "chalk";
import ora from "ora";
import { highlight } from "cli-highlight";
var colors = {
  primary: chalk.hex("#6366f1"),
  // Indigo
  secondary: chalk.hex("#8b5cf6"),
  // Violet
  success: chalk.hex("#22c55e"),
  // Green
  warning: chalk.hex("#f59e0b"),
  // Amber
  error: chalk.hex("#ef4444"),
  // Red
  muted: chalk.hex("#64748b"),
  // Slate
  code: chalk.hex("#e879f9")
  // Fuchsia
};
var icons = {
  success: "\u2713",
  error: "\u2717",
  warning: "\u26A0",
  info: "\u2139",
  arrow: "\u2192",
  sparkle: "\u2726",
  code: "\u2318",
  chat: "\u{1F4AC}",
  ai: "\u{1F916}",
  component: "\u{1F9E9}"
};
function printLogo() {
  console.log();
  console.log(colors.primary.bold(`
  \u2588\u2588\u2557  \u2588\u2588\u2557\u2588\u2588\u2588\u2588\u2588\u2588\u2557 \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2557 \u2588\u2588\u2588\u2588\u2588\u2557 
  \u2588\u2588\u2551 \u2588\u2588\u2554\u255D\u2588\u2588\u2554\u2550\u2550\u2588\u2588\u2557\u2588\u2588\u2554\u2550\u2550\u2550\u2550\u255D\u2588\u2588\u2554\u2550\u2550\u2588\u2588\u2557
  \u2588\u2588\u2588\u2588\u2588\u2554\u255D \u2588\u2588\u2588\u2588\u2588\u2588\u2554\u255D\u2588\u2588\u2588\u2588\u2588\u2557  \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2551
  \u2588\u2588\u2554\u2550\u2588\u2588\u2557 \u2588\u2588\u2554\u2550\u2550\u2588\u2588\u2557\u2588\u2588\u2554\u2550\u2550\u255D  \u2588\u2588\u2554\u2550\u2550\u2588\u2588\u2551
  \u2588\u2588\u2551  \u2588\u2588\u2557\u2588\u2588\u2551  \u2588\u2588\u2551\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2557\u2588\u2588\u2551  \u2588\u2588\u2551
  \u255A\u2550\u255D  \u255A\u2550\u255D\u255A\u2550\u255D  \u255A\u2550\u255D\u255A\u2550\u2550\u2550\u2550\u2550\u2550\u255D\u255A\u2550\u255D  \u255A\u2550\u255D
  `));
  console.log(colors.muted("  AI-Powered React Component Generator"));
  console.log(colors.muted("  React \u2022 TailwindCSS \u2022 shadcn/ui"));
  console.log();
}
function printWelcome() {
  printLogo();
  console.log(colors.primary("  Welcome to Krea IDE!"));
  console.log();
  console.log(`  ${colors.muted("Commands:")} ${chalk.white("generate <prompt>")}, ${chalk.white("chat")}, ${chalk.white("init")}, ${chalk.white("config")}`);
  console.log(`  ${colors.muted("Type")} ${chalk.white("/help")} ${colors.muted("for more options")}`);
  console.log();
}
function printSuccess(message) {
  console.log(`${colors.success(icons.success)} ${message}`);
}
function printError(message) {
  console.log(`${colors.error(icons.error)} ${message}`);
}
function printInfo(message) {
  console.log(`${colors.primary(icons.info)} ${message}`);
}
function createSpinner(text) {
  return ora({
    text,
    color: "magenta",
    spinner: "dots"
  });
}
function printDivider() {
  console.log(colors.muted("\u2500".repeat(50)));
}

// src/utils/file.ts
import fs from "fs/promises";
import path from "path";
async function ensureDir(dirPath) {
  try {
    await fs.mkdir(dirPath, { recursive: true });
  } catch (error) {
  }
}
async function writeComponent(componentName, code, outputDir = "./src/components") {
  const absoluteOutputDir = path.resolve(process.cwd(), outputDir);
  await ensureDir(absoluteOutputDir);
  const fileName = `${componentName}.tsx`;
  const filePath = path.join(absoluteOutputDir, fileName);
  await fs.writeFile(filePath, code, "utf-8");
  return filePath;
}
async function fileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}
function extractComponentName(code) {
  const defaultFunctionMatch = code.match(/export\s+default\s+function\s+(\w+)/);
  if (defaultFunctionMatch) {
    return defaultFunctionMatch[1];
  }
  const exportFunctionMatch = code.match(/export\s+function\s+(\w+)/);
  if (exportFunctionMatch) {
    return exportFunctionMatch[1];
  }
  const constMatch = code.match(/(?:export\s+)?const\s+(\w+)\s*[:=]/);
  if (constMatch) {
    return constMatch[1];
  }
  return "GeneratedComponent";
}
function extractCodeBlocks(text) {
  const codeBlockRegex = /```(?:tsx?|jsx?|javascript|typescript)?\n([\s\S]*?)```/g;
  const blocks = [];
  let match;
  while ((match = codeBlockRegex.exec(text)) !== null) {
    blocks.push(match[1].trim());
  }
  return blocks;
}

// src/utils/project.ts
import fs2 from "fs/promises";
import path2 from "path";
async function detectProject(cwd = process.cwd()) {
  const info = {
    isReactProject: false,
    hasTailwind: false,
    hasShadcn: false,
    packageManager: "npm",
    srcDir: "./src",
    componentsDir: "./src/components"
  };
  const packageJsonPath = path2.join(cwd, "package.json");
  if (await fileExists(packageJsonPath)) {
    try {
      const packageJson = JSON.parse(await fs2.readFile(packageJsonPath, "utf-8"));
      const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };
      info.isReactProject = "react" in deps;
      info.hasTailwind = "tailwindcss" in deps;
      info.hasShadcn = "@radix-ui/react-slot" in deps || await fileExists(path2.join(cwd, "components.json"));
    } catch {
    }
  }
  if (await fileExists(path2.join(cwd, "pnpm-lock.yaml"))) {
    info.packageManager = "pnpm";
  } else if (await fileExists(path2.join(cwd, "yarn.lock"))) {
    info.packageManager = "yarn";
  }
  if (await fileExists(path2.join(cwd, "src"))) {
    info.srcDir = "./src";
    info.componentsDir = "./src/components";
  } else if (await fileExists(path2.join(cwd, "app"))) {
    info.srcDir = "./app";
    info.componentsDir = "./components";
  }
  return info;
}
async function isInProject(cwd = process.cwd()) {
  return fileExists(path2.join(cwd, "package.json"));
}

// src/utils/config.ts
import Conf from "conf";
var config = new Conf({
  projectName: "krea-ide",
  defaults: {
    apiProvider: "openai",
    defaultModel: "gpt-4o",
    outputDir: "./src/components"
  }
});
function getConfig() {
  return config.store;
}
function setConfig(key, value) {
  config.set(key, value);
}
function getApiKey() {
  const provider = config.get("apiProvider");
  if (provider === "openai") {
    return config.get("openaiApiKey") || process.env.OPENAI_API_KEY;
  }
  return config.get("anthropicApiKey") || process.env.ANTHROPIC_API_KEY;
}
function hasApiKey() {
  return !!getApiKey();
}

// src/commands/init.ts
import { exec } from "child_process";
import { promisify } from "util";
import fs3 from "fs/promises";
import inquirer from "inquirer";
var execAsync = promisify(exec);
var TAILWIND_CONFIG = `/** @type {import('tailwindcss').Config} */
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
var POSTCSS_CONFIG = `export default {
  plugins: {
    "@tailwindcss/postcss": {},
  },
}
`;
var TAILWIND_CSS = `@import "tailwindcss";
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
var COMPONENTS_JSON = `{
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
var CN_UTILS = `import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
`;
var APP_TSX = `function App() {
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
async function initCommand(options = {}) {
  const inProject = await isInProject();
  if (inProject) {
    const projectInfo = await detectProject();
    console.log();
    printInfo("Detected existing project:");
    console.log(`  ${colors.muted("React:")} ${projectInfo.isReactProject ? colors.success("\u2713") : colors.error("\u2717")}`);
    console.log(`  ${colors.muted("TailwindCSS:")} ${projectInfo.hasTailwind ? colors.success("\u2713") : colors.error("\u2717")}`);
    console.log(`  ${colors.muted("shadcn/ui:")} ${projectInfo.hasShadcn ? colors.success("\u2713") : colors.error("\u2717")}`);
    console.log();
    const { proceed } = await inquirer.prompt([{
      type: "confirm",
      name: "proceed",
      message: "Install missing dependencies?",
      default: true
    }]);
    if (!proceed) return;
    if (!projectInfo.hasTailwind) {
      await setupTailwind();
    }
    if (!projectInfo.hasShadcn) {
      await setupShadcn();
    }
    printSuccess("Project configured for Krea IDE!");
    return;
  }
  const answers = await inquirer.prompt([
    {
      type: "input",
      name: "projectName",
      message: "Project name:",
      default: "my-krea-app"
    },
    {
      type: "confirm",
      name: "typescript",
      message: "Use TypeScript?",
      default: true
    }
  ]);
  const spinner = createSpinner("Creating React project with Vite...");
  spinner.start();
  try {
    const template = answers.typescript ? "react-ts" : "react";
    await execAsync(`npm create vite@latest ${answers.projectName} -- --template ${template}`);
    spinner.succeed("Created React project");
    process.chdir(answers.projectName);
    spinner.text = "Installing dependencies...";
    spinner.start();
    await execAsync("npm install");
    spinner.succeed("Dependencies installed");
    spinner.text = "Installing TailwindCSS...";
    spinner.start();
    await execAsync("npm install -D tailwindcss @tailwindcss/postcss tw-animate-css");
    spinner.succeed("TailwindCSS installed");
    spinner.text = "Installing shadcn/ui dependencies...";
    spinner.start();
    await execAsync("npm install lucide-react clsx tailwind-merge class-variance-authority @radix-ui/react-slot");
    spinner.succeed("shadcn/ui dependencies installed");
    spinner.text = "Configuring TailwindCSS...";
    spinner.start();
    await fs3.writeFile("tailwind.config.js", TAILWIND_CONFIG);
    await fs3.writeFile("postcss.config.js", POSTCSS_CONFIG);
    await fs3.writeFile("src/index.css", TAILWIND_CSS);
    spinner.succeed("TailwindCSS configured");
    spinner.text = "Configuring path aliases...";
    spinner.start();
    await configureTsConfig("tsconfig.json");
    await configureTsConfig("tsconfig.app.json");
    await configureViteAlias();
    spinner.succeed("Path aliases configured");
    spinner.text = "Setting up shadcn/ui...";
    spinner.start();
    await fs3.writeFile("components.json", COMPONENTS_JSON);
    await fs3.mkdir("src/lib", { recursive: true });
    await fs3.writeFile("src/lib/utils.ts", CN_UTILS);
    await fs3.mkdir("src/components/ui", { recursive: true });
    spinner.succeed("shadcn/ui configured");
    spinner.text = "Installing all shadcn/ui components (this may take a few minutes)...";
    spinner.start();
    try {
      await execAsync("npx shadcn@latest add --all --yes", { timeout: 3e5 });
      spinner.succeed("All shadcn/ui components installed");
    } catch (error) {
      spinner.fail("Failed to install some shadcn components");
      printInfo("You can install them manually: npx shadcn@latest add --all");
    }
    spinner.text = "Setting up demo app...";
    spinner.start();
    try {
      await fs3.unlink("src/App.css");
    } catch {
    }
    await fs3.writeFile("src/App.tsx", APP_TSX);
    spinner.succeed("Demo app configured");
    setConfig("outputDir", "./src/components");
    console.log();
    printSuccess(`Project ${colors.primary(answers.projectName)} is ready!`);
    console.log();
    console.log(colors.primary.bold("  \u{1F680} Get Started:"));
    console.log();
    console.log(`  ${colors.secondary("1.")} cd ${answers.projectName}`);
    console.log(`  ${colors.secondary("2.")} npm run dev`);
    console.log(`  ${colors.secondary("3.")} krea`);
    console.log();
  } catch (error) {
    spinner.fail("Failed to create project");
    printError(error.message);
  }
}
async function configureTsConfig(filename) {
  try {
    const content = await fs3.readFile(filename, "utf-8");
    const config2 = JSON.parse(content);
    if (!config2.compilerOptions) {
      config2.compilerOptions = {};
    }
    config2.compilerOptions.baseUrl = ".";
    config2.compilerOptions.paths = {
      "@/*": ["./src/*"]
    };
    await fs3.writeFile(filename, JSON.stringify(config2, null, 2));
  } catch (error) {
  }
}
async function configureViteAlias() {
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
  await fs3.writeFile("vite.config.ts", viteConfig);
}
async function setupTailwind() {
  const spinner = createSpinner("Installing TailwindCSS...");
  spinner.start();
  try {
    await execAsync("npm install -D tailwindcss @tailwindcss/postcss tw-animate-css");
    await fs3.writeFile("tailwind.config.js", TAILWIND_CONFIG);
    await fs3.writeFile("postcss.config.js", POSTCSS_CONFIG);
    try {
      const existingCss = await fs3.readFile("src/index.css", "utf-8");
      await fs3.writeFile("src/index.css", TAILWIND_CSS + "\n" + existingCss);
    } catch {
      await fs3.writeFile("src/index.css", TAILWIND_CSS);
    }
    spinner.succeed("TailwindCSS installed");
  } catch (error) {
    spinner.fail("Failed to install TailwindCSS");
    throw error;
  }
}
async function setupShadcn() {
  const spinner = createSpinner("Setting up shadcn/ui...");
  spinner.start();
  try {
    await execAsync("npm install lucide-react clsx tailwind-merge class-variance-authority @radix-ui/react-slot");
    await configureTsConfig("tsconfig.json");
    await configureTsConfig("tsconfig.app.json");
    await configureViteAlias();
    await fs3.writeFile("components.json", COMPONENTS_JSON);
    await fs3.mkdir("src/lib", { recursive: true });
    await fs3.writeFile("src/lib/utils.ts", CN_UTILS);
    await fs3.mkdir("src/components/ui", { recursive: true });
    spinner.succeed("shadcn/ui configured");
  } catch (error) {
    spinner.fail("Failed to setup shadcn/ui");
    throw error;
  }
}

// src/ai/prompts.ts
var SYSTEM_PROMPT = `You are Krea, an expert AI assistant specialized in generating React components with TailwindCSS and shadcn/ui.

## Your Capabilities
- Generate beautiful, production-ready React components
- Use TailwindCSS for styling (utility-first approach)
- Integrate shadcn/ui components when appropriate
- Write TypeScript with proper types
- Follow React best practices and modern patterns

## Guidelines
1. **Component Structure**: Always create functional components with TypeScript
2. **Styling**: Use TailwindCSS classes extensively for beautiful, responsive designs
3. **shadcn/ui**: When appropriate, use shadcn/ui components like Button, Card, Input, Dialog, etc.
4. **Imports**: Include all necessary imports at the top
5. **Props**: Define proper TypeScript interfaces for component props
6. **Accessibility**: Include proper ARIA attributes and semantic HTML
7. **Responsive**: Make components mobile-first and responsive

## shadcn/ui Components Available
- Button, Card, Input, Label, Textarea
- Dialog, Sheet, Popover, Tooltip
- Select, Checkbox, RadioGroup, Switch
- Table, Tabs, Accordion
- Avatar, Badge, Calendar
- And more...

## Response Format
When generating components:
1. Provide a brief explanation of what you're creating
2. Include the complete component code in a \`\`\`tsx code block
3. Explain any shadcn/ui components that need to be installed

## Example Response
"I'll create a beautiful pricing card component for you.

\`\`\`tsx
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

interface PricingCardProps {
  title: string;
  price: number;
  features: string[];
  highlighted?: boolean;
}

export function PricingCard({ title, price, features, highlighted = false }: PricingCardProps) {
  return (
    <Card className={\`w-full max-w-sm \${highlighted ? 'border-primary shadow-lg' : ''}\`}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>
          <span className="text-3xl font-bold">\${price}</span>/month
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {features.map((feature, i) => (
            <li key={i} className="flex items-center gap-2">
              <CheckIcon className="h-4 w-4 text-primary" />
              {feature}
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button className="w-full" variant={highlighted ? 'default' : 'outline'}>
          Get Started
        </Button>
      </CardFooter>
    </Card>
  );
}
\`\`\`

This component uses shadcn/ui's Card and Button. Install them with:
\`npx shadcn@latest add card button\`"

Remember: Generate complete, working code that users can copy directly into their projects.`;
var COMPONENT_PROMPT = (description) => `
Generate a React component based on this description:

${description}

Requirements:
- Use TailwindCSS for all styling
- Use shadcn/ui components where appropriate
- Include TypeScript types
- Make it production-ready and beautiful
- Include any necessary imports
`;
var PAGE_PROMPT = (description) => `
Generate a complete React page/section based on this description:

${description}

Requirements:
- Create a full, responsive page layout
- Use TailwindCSS for all styling
- Integrate shadcn/ui components for UI elements
- Include TypeScript types
- Add proper spacing, typography, and visual hierarchy
- Make it visually stunning and modern
`;

// src/ai/openai.ts
import OpenAI from "openai";
var OpenAIProvider = class {
  name = "OpenAI";
  client;
  model;
  constructor(apiKey) {
    const key = apiKey || getApiKey();
    if (!key) {
      throw new Error("OpenAI API key not found. Set it with: krea config set openaiApiKey <your-key>");
    }
    this.client = new OpenAI({ apiKey: key });
    this.model = getConfig().defaultModel || "gpt-4o";
  }
  async *generate(prompt, systemPrompt) {
    const messages = [];
    if (systemPrompt) {
      messages.push({ role: "system", content: systemPrompt });
    }
    messages.push({ role: "user", content: prompt });
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
  async *chat(messages) {
    const openaiMessages = messages.map((m) => ({
      role: m.role,
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
};

// src/ai/anthropic.ts
import Anthropic from "@anthropic-ai/sdk";
var AnthropicProvider = class {
  name = "Anthropic";
  client;
  model;
  constructor(apiKey) {
    const key = apiKey || getApiKey();
    if (!key) {
      throw new Error("Anthropic API key not found. Set it with: krea config set anthropicApiKey <your-key>");
    }
    this.client = new Anthropic({ apiKey: key });
    this.model = getConfig().defaultModel || "claude-sonnet-4-20250514";
  }
  async *generate(prompt, systemPrompt) {
    const stream = await this.client.messages.stream({
      model: this.model,
      max_tokens: 4096,
      system: systemPrompt || "",
      messages: [{ role: "user", content: prompt }]
    });
    for await (const event of stream) {
      if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
        yield event.delta.text;
      }
    }
  }
  async *chat(messages) {
    const systemMessage = messages.find((m) => m.role === "system");
    const chatMessages = messages.filter((m) => m.role !== "system").map((m) => ({
      role: m.role,
      content: m.content
    }));
    const stream = await this.client.messages.stream({
      model: this.model,
      max_tokens: 4096,
      system: systemMessage?.content || "",
      messages: chatMessages
    });
    for await (const event of stream) {
      if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
        yield event.delta.text;
      }
    }
  }
};

// src/ai/index.ts
function createProvider() {
  const config2 = getConfig();
  if (config2.apiProvider === "anthropic") {
    return new AnthropicProvider();
  }
  return new OpenAIProvider();
}

// src/utils/inject.ts
import fs4 from "fs/promises";
import path3 from "path";
async function findAppFile(cwd = process.cwd()) {
  const possiblePaths = [
    "src/App.tsx",
    "src/App.jsx",
    "src/App.js",
    "app/page.tsx",
    // Next.js App Router
    "app/page.jsx",
    "pages/index.tsx",
    // Next.js Pages Router
    "pages/index.jsx",
    "src/main.tsx",
    "src/main.jsx"
  ];
  for (const relativePath of possiblePaths) {
    const fullPath = path3.join(cwd, relativePath);
    if (await fileExists(fullPath)) {
      return fullPath;
    }
  }
  return null;
}
async function addComponentToApp(componentName, componentPath, cwd = process.cwd()) {
  const appFile = await findAppFile(cwd);
  if (!appFile) {
    return {
      success: false,
      error: `Could not find App file. Make sure you're running Krea from your React project directory (current: ${cwd})`
    };
  }
  try {
    let content = await fs4.readFile(appFile, "utf-8");
    const appDir = path3.dirname(appFile);
    const relativeImportPath = path3.relative(appDir, componentPath).replace(/\\/g, "/").replace(/\.tsx?$/, "");
    const importPath = relativeImportPath.startsWith(".") ? relativeImportPath : `./${relativeImportPath}`;
    if (content.includes(`from '${importPath}'`) || content.includes(`from "${importPath}"`)) {
      return { success: true, appFile, error: "Component already imported" };
    }
    const importStatement = `import { ${componentName} } from '${importPath}';
`;
    const importRegex = /^import\s+.*?from\s+['"].*?['"];?\s*$/gm;
    const imports = content.match(importRegex);
    if (imports && imports.length > 0) {
      const lastImport = imports[imports.length - 1];
      const lastImportIndex = content.lastIndexOf(lastImport);
      const insertPosition = lastImportIndex + lastImport.length;
      content = content.slice(0, insertPosition) + "\n" + importStatement + content.slice(insertPosition);
    } else {
      content = importStatement + content;
    }
    const returnPatterns = [
      // return ( <div>...</div> )
      /(return\s*\(\s*\n?\s*)(<[^>]+>)/,
      // return <div>...</div>
      /(return\s+)(<[^>]+>)/
    ];
    let componentAdded = false;
    for (const pattern of returnPatterns) {
      if (pattern.test(content)) {
        content = content.replace(pattern, (match, prefix, openTag) => {
          componentAdded = true;
          return `${prefix}${openTag}
      <${componentName} />`;
        });
        break;
      }
    }
    await fs4.writeFile(appFile, content, "utf-8");
    return {
      success: true,
      appFile,
      error: componentAdded ? void 0 : "Import added but could not auto-place component in JSX"
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// src/commands/generate.ts
async function generateCommand(prompt, options = {}) {
  if (!prompt || prompt.trim().length === 0) {
    printError("Please provide a description for the component.");
    console.log(colors.muted('Example: krea generate "Create a pricing card component"'));
    return;
  }
  const spinner = createSpinner("Generating component...");
  spinner.start();
  try {
    const provider = createProvider();
    const fullPrompt = COMPONENT_PROMPT(prompt);
    let response = "";
    spinner.stop();
    console.log();
    console.log(colors.primary.bold("Krea IDE"));
    printDivider();
    for await (const chunk of provider.generate(fullPrompt, SYSTEM_PROMPT)) {
      response += chunk;
      process.stdout.write(chunk);
    }
    console.log("\n");
    printDivider();
    const codeBlocks = extractCodeBlocks(response);
    if (codeBlocks.length === 0) {
      printError("No code generated. Please try again with a more specific prompt.");
      return;
    }
    const code = codeBlocks[0];
    const componentName = extractComponentName(code);
    if (options.save !== false) {
      const outputDir = options.output || getConfig().outputDir;
      const filePath = await writeComponent(componentName, code, outputDir);
      printSuccess(`Component saved to ${colors.code(filePath)}`);
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
    console.log(colors.muted("To add shadcn/ui components mentioned above:"));
    console.log(colors.muted("  npx shadcn@latest add <component-name>"));
    console.log();
  } catch (error) {
    spinner.stop();
    printError(`Generation failed: ${error.message}`);
    if (error.message.includes("API key")) {
      console.log();
      console.log(colors.muted("Set your API key with:"));
      console.log(colors.muted("  krea config set openaiApiKey <your-key>"));
      console.log(colors.muted("  krea config set anthropicApiKey <your-key>"));
    }
  }
}

// src/commands/config.ts
import chalk2 from "chalk";
var VALID_KEYS = [
  "apiProvider",
  "openaiApiKey",
  "anthropicApiKey",
  "defaultModel",
  "outputDir"
];
async function configCommand(action, key, value) {
  if (!action || action === "list" || action === "show") {
    showConfig();
    return;
  }
  if (action === "set") {
    if (!key || !value) {
      printError("Usage: krea config set <key> <value>");
      console.log();
      console.log(colors.muted("Available keys:"));
      VALID_KEYS.forEach((k) => console.log(`  ${chalk2.white(k)}`));
      return;
    }
    if (!VALID_KEYS.includes(key)) {
      printError(`Invalid key: ${key}`);
      console.log(colors.muted(`Valid keys: ${VALID_KEYS.join(", ")}`));
      return;
    }
    setConfig(key, value);
    printSuccess(`Set ${colors.code(key)} = ${colors.muted(maskSecret(key, value))}`);
    return;
  }
  if (action === "get") {
    if (!key) {
      printError("Usage: krea config get <key>");
      return;
    }
    const config2 = getConfig();
    const val = config2[key];
    if (val !== void 0) {
      console.log(maskSecret(key, String(val)));
    } else {
      console.log(colors.muted("(not set)"));
    }
    return;
  }
  printError(`Unknown action: ${action}`);
  console.log(colors.muted("Available actions: list, set, get"));
}
function showConfig() {
  const config2 = getConfig();
  console.log();
  printInfo("Current Configuration:");
  console.log();
  console.log(`  ${colors.muted("API Provider:")}     ${config2.apiProvider}`);
  console.log(`  ${colors.muted("Default Model:")}    ${config2.defaultModel}`);
  console.log(`  ${colors.muted("Output Dir:")}       ${config2.outputDir}`);
  console.log(`  ${colors.muted("OpenAI Key:")}       ${maskSecret("openaiApiKey", config2.openaiApiKey || "(not set)")}`);
  console.log(`  ${colors.muted("Anthropic Key:")}    ${maskSecret("anthropicApiKey", config2.anthropicApiKey || "(not set)")}`);
  console.log();
  console.log(colors.muted("Use `krea config set <key> <value>` to update."));
}
function maskSecret(key, value) {
  if (key.toLowerCase().includes("key") && value.length > 8) {
    return value.slice(0, 4) + "****" + value.slice(-4);
  }
  return value;
}

// src/ui/chat.ts
import inquirer2 from "inquirer";
import chalk3 from "chalk";
var HELP_TEXT = `
${colors.primary.bold("Commands:")}
  ${chalk3.white("/help")}     - Show this help message
  ${chalk3.white("/clear")}    - Clear chat history
  ${chalk3.white("/config")}   - Show current configuration
  ${chalk3.white("/exit")}     - Exit chat mode

${colors.primary.bold("Tips:")}
  \u2022 Describe your component in natural language
  \u2022 Components are automatically saved to your project
  \u2022 Ask for modifications to refine the output
`;
async function startChatMode() {
  const messages = [
    { role: "system", content: SYSTEM_PROMPT }
  ];
  console.log();
  console.log(colors.primary.bold(`${icons.chat} Chat Mode`));
  console.log(colors.muted("Describe the React component you want to create."));
  console.log(colors.muted("Components will be auto-saved to your project."));
  console.log(colors.muted("Type /help for commands, /exit to quit."));
  printDivider();
  while (true) {
    const { input } = await inquirer2.prompt([
      {
        type: "input",
        name: "input",
        message: colors.secondary("You:"),
        prefix: ""
      }
    ]);
    const trimmedInput = input.trim();
    if (!trimmedInput) continue;
    if (trimmedInput.startsWith("/")) {
      const command = trimmedInput.toLowerCase();
      if (command === "/exit" || command === "/quit") {
        console.log(colors.muted("Goodbye! \u{1F44B}"));
        break;
      }
      if (command === "/help") {
        console.log(HELP_TEXT);
        continue;
      }
      if (command === "/clear") {
        messages.length = 1;
        console.log(colors.success("Chat history cleared."));
        continue;
      }
      if (command === "/config") {
        console.log(colors.muted(JSON.stringify(getConfig(), null, 2)));
        continue;
      }
      printError(`Unknown command: ${trimmedInput}`);
      continue;
    }
    messages.push({ role: "user", content: trimmedInput });
    const spinner = createSpinner("Generating...");
    spinner.start();
    try {
      const provider = createProvider();
      let response = "";
      spinner.stop();
      process.stdout.write(`
${colors.primary("Krea:")} `);
      for await (const chunk of provider.chat(messages)) {
        response += chunk;
        process.stdout.write(chunk);
      }
      console.log("\n");
      const codeBlocks = extractCodeBlocks(response);
      if (codeBlocks.length > 0) {
        const code = codeBlocks[0];
        const componentName = extractComponentName(code);
        const outputDir = getConfig().outputDir;
        try {
          const filePath = await writeComponent(componentName, code, outputDir);
          printSuccess(`Component saved to ${colors.code(filePath)}`);
          const result = await addComponentToApp(componentName, filePath);
          if (result.success && result.appFile) {
            printSuccess(`Component added to ${colors.code(result.appFile)}`);
          } else if (result.error) {
            printInfo(`Auto-import: ${result.error}`);
          }
        } catch (error) {
          printError(`Failed to save: ${error.message}`);
        }
      }
      messages.push({ role: "assistant", content: response });
      printDivider();
    } catch (error) {
      spinner.stop();
      printError(`Generation failed: ${error.message}`);
      messages.pop();
    }
  }
}

// src/commands/chat.ts
async function chatCommand() {
  await startChatMode();
}

export {
  printLogo,
  printWelcome,
  printInfo,
  writeComponent,
  extractComponentName,
  extractCodeBlocks,
  detectProject,
  isInProject,
  getConfig,
  setConfig,
  hasApiKey,
  initCommand,
  SYSTEM_PROMPT,
  COMPONENT_PROMPT,
  PAGE_PROMPT,
  createProvider,
  generateCommand,
  configCommand,
  chatCommand
};
