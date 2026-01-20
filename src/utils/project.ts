import fs from 'fs/promises';
import path from 'path';
import { fileExists } from './file.js';

export interface ProjectInfo {
    isReactProject: boolean;
    hasTailwind: boolean;
    hasShadcn: boolean;
    packageManager: 'npm' | 'yarn' | 'pnpm';
    srcDir: string;
    componentsDir: string;
}

export async function detectProject(cwd: string = process.cwd()): Promise<ProjectInfo> {
    const info: ProjectInfo = {
        isReactProject: false,
        hasTailwind: false,
        hasShadcn: false,
        packageManager: 'npm',
        srcDir: './src',
        componentsDir: './src/components'
    };

    // Check for package.json
    const packageJsonPath = path.join(cwd, 'package.json');
    if (await fileExists(packageJsonPath)) {
        try {
            const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf-8'));
            const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };

            info.isReactProject = 'react' in deps;
            info.hasTailwind = 'tailwindcss' in deps;
            info.hasShadcn = '@radix-ui/react-slot' in deps || await fileExists(path.join(cwd, 'components.json'));
        } catch {
            // Ignore parse errors
        }
    }

    // Detect package manager
    if (await fileExists(path.join(cwd, 'pnpm-lock.yaml'))) {
        info.packageManager = 'pnpm';
    } else if (await fileExists(path.join(cwd, 'yarn.lock'))) {
        info.packageManager = 'yarn';
    }

    // Check for src directory
    if (await fileExists(path.join(cwd, 'src'))) {
        info.srcDir = './src';
        info.componentsDir = './src/components';
    } else if (await fileExists(path.join(cwd, 'app'))) {
        info.srcDir = './app';
        info.componentsDir = './components';
    }

    return info;
}

export async function isInProject(cwd: string = process.cwd()): Promise<boolean> {
    return fileExists(path.join(cwd, 'package.json'));
}
