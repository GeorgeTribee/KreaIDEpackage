// Krea IDE - AI-Powered React Component Generator
// Export public API for programmatic usage

export { createProvider, AIProvider, Message } from './ai/index.js';
export { SYSTEM_PROMPT, COMPONENT_PROMPT, PAGE_PROMPT } from './ai/prompts.js';
export { getConfig, setConfig, hasApiKey } from './utils/config.js';
export { writeComponent, extractCodeBlocks, extractComponentName } from './utils/file.js';
export { detectProject, isInProject, ProjectInfo } from './utils/project.js';

// Re-export commands for programmatic use
export { initCommand } from './commands/init.js';
export { generateCommand } from './commands/generate.js';
export { chatCommand } from './commands/chat.js';
export { configCommand } from './commands/config.js';

export const version = '1.0.0';
