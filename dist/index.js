#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { execSync } from "child_process";
import { createApp } from "./commands/create-app.js";
import { buildProject } from "./commands/build.js";
var packageJsonPath = path.resolve(new URL(".", import.meta.url).pathname, "../package.json");
var VERSION = JSON.parse(fs.readFileSync(packageJsonPath, "utf8")).version;
var args = process.argv.slice(2);
var command = args[0]; // o commando
var root = process.cwd(); // o caminho do projecto do cliente
var projectTsConfig = path.join(root, "tsconfig.json");
var configPath = path.join(root, "fastay.config.json");
var checkConfig = function () {
    if (!fs.existsSync(configPath)) {
        console.error("❌ fastay.config.json not found in this project.");
        process.exit(1);
    }
};
var commandDev = fs.existsSync(projectTsConfig)
    ? "NODE_ENV=development tsx src/index.ts"
    : "NODE_ENV=development tsx src/index.js";
var commandDevWatch = fs.existsSync(projectTsConfig)
    ? "NODE_ENV=development tsx watch src/index.ts"
    : "NODE_ENV=development tsx watch src/index.js";
function run(cmd) {
    execSync(cmd, { stdio: "inherit" });
}
if (command === "-v" || command === "--version") {
    console.log("".concat(VERSION));
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
        var config = JSON.parse(fs.readFileSync(configPath, "utf8"));
        buildProject(config, root);
        break;
    case "start":
        checkConfig();
        var configs = JSON.parse(fs.readFileSync(configPath, "utf8"));
        run("NODE_ENV=production node ".concat(configs === null || configs === void 0 ? void 0 : configs.outDir, "/index.js"));
        break;
    case "info":
        var nodeVersion = process.version;
        var tsPresent = fs.existsSync(projectTsConfig);
        var configExists = fs.existsSync(configPath);
        var projectName = path.basename(root);
        console.log("\n\u2968 Fastay Info\n\nCLI Version: v".concat(VERSION, "\nProject: ").concat(projectName, "\nRoot: ").concat(root, "\nNode: ").concat(nodeVersion, "\nTypeScript: ").concat(tsPresent ? "✓ present" : "✗ not found", "\nfastay.config.json: ").concat(configExists ? "✓ found" : "✗ missing", "\n"));
        break;
    default:
        console.log("\n\u2968 Fastay CLI\n\nFastay is a lightweight Node.js framework for building fast, structured APIs.\n\nUsage:\n  fastay <command> [options]\n\nAvailable commands:\n  create-app <name>   Create a new Fastay project\n  dev                 Start the development server\n  dev:watch           Start dev server with file watching\n  build               Build the project for production\n  start               Run the production build\n  info                Show project and CLI info\n\nExamples:\n  npx fastay create-app my-api\n  cd my-api\n  npm run dev\n  npm run build\n  npm run start\n\nTips:\n  \u2022 Run commands inside a Fastay project\n  \u2022 fastay.config.json is required for build/start\n  \u2022 Node.js 18+ is recommended\n\nUse \"fastay --help\" to see this message again.\n");
}
