import fs from 'fs/promises';
import path from 'path';
import { fileExists } from './file.js';

/**
 * Find the main App file in a React project
 */
export async function findAppFile(cwd: string = process.cwd()): Promise<string | null> {
    const possiblePaths = [
        'src/App.tsx',
        'src/App.jsx',
        'src/App.js',
        'app/page.tsx',      // Next.js App Router
        'app/page.jsx',
        'pages/index.tsx',   // Next.js Pages Router
        'pages/index.jsx',
        'src/main.tsx',
        'src/main.jsx'
    ];

    for (const relativePath of possiblePaths) {
        const fullPath = path.join(cwd, relativePath);
        if (await fileExists(fullPath)) {
            return fullPath;
        }
    }

    return null;
}

/**
 * Add import statement and component to App file
 */
export async function addComponentToApp(
    componentName: string,
    componentPath: string,
    cwd: string = process.cwd()
): Promise<{ success: boolean; appFile?: string; error?: string }> {
    const appFile = await findAppFile(cwd);

    if (!appFile) {
        return {
            success: false,
            error: `Could not find App file. Make sure you're running Krea from your React project directory (current: ${cwd})`
        };
    }

    try {
        let content = await fs.readFile(appFile, 'utf-8');

        // Calculate relative import path from App file to component
        const appDir = path.dirname(appFile);
        const relativeImportPath = path.relative(appDir, componentPath)
            .replace(/\\/g, '/')
            .replace(/\.tsx?$/, '');

        // Format import path
        const importPath = relativeImportPath.startsWith('.')
            ? relativeImportPath
            : `./${relativeImportPath}`;

        // Check if already imported
        if (content.includes(`from '${importPath}'`) || content.includes(`from "${importPath}"`)) {
            return { success: true, appFile, error: 'Component already imported' };
        }

        // Add import statement after other imports
        const importStatement = `import { ${componentName} } from '${importPath}';\n`;

        // Find the last import statement
        const importRegex = /^import\s+.*?from\s+['"].*?['"];?\s*$/gm;
        const imports = content.match(importRegex);

        if (imports && imports.length > 0) {
            const lastImport = imports[imports.length - 1];
            const lastImportIndex = content.lastIndexOf(lastImport);
            const insertPosition = lastImportIndex + lastImport.length;
            content = content.slice(0, insertPosition) + '\n' + importStatement + content.slice(insertPosition);
        } else {
            // No imports found, add at the top
            content = importStatement + content;
        }

        // Try to add component to JSX
        // Look for return statement with JSX
        const returnPatterns = [
            // return ( <div>...</div> )
            /(return\s*\(\s*\n?\s*)(<[^>]+>)/,
            // return <div>...</div>
            /(return\s+)(<[^>]+>)/
        ];

        let componentAdded = false;
        for (const pattern of returnPatterns) {
            if (pattern.test(content)) {
                // Add component after the opening tag
                content = content.replace(pattern, (match, prefix, openTag) => {
                    componentAdded = true;
                    return `${prefix}${openTag}\n      <${componentName} />`;
                });
                break;
            }
        }

        await fs.writeFile(appFile, content, 'utf-8');

        return {
            success: true,
            appFile,
            error: componentAdded ? undefined : 'Import added but could not auto-place component in JSX'
        };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}
