import fs from "node:fs";
import path from "node:path";
// pasta onde o build final foi colocado
var ROOT = process.argv[2]
    ? path.resolve(process.argv[2])
    : (function () {
        console.error("❌ No dist path provided to post-build-fix");
        process.exit(1);
    })();
// extensões que tentaremos resolver ao final dos imports
var TRY_EXTS = [".js", ".json", ".mjs", ".cjs"];
console.log("🔧 Running post-build import fix...");
/**
 * Tenta resolver o caminho correto do import adicionando extensões como .js
 */
function resolveImport(importPath, fileDir) {
    // já tem extensão => não mexer
    if (path.extname(importPath))
        return null;
    var base = path.resolve(fileDir, importPath);
    for (var _i = 0, TRY_EXTS_1 = TRY_EXTS; _i < TRY_EXTS_1.length; _i++) {
        var ext = TRY_EXTS_1[_i];
        if (fs.existsSync(base + ext))
            return importPath + ext;
        var indexFile = path.join(base, "index" + ext);
        if (fs.existsSync(indexFile)) {
            return path.join(importPath, "index" + ext);
        }
    }
    return null;
}
/**
 * Processa um arquivo .js e corrige imports sem extensão
 */
function processFile(filePath) {
    var code = fs.readFileSync(filePath, "utf8");
    var dir = path.dirname(filePath);
    var importRegex = /from\s+["'](\.{1,2}\/[^"']*)["']/g;
    var changed = false;
    code = code.replace(importRegex, function (full, rawImport) {
        var fixed = resolveImport(rawImport, dir);
        if (fixed) {
            changed = true;
            return full.replace(rawImport, fixed);
        }
        return full;
    });
    if (changed) {
        fs.writeFileSync(filePath, code, "utf8");
        console.log("✔ Fixed:", filePath);
    }
}
/**
 * Percorre diretórios recursivamente
 */
function walk(dir) {
    for (var _i = 0, _a = fs.readdirSync(dir); _i < _a.length; _i++) {
        var entry = _a[_i];
        var fullPath = path.join(dir, entry);
        var stat = fs.lstatSync(fullPath);
        if (stat.isDirectory()) {
            walk(fullPath);
        }
        else if (fullPath.endsWith(".js")) {
            processFile(fullPath);
        }
    }
}
// inicia a varredura
walk(ROOT);
console.log("✓ Import fix completed.");
