import fs from 'fs/promises';
import path from 'path';

export async function ensureDir(dirPath: string): Promise<void> {
    try {
        await fs.mkdir(dirPath, { recursive: true });
    } catch (error) {
        // Directory already exists, ignore
    }
}

export async function writeComponent(
    componentName: string,
    code: string,
    outputDir: string = './src/components'
): Promise<string> {
    // Resolve to absolute path from current working directory
    const absoluteOutputDir = path.resolve(process.cwd(), outputDir);
    await ensureDir(absoluteOutputDir);

    const fileName = `${componentName}.tsx`;
    const filePath = path.join(absoluteOutputDir, fileName);

    await fs.writeFile(filePath, code, 'utf-8');

    return filePath;
}

export async function fileExists(filePath: string): Promise<boolean> {
    try {
        await fs.access(filePath);
        return true;
    } catch {
        return false;
    }
}

export async function readFile(filePath: string): Promise<string> {
    return fs.readFile(filePath, 'utf-8');
}

export function extractComponentName(code: string): string {
    // Try to find export default function ComponentName
    const defaultFunctionMatch = code.match(/export\s+default\s+function\s+(\w+)/);
    if (defaultFunctionMatch) {
        return defaultFunctionMatch[1];
    }

    // Try to find export function ComponentName
    const exportFunctionMatch = code.match(/export\s+function\s+(\w+)/);
    if (exportFunctionMatch) {
        return exportFunctionMatch[1];
    }

    // Try to find const ComponentName = 
    const constMatch = code.match(/(?:export\s+)?const\s+(\w+)\s*[:=]/);
    if (constMatch) {
        return constMatch[1];
    }

    // Default name
    return 'GeneratedComponent';
}

export function extractCodeBlocks(text: string): string[] {
    const codeBlockRegex = /```(?:tsx?|jsx?|javascript|typescript)?\n([\s\S]*?)```/g;
    const blocks: string[] = [];
    let match;

    while ((match = codeBlockRegex.exec(text)) !== null) {
        blocks.push(match[1].trim());
    }

    return blocks;
}
