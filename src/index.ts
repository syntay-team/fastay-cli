#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'child_process';
import { createApp } from './commands/create-app.js';
import { buildProject } from './commands/build.js';

const args = process.argv.slice(2);
const command = args[0]; // o commando
const root = process.cwd(); // o caminho do projecto do cliente
const projectTsConfig = path.join(root, 'tsconfig.json');
const configPath = path.join(root, 'fastay.config.json');

const checkConfig = () => {
  if (!fs.existsSync(configPath)) {
    console.error('❌ fastay.config.json not found in this project.');
    process.exit(1);
  }
};

const commandDev = fs.existsSync(projectTsConfig)
  ? 'NODE_ENV=development tsx src/index.ts'
  : 'NODE_ENV=development tsx src/index.js';

const commandDevWatch = fs.existsSync(projectTsConfig)
  ? 'NODE_ENV=development tsx watch src/index.ts'
  : 'NODE_ENV=development tsx watch src/index.js';

const commandBuild = fs.existsSync(projectTsConfig)
  ? 'tsx watch src/index.ts'
  : 'tsx watch src/index.js';

function run(cmd: string) {
  execSync(cmd, { stdio: 'inherit' });
}

switch (command) {
  case 'create-app':
    createApp(args[1]);
    break;

  case 'dev':
    run(commandDev);
    break;

  case 'dev:watch':
    run(commandDevWatch);
    break;

  case 'build':
    checkConfig();
    const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    buildProject(config, root);
    break;

  case 'start':
    checkConfig();
    const configs = JSON.parse(fs.readFileSync(configPath, 'utf8'));

    run(`NODE_ENV=production node ${configs?.outDir}/index.js`);
    break;

  default:
    console.log(`
Fastay CLI

Commands:
  fastay create-app <name>
  fastay dev
  fastay dev:watch
  fastay build
  fastay start

Examples:
  npx fastay create-app my-api
  npx fastay dev
`);
}
