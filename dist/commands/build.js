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
import esbuild from 'esbuild';
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { glob } from 'glob';
// recriar __dirname em ESM
var __filename = fileURLToPath(import.meta.url);
var __dirname = path.dirname(__filename);
export function buildProject(config, root) {
    return __awaiter(this, void 0, void 0, function () {
        var outDir, projectTsConfig, whatLanguage, projectEslint, projectEslintConfig, files, srcRoutes, distRoutes, fixScript;
        var _a, _b, _c, _d, _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    outDir = path.join(root, config.outDir || 'build');
                    projectTsConfig = path.join(root, 'tsconfig.json');
                    whatLanguage = fs.existsSync(projectTsConfig) ? 'ts' : 'js';
                    console.log('📦 Building project...');
                    // 1) ───── LINT (ESLint)
                    try {
                        console.log('🔍 Checking for ESLint in project...');
                        projectEslint = path.join(root, 'node_modules/.bin/eslint');
                        projectEslintConfig = path.join(root, 'eslint.config.mjs');
                        if (fs.existsSync(projectEslint) && fs.existsSync(projectEslintConfig)) {
                            try {
                                console.log('🔍 Running ESLint...');
                                execSync("\"".concat(projectEslint, "\" --fix -c \"").concat(projectEslintConfig, "\" \"").concat(path.join(root, 'src'), "\""), { stdio: 'inherit' });
                            }
                            catch (_g) {
                                console.error('❌ ESLint errors detected. Fix them before building.');
                                process.exit(1);
                            }
                        }
                        else {
                            console.log('ℹ No ESLint found in this project. Skipping lint step.');
                        }
                    }
                    catch (_h) {
                        console.error('❌ ESLint found errors. Fix them before building.');
                        process.exit(1);
                    }
                    // 2) ───── TYPE CHECK (tsc --noEmit)
                    if (whatLanguage === 'ts') {
                        try {
                            console.log('🔧 Checking TypeScript types...');
                            execSync('npx tsc --noEmit', { cwd: root, stdio: 'inherit' });
                        }
                        catch (_j) {
                            console.error('❌ TypeScript errors detected. Build aborted.');
                            process.exit(1);
                        }
                    }
                    // 3) ───── Limpar build anterior
                    fs.rmSync(outDir, { recursive: true, force: true });
                    fs.mkdirSync(outDir, { recursive: true });
                    // 4) ───── Compilar entry principal com esbuild
                    console.log('📦 Discovering source files...');
                    return [4 /*yield*/, glob('src/**/*.' + whatLanguage, { cwd: root })];
                case 1:
                    files = _f.sent();
                    console.log('📦 Building files:', files);
                    return [4 /*yield*/, esbuild.build({
                            entryPoints: files.map(function (f) { return path.join(root, f); }),
                            outbase: path.join(root, 'src'),
                            outdir: outDir,
                            bundle: false,
                            format: 'esm',
                            platform: 'node',
                            sourcemap: true,
                            treeShaking: ((_a = config.compiler) === null || _a === void 0 ? void 0 : _a.treeShaking)
                                ? config.compiler.treeShaking
                                : false,
                            legalComments: ((_b = config.compiler) === null || _b === void 0 ? void 0 : _b.legalComments)
                                ? (_c = config.compiler) === null || _c === void 0 ? void 0 : _c.legalComments
                                : 'none',
                            loader: whatLanguage === 'ts' ? { '.ts': 'ts' } : { '.js': 'js' },
                            target: (_e = (_d = config.compiler) === null || _d === void 0 ? void 0 : _d.target) !== null && _e !== void 0 ? _e : 'es2020',
                            logLevel: 'info',
                        })];
                case 2:
                    _f.sent();
                    // 5) ───── Copiar rotas se existirem
                    if (config.routesDir) {
                        srcRoutes = path.join(root, config.routesDir);
                        distRoutes = path.join(outDir, 'routes');
                        if (fs.existsSync(srcRoutes)) {
                            fs.cpSync(srcRoutes, distRoutes, { recursive: true });
                        }
                    }
                    // 6) ───── Corrigir imports
                    console.log('🔧 Running import fix...');
                    fixScript = path.join(__dirname, '../compiler/post-build-fix.js');
                    execSync("node ".concat(fixScript, " ").concat(outDir), { stdio: 'inherit' });
                    console.log('✔ Build finished.');
                    return [2 /*return*/];
            }
        });
    });
}
