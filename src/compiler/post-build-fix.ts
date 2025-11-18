import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";


// pasta onde o build final foi colocado
const ROOT = process.argv[2]
  ? path.resolve(process.argv[2])
  : (() => {
      console.error("❌ No dist path provided to post-build-fix");
      process.exit(1);
    })();

// extensões que tentaremos resolver ao final dos imports
const TRY_EXTS = [".js", ".json", ".mjs", ".cjs"];

console.log("🔧 Running post-build import fix...");

/**
 * Tenta resolver o caminho correto do import adicionando extensões como .js
 */
function resolveImport(importPath: string, fileDir: string): string | null {
  // já tem extensão => não mexer
  if (path.extname(importPath)) return null;

  const base = path.resolve(fileDir, importPath);

  for (const ext of TRY_EXTS) {
    if (fs.existsSync(base + ext)) return importPath + ext;

    const indexFile = path.join(base, "index" + ext);
    if (fs.existsSync(indexFile)) {
      return path.join(importPath, "index" + ext);
    }
  }

  return null;
}

/**
 * Processa um arquivo .js e corrige imports sem extensão
 */
function processFile(filePath: string): void {
  let code = fs.readFileSync(filePath, "utf8");
  const dir = path.dirname(filePath);

  const importRegex = /from\s+["'](\.{1,2}\/[^"']*)["']/g;
  let changed = false;

  code = code.replace(importRegex, (full, rawImport) => {
    const fixed = resolveImport(rawImport, dir);
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
function walk(dir: string): void {
  for (const entry of fs.readdirSync(dir)) {
    const fullPath = path.join(dir, entry);
    const stat = fs.lstatSync(fullPath);

    if (stat.isDirectory()) {
      walk(fullPath);
    } else if (fullPath.endsWith(".js")) {
      processFile(fullPath);
    }
  }
}

// inicia a varredura
walk(ROOT);
console.log("✓ Import fix completed.");