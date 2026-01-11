#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { execSync } from "child_process";
import { createApp } from "./commands/create-app.js";
import { buildProject } from "./commands/build.js";

const packageJsonPath = path.resolve(
  new URL(".", import.meta.url).pathname,
  "../package.json"
);
const { version: VERSION } = JSON.parse(
  fs.readFileSync(packageJsonPath, "utf8")
);

const args = process.argv.slice(2);
const command = args[0];
const root = process.cwd();
const projectTsConfig = path.join(root, "tsconfig.json");
const configPath = path.join(root, "fastay.config.json");

const checkConfig = () => {
  if (!fs.existsSync(configPath)) {
    console.error("✗ fastay.config.json not found in this project.");
    process.exit(1);
  }
};

const commandDev = fs.existsSync(projectTsConfig)
  ? "NODE_ENV=development tsx src/index.ts"
  : "NODE_ENV=development tsx src/index.js";

const commandDevWatch = fs.existsSync(projectTsConfig)
  ? "NODE_ENV=development tsx watch src/index.ts"
  : "NODE_ENV=development tsx watch src/index.js";

function run(cmd: string) {
  execSync(cmd, { stdio: "inherit" });
}

if (command === "-v" || command === "--version") {
  console.log(`${VERSION}`);
  process.exit(0);
}

if (command === "--help" || !command) {
  // imprime o help acima
  process.exit(0);
}

switch (command) {
  case "create-app":
    createApp(args[1]);
    break;

  case "dev":
    run(commandDev);
    break;

  case "dev:watch":
    run(commandDevWatch);
    break;

  case "build":
    checkConfig();
    const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
    buildProject(config, root);
    break;

  case "start":
    checkConfig();
    const configs = JSON.parse(fs.readFileSync(configPath, "utf8"));

    run(`NODE_ENV=production node ${configs?.outDir}/index.js`);
    break;

  case "info":
    const nodeVersion = process.version;
    const tsPresent = fs.existsSync(projectTsConfig);
    const configExists = fs.existsSync(configPath);
    const projectName = path.basename(root);

    console.log(`
⥨ Fastay Info

CLI Version: v${VERSION}
Project: ${projectName}
Root: ${root}
Node: ${nodeVersion}
TypeScript: ${tsPresent ? "✓ present" : "✗ not found"}
fastay.config.json: ${configExists ? "✓ found" : "✗ missing"}
`);
    break;

  default:
    console.log(`
⥨ Fastay CLI

Fastay is a lightweight Node.js framework for building fast, structured APIs.

Usage:
  fastay <command> [options]

Available commands:
  create-app <name>   Create a new Fastay project
  dev                 Start the development server
  dev:watch           Start dev server with file watching
  build               Build the project for production
  start               Run the production build
  info                Show project and CLI info

Examples:
  npx fastay create-app my-api
  cd my-api
  npm run dev
  npm run build
  npm run start

Tips:
  • Run commands inside a Fastay project
  • fastay.config.json is required for build/start
  • Node.js 18+ is recommended

Use "fastay --help" to see this message again.
`);
}
