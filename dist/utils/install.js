var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { exec } from 'child_process';
import chalk from 'chalk';
import fs from 'fs';
import path from 'path';
export function updatePackageJson(projectDir, newName) {
    var packageJsonPath = path.join(projectDir, 'package.json');
    var json = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    json.name = newName;
    fs.writeFileSync(packageJsonPath, JSON.stringify(json, null, 2));
}
export function installDependencies(projectDir, orm, database, typescript, name) {
    return __awaiter(this, void 0, void 0, function () {
        var deps, devDeps;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    deps = ['@syntay/fastay'];
                    devDeps = [];
                    // if (typescript) {
                    //   devDeps.push('typescript', '@types/node', 'ts-node', 'tsconfig-paths');
                    // }
                    if (orm === 'prisma') {
                        deps.push('@prisma/client');
                        devDeps.push('prisma');
                    }
                    // if (orm === "drizzle") {
                    //   deps.push("drizzle-orm");
                    //   deps.push("drizzle-kit");
                    // }
                    // if (database === "postgres") deps.push("pg");
                    // if (database === "mysql") deps.push("mysql2");
                    // if (database === "sqlite") deps.push("better-sqlite3");
                    return [4 /*yield*/, updatePackageJson(projectDir, name)];
                case 1:
                    // if (orm === "drizzle") {
                    //   deps.push("drizzle-orm");
                    //   deps.push("drizzle-kit");
                    // }
                    // if (database === "postgres") deps.push("pg");
                    // if (database === "mysql") deps.push("mysql2");
                    // if (database === "sqlite") deps.push("better-sqlite3");
                    _a.sent();
                    return [4 /*yield*/, run("npm install -g fastay tsx", projectDir)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, run("npm install ".concat(deps.join(' ')), projectDir)];
                case 3:
                    _a.sent();
                    if (!(devDeps.length > 0)) return [3 /*break*/, 5];
                    return [4 /*yield*/, run("npm install -D ".concat(devDeps.join(' ')), projectDir)];
                case 4:
                    _a.sent();
                    _a.label = 5;
                case 5: return [2 /*return*/];
            }
        });
    });
}
function run(cmd, cwd) {
    return new Promise(function (resolve, reject) {
        exec(cmd, { cwd: cwd }, function (err, stdout, stderr) {
            if (err) {
                console.error(chalk.red('Error installing dependencies'));
                reject(err);
            }
            else
                resolve();
        });
    });
}
