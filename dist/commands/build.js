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
import { Logger } from '../utils/logger.js';
// recriar __dirname em ESM
var __filename = fileURLToPath(import.meta.url);
var __dirname = path.dirname(__filename);
/**
 * Pré-processa os arquivos substituindo aliases por caminhos relativos
 */
function preprocessFiles(files, root, aliases) {
    return __awaiter(this, void 0, void 0, function () {
        var tempDir, processedFiles, _loop_1, _i, files_1, file;
        return __generator(this, function (_a) {
            tempDir = path.join(root, '.fastay-temp');
            fs.rmSync(tempDir, { recursive: true, force: true });
            fs.mkdirSync(tempDir, { recursive: true });
            processedFiles = [];
            _loop_1 = function (file) {
                var filePath = path.join(root, file);
                var content = fs.readFileSync(filePath, 'utf8');
                // Substitui aliases por caminhos relativos
                var processedContent = content;
                var _loop_2 = function (alias, aliasPath) {
                    var regex = new RegExp("from\\s+[\"']".concat(alias.replace('@', '\\@'), "([^\"']*)[\"']"), 'g');
                    processedContent = processedContent.replace(regex, function (match, pathPart) {
                        // Calcula o caminho relativo do arquivo atual para o alias
                        var relativePath = path.relative(path.dirname(filePath), path.join(aliasPath, pathPart));
                        return "from \"".concat(relativePath.startsWith('.') ? relativePath : './' + relativePath, "\"");
                    });
                };
                for (var _b = 0, _c = Object.entries(aliases); _b < _c.length; _b++) {
                    var _d = _c[_b], alias = _d[0], aliasPath = _d[1];
                    _loop_2(alias, aliasPath);
                }
                var tempFile = path.join(tempDir, file);
                fs.mkdirSync(path.dirname(tempFile), { recursive: true });
                fs.writeFileSync(tempFile, processedContent, 'utf8');
                processedFiles.push(tempFile);
            };
            for (_i = 0, files_1 = files; _i < files_1.length; _i++) {
                file = files_1[_i];
                _loop_1(file);
            }
            return [2 /*return*/, processedFiles];
        });
    });
}
export function buildProject(config, root) {
    return __awaiter(this, void 0, void 0, function () {
        var outDir, projectTsConfig, whatLanguage, projectEslint, projectEslintConfig, aliases, _i, _a, _b, alias, aliasPath, cleanAlias, resolvedPath, files, srcRoutes, distRoutes, fixScript, tempDir;
        var _c, _d, _e, _f, _g, _h;
        return __generator(this, function (_j) {
            switch (_j.label) {
                case 0:
                    outDir = path.join(root, config.outDir || 'build');
                    projectTsConfig = path.join(root, 'tsconfig.json');
                    whatLanguage = fs.existsSync(projectTsConfig) ? 'ts' : 'js';
                    Logger.start('Fastay.js - Building Project');
                    Logger.info('Project root:', root);
                    // 1) ───── LINT (ESLint)
                    try {
                        Logger.info('Checking for ESLint in project...');
                        projectEslint = path.join(root, 'node_modules/.bin/eslint');
                        projectEslintConfig = path.join(root, 'eslint.config.mjs');
                        if (fs.existsSync(projectEslint) && fs.existsSync(projectEslintConfig)) {
                            Logger.buildStep('Running ESLint...');
                            execSync("\"".concat(projectEslint, "\" --fix -c \"").concat(projectEslintConfig, "\" \"").concat(path.join(root, 'src'), "\""), { stdio: 'inherit' });
                            Logger.success('ESLint completed successfully.');
                        }
                        else {
                            Logger.info('No ESLint found. Skipping lint step.');
                        }
                    }
                    catch (_k) {
                        Logger.warning('ESLint had issues, continuing build...');
                    }
                    // 2) ───── TYPE CHECK (tsc --noEmit)
                    if (whatLanguage === 'ts') {
                        try {
                            Logger.buildStep('Checking TypeScript types...');
                            execSync('npx tsc --noEmit', { cwd: root, stdio: 'inherit' });
                        }
                        catch (_l) {
                            Logger.error('TypeScript errors detected. Build aborted.');
                            process.exit(1);
                        }
                    }
                    // 3) ───── Limpar build anterior
                    Logger.buildStep('Removing previous build...');
                    fs.rmSync(outDir, { recursive: true, force: true });
                    fs.mkdirSync(outDir, { recursive: true });
                    aliases = {};
                    if (config.alias) {
                        for (_i = 0, _a = Object.entries(config.alias); _i < _a.length; _i++) {
                            _b = _a[_i], alias = _b[0], aliasPath = _b[1];
                            cleanAlias = alias.replace(/\/\*$/, '');
                            resolvedPath = path.resolve(root, aliasPath.replace(/\/\*$/, ''));
                            aliases[cleanAlias] = resolvedPath;
                        }
                    }
                    // 5) ───── Compilar com esbuild
                    Logger.buildStep('Discovering source files...');
                    return [4 /*yield*/, glob('src/**/*.' + whatLanguage, { cwd: root })];
                case 1:
                    files = _j.sent();
                    Logger.info("Found ".concat(files.length, " source files"));
                    Logger.buildStep('Creating an optimized production build ...');
                    return [4 /*yield*/, esbuild.build({
                            entryPoints: files.map(function (f) { return path.join(root, f); }),
                            outbase: path.join(root, 'src'),
                            outdir: outDir,
                            bundle: false,
                            format: 'esm',
                            minify: true,
                            platform: 'node',
                            resolveExtensions: whatLanguage === 'ts' ? ['.ts', '.js'] : ['.js'],
                            sourcemap: true,
                            treeShaking: (_d = (_c = config.compiler) === null || _c === void 0 ? void 0 : _c.treeShaking) !== null && _d !== void 0 ? _d : false,
                            legalComments: (_f = (_e = config.compiler) === null || _e === void 0 ? void 0 : _e.legalComments) !== null && _f !== void 0 ? _f : 'none',
                            loader: whatLanguage === 'ts' ? { '.ts': 'ts' } : { '.js': 'js' },
                            target: (_h = (_g = config.compiler) === null || _g === void 0 ? void 0 : _g.target) !== null && _h !== void 0 ? _h : 'es2020',
                            logLevel: 'info',
                        })];
                case 2:
                    _j.sent();
                    // 6) ───── Copiar rotas se existirem
                    if (config.routesDir) {
                        srcRoutes = path.join(root, config.routesDir);
                        distRoutes = path.join(outDir, 'routes');
                        if (fs.existsSync(srcRoutes)) {
                            fs.cpSync(srcRoutes, distRoutes, { recursive: true });
                        }
                    }
                    // 7) ───── Corrigir imports (AGORA ESSA É A PARTE MAIS IMPORTANTE)
                    Logger.buildStep('Running import fix...');
                    fixScript = path.join(__dirname, '../compiler/post-build-fix.js');
                    execSync("node ".concat(fixScript, " ").concat(outDir), { stdio: 'inherit' });
                    tempDir = path.join(root, '.fastay-temp');
                    fs.rmSync(tempDir, { recursive: true, force: true });
                    Logger.success('Build completed successfully!');
                    return [2 /*return*/];
            }
        });
    });
}
