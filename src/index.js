#!/usr/bin/env node
import { createApp } from "./commands/create-app.js";
const args = process.argv.slice(2);
const command = args[0];
switch (command) {
    case "create-app":
        createApp(args[1]);
        break;
    default:
        console.log(`
Fastay CLI

Commands:
  fastay create-app <name>

Examples:
  npx fastay create-app my-api
`);
        break;
}
//# sourceMappingURL=index.js.map