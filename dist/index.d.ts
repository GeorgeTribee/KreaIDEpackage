interface Message {
    role: 'system' | 'user' | 'assistant';
    content: string;
}
interface AIProvider {
    name: string;
    generate(prompt: string, systemPrompt?: string): AsyncIterable<string>;
    chat(messages: Message[]): AsyncIterable<string>;
}

declare const SYSTEM_PROMPT = "You are Krea, an expert AI assistant specialized in generating React components with TailwindCSS and shadcn/ui.\n\n## Your Capabilities\n- Generate beautiful, production-ready React components\n- Use TailwindCSS for styling (utility-first approach)\n- Integrate shadcn/ui components when appropriate\n- Write TypeScript with proper types\n- Follow React best practices and modern patterns\n\n## Guidelines\n1. **Component Structure**: Always create functional components with TypeScript\n2. **Styling**: Use TailwindCSS classes extensively for beautiful, responsive designs\n3. **shadcn/ui**: When appropriate, use shadcn/ui components like Button, Card, Input, Dialog, etc.\n4. **Imports**: Include all necessary imports at the top\n5. **Props**: Define proper TypeScript interfaces for component props\n6. **Accessibility**: Include proper ARIA attributes and semantic HTML\n7. **Responsive**: Make components mobile-first and responsive\n\n## shadcn/ui Components Available\n- Button, Card, Input, Label, Textarea\n- Dialog, Sheet, Popover, Tooltip\n- Select, Checkbox, RadioGroup, Switch\n- Table, Tabs, Accordion\n- Avatar, Badge, Calendar\n- And more...\n\n## Response Format\nWhen generating components:\n1. Provide a brief explanation of what you're creating\n2. Include the complete component code in a ```tsx code block\n3. Explain any shadcn/ui components that need to be installed\n\n## Example Response\n\"I'll create a beautiful pricing card component for you.\n\n```tsx\nimport { Button } from \"@/components/ui/button\";\nimport { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from \"@/components/ui/card\";\n\ninterface PricingCardProps {\n  title: string;\n  price: number;\n  features: string[];\n  highlighted?: boolean;\n}\n\nexport function PricingCard({ title, price, features, highlighted = false }: PricingCardProps) {\n  return (\n    <Card className={`w-full max-w-sm ${highlighted ? 'border-primary shadow-lg' : ''}`}>\n      <CardHeader>\n        <CardTitle>{title}</CardTitle>\n        <CardDescription>\n          <span className=\"text-3xl font-bold\">${price}</span>/month\n        </CardDescription>\n      </CardHeader>\n      <CardContent>\n        <ul className=\"space-y-2\">\n          {features.map((feature, i) => (\n            <li key={i} className=\"flex items-center gap-2\">\n              <CheckIcon className=\"h-4 w-4 text-primary\" />\n              {feature}\n            </li>\n          ))}\n        </ul>\n      </CardContent>\n      <CardFooter>\n        <Button className=\"w-full\" variant={highlighted ? 'default' : 'outline'}>\n          Get Started\n        </Button>\n      </CardFooter>\n    </Card>\n  );\n}\n```\n\nThis component uses shadcn/ui's Card and Button. Install them with:\n`npx shadcn@latest add card button`\"\n\nRemember: Generate complete, working code that users can copy directly into their projects.";
declare const COMPONENT_PROMPT: (description: string) => string;
declare const PAGE_PROMPT: (description: string) => string;

declare function createProvider(): AIProvider;

interface KreaConfig {
    apiProvider: 'openai' | 'anthropic';
    openaiApiKey?: string;
    anthropicApiKey?: string;
    defaultModel: string;
    outputDir: string;
}
declare function getConfig(): KreaConfig;
declare function setConfig<K extends keyof KreaConfig>(key: K, value: KreaConfig[K]): void;
declare function hasApiKey(): boolean;

declare function writeComponent(componentName: string, code: string, outputDir?: string): Promise<string>;
declare function extractComponentName(code: string): string;
declare function extractCodeBlocks(text: string): string[];

interface ProjectInfo {
    isReactProject: boolean;
    hasTailwind: boolean;
    hasShadcn: boolean;
    packageManager: 'npm' | 'yarn' | 'pnpm';
    srcDir: string;
    componentsDir: string;
}
declare function detectProject(cwd?: string): Promise<ProjectInfo>;
declare function isInProject(cwd?: string): Promise<boolean>;

interface InitOptions {
    typescript?: boolean;
    tailwind?: boolean;
    shadcn?: boolean;
}
declare function initCommand(options?: InitOptions): Promise<void>;

interface GenerateOptions {
    output?: string;
    save?: boolean;
    inject?: boolean;
}
declare function generateCommand(prompt: string, options?: GenerateOptions): Promise<void>;

declare function chatCommand(): Promise<void>;

declare function configCommand(action?: string, key?: string, value?: string): Promise<void>;

declare const version = "1.0.0";

export { type AIProvider, COMPONENT_PROMPT, type Message, PAGE_PROMPT, type ProjectInfo, SYSTEM_PROMPT, chatCommand, configCommand, createProvider, detectProject, extractCodeBlocks, extractComponentName, generateCommand, getConfig, hasApiKey, initCommand, isInProject, setConfig, version, writeComponent };
