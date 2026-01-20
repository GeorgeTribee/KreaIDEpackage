import { startChatMode } from '../ui/chat.js';

export async function chatCommand(): Promise<void> {
    await startChatMode();
}
