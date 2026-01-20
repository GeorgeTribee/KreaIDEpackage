#!/usr/bin/env node
import {
  chatCommand,
  configCommand,
  generateCommand,
  initCommand,
  isInProject,
  printInfo,
  printLogo,
  printWelcome
} from "./chunk-72UKKVIF.js";

// src/cli.ts
import { Command } from "commander";
var program = new Command();
program.name("krea").description("AI-Powered React IDE - Generate React + TailwindCSS + shadcn/ui components from your terminal").version("1.2.8");
program.action(async () => {
  const inProject = await isInProject();
  if (!inProject) {
    printLogo();
    console.log();
    printInfo("No React project detected in this folder.");
    printInfo("Let's set one up for you!");
    console.log();
    await initCommand({});
    return;
  }
  printWelcome();
  await chatCommand();
});
program.command("init").description("Initialize a new React project with Vite, TailwindCSS, and shadcn/ui").option("--typescript", "Use TypeScript (default)", true).option("--no-typescript", "Use JavaScript").action(async (options) => {
  printLogo();
  await initCommand(options);
});
program.command("generate <prompt...>").alias("g").description("Generate a React component from a text prompt").option("-o, --output <dir>", "Output directory", "./src/components").option("--no-save", "Don't save to file, only print").option("--no-inject", "Don't auto-add component to App.tsx").action(async (promptParts, options) => {
  const prompt = promptParts.join(" ");
  await generateCommand(prompt, options);
});
program.command("chat").alias("c").description("Enter interactive chat mode").action(async () => {
  printLogo();
  await chatCommand();
});
program.command("config [action] [key] [value]").description("Manage configuration (list, set, get)").action(async (action, key, value) => {
  await configCommand(action, key, value);
});
program.parse();
