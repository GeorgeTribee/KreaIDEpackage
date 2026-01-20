# Krea IDE

> AI-Powered React IDE directly from your terminal. Generate React + TailwindCSS + shadcn/ui components with AI.

![npm version](https://img.shields.io/npm/v/krea-ide)
![license](https://img.shields.io/npm/l/krea-ide)

## Installation

```bash
npm i krea-ide@latest -g
```

## Quick Start

1. **Set up your API key:**
   ```bash
   krea config set openaiApiKey sk-your-key
   # or
   krea config set anthropicApiKey sk-ant-your-key
   ```

2. **Start chatting:**
   ```bash
   krea
   ```

3. **Generate a component:**
   ```bash
   krea generate "Create a pricing card with shadcn/ui"
   ```

## Commands

| Command | Description |
|---------|-------------|
| `krea` | Launch interactive chat mode |
| `krea init` | Initialize a new React + Vite + TailwindCSS + shadcn project |
| `krea generate <prompt>` | Generate a component from text |
| `krea chat` | Enter interactive chat mode |
| `krea config` | Manage API keys and settings |

## Chat Commands

While in chat mode:

- `/save` - Save the last generated component
- `/clear` - Clear chat history
- `/config` - Show current configuration
- `/help` - Show help message
- `/exit` - Exit chat mode

## Configuration

Set your preferred AI provider:

```bash
# Use OpenAI (default)
krea config set apiProvider openai
krea config set defaultModel gpt-4o

# Use Anthropic Claude
krea config set apiProvider anthropic
krea config set defaultModel claude-sonnet-4-20250514
```

Set output directory:

```bash
krea config set outputDir ./src/components
```

## Examples

### Generate a Hero Section

```bash
krea generate "Create a modern hero section with a gradient background,
large heading, subtitle, and two CTA buttons"
```

### Generate a Dashboard Card

```bash
krea generate "Create a dashboard stats card showing revenue,
with an icon, percentage change indicator, and sparkline chart"
```

### Interactive Chat

```bash
krea chat
# You: Create a login form with email and password
# Krea: [generates component with streaming output]
# You: Add a "Remember me" checkbox
# Krea: [updates the component]
# /save
```

## Features

- 🤖 **AI-Powered**: Uses GPT-4o or Claude for intelligent generation
- ⚡ **Streaming**: See components being generated in real-time
- 🎨 **TailwindCSS**: Beautiful, utility-first styling out of the box
- 🧩 **shadcn/ui**: Seamless integration with shadcn components
- 💬 **Interactive Chat**: Iterate on designs conversationally
- 📁 **Auto-Save**: Components saved directly to your project

## Requirements

- Node.js 18+
- OpenAI or Anthropic API key

## License

MIT
