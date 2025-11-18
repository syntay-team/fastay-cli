#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'child_process';
import { createApp } from './commands/create-app.js';
import { buildProject } from './commands/build.js';
var args = process.argv.slice(2);
var command = args[0]; // o commando
var root = process.cwd(); // o caminho do projecto do cliente
var projectTsConfig = path.join(root, 'tsconfig.json');
var configPath = path.join(root, 'fastay.config.json');
var checkConfig = function () {
    if (!fs.existsSync(configPath)) {
        console.error('❌ fastay.config.json not found in this project.');
        process.exit(1);
    }
};
var commandDev = fs.existsSync(projectTsConfig)
    ? 'NODE_ENV=development tsx src/index.ts'
    : 'NODE_ENV=development tsx src/index.js';
var commandDevWatch = fs.existsSync(projectTsConfig)
    ? 'NODE_ENV=development tsx watch src/index.ts'
    : 'NODE_ENV=development tsx watch src/index.js';
var commandBuild = fs.existsSync(projectTsConfig)
    ? 'tsx watch src/index.ts'
    : 'tsx watch src/index.js';
function run(cmd) {
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
        var config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
        buildProject(config, root);
        break;
    case 'start':
        checkConfig();
        var configs = JSON.parse(fs.readFileSync(configPath, 'utf8'));
        run("NODE_ENV=production node ".concat(configs === null || configs === void 0 ? void 0 : configs.outDir, "/index.js"));
        break;
    default:
        console.log("\nFastay CLI\n\nCommands:\n  fastay create-app <name>\n  fastay dev\n  fastay dev:watch\n  fastay build\n  fastay start\n\nExamples:\n  npx fastay create-app my-api\n  npx fastay dev\n");
}
