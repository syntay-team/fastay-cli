import fs from 'node:fs';
import path from 'node:path';
var ROOT = process.argv[2];
if (!ROOT) {
    console.error('❌ No dist path provided');
    process.exit(1);
}
console.log('🔧 RUNNING POST-BUILD FIX...');
/**
 * Calcula quantos níveis precisamos voltar para chegar na raiz do dist
 */
function calculateRelativeDepth(filePath) {
    var relativePath = path.relative(ROOT, path.dirname(filePath));
    var depth = relativePath.split(path.sep).length;
    if (depth === 0)
        return './';
    var relativePrefix = '';
    for (var i = 0; i < depth; i++) {
        relativePrefix += '../';
    }
    return relativePrefix;
}
/**
 * Converte alias @/ para caminho relativo CORRETO baseado na profundidade
 */
function convertAlias(importPath, filePath) {
    if (importPath.startsWith('@/')) {
        var withoutAlias = importPath.slice(2); // Remove '@/'
        var relativePrefix = calculateRelativeDepth(filePath);
        // Para imports de arquivos (como lib/auth/profissional)
        if (withoutAlias.endsWith('.js') || withoutAlias.includes('/')) {
            return "".concat(relativePrefix).concat(withoutAlias);
        }
        // Para imports de diretórios (como utils/db)
        return "".concat(relativePrefix).concat(withoutAlias, "/index.js");
    }
    return importPath;
}
function processFile(filePath) {
    var content = fs.readFileSync(filePath, 'utf8');
    var changed = false;
    // Regex para capturar imports com alias
    var aliasRegex = /from\s+["'](@\/[^"']*)["']/g;
    content = content.replace(aliasRegex, function (match, importPath) {
        var convertedPath = convertAlias(importPath, filePath);
        if (convertedPath !== importPath) {
            changed = true;
            console.log("  \uD83D\uDCCD ".concat(path.relative(ROOT, filePath), ": ").concat(importPath, " \u2192 ").concat(convertedPath));
            return "from \"".concat(convertedPath, "\"");
        }
        return match;
    });
    // Também corrige imports relativos sem extensão
    var relativeRegex = /from\s+["'](\.\.?\/[^"']*)["']/g;
    content = content.replace(relativeRegex, function (match, importPath) {
        if (!path.extname(importPath)) {
            var fullImportPath = path.resolve(path.dirname(filePath), importPath);
            // Verifica se é arquivo .js
            if (fs.existsSync(fullImportPath + '.js')) {
                changed = true;
                return "from \"".concat(importPath, ".js\"");
            }
            // Verifica se é diretório com index.js
            if (fs.existsSync(fullImportPath) &&
                fs.statSync(fullImportPath).isDirectory()) {
                if (fs.existsSync(path.join(fullImportPath, 'index.js'))) {
                    changed = true;
                    return "from \"".concat(path.join(importPath, 'index.js'), "\"");
                }
            }
        }
        return match;
    });
    if (changed) {
        fs.writeFileSync(filePath, content, 'utf8');
    }
}
function walk(dir) {
    var files = fs.readdirSync(dir);
    for (var _i = 0, files_1 = files; _i < files_1.length; _i++) {
        var file = files_1[_i];
        var fullPath = path.join(dir, file);
        var stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            walk(fullPath);
        }
        else if (file.endsWith('.js')) {
            processFile(fullPath);
        }
    }
}
console.log("\uD83D\uDD27 Processing: ".concat(ROOT));
walk(ROOT);
console.log('✅ POST-BUILD FIX COMPLETED');
