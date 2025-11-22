import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.argv[2];
if (!ROOT) {
  console.error('❌ No dist path provided');
  process.exit(1);
}

console.log('🔧 RUNNING POST-BUILD FIX...');

/**
 * Calcula quantos níveis precisamos voltar para chegar na raiz do dist
 */
function calculateRelativeDepth(filePath: string): string {
  const relativePath = path.relative(ROOT, path.dirname(filePath));
  const depth = relativePath.split(path.sep).length;

  if (depth === 0) return './';

  let relativePrefix = '';
  for (let i = 0; i < depth; i++) {
    relativePrefix += '../';
  }

  return relativePrefix;
}

/**
 * Converte alias @/ para caminho relativo CORRETO baseado na profundidade
 */
function convertAlias(importPath: string, filePath: string): string {
  if (importPath.startsWith('@/')) {
    const withoutAlias = importPath.slice(2); // Remove '@/'
    const relativePrefix = calculateRelativeDepth(filePath);

    // Para imports de arquivos (como lib/auth/profissional)
    if (withoutAlias.endsWith('.js') || withoutAlias.includes('/')) {
      return `${relativePrefix}${withoutAlias}`;
    }

    // Para imports de diretórios (como utils/db)
    return `${relativePrefix}${withoutAlias}/index.js`;
  }

  return importPath;
}

function processFile(filePath: string) {
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  // Regex para capturar imports com alias
  const aliasRegex = /from\s+["'](@\/[^"']*)["']/g;

  content = content.replace(aliasRegex, (match, importPath) => {
    const convertedPath = convertAlias(importPath, filePath);

    if (convertedPath !== importPath) {
      changed = true;
      console.log(
        `  📍 ${path.relative(
          ROOT,
          filePath
        )}: ${importPath} → ${convertedPath}`
      );
      return `from "${convertedPath}"`;
    }

    return match;
  });

  // Também corrige imports relativos sem extensão
  const relativeRegex = /from\s+["'](\.\.?\/[^"']*)["']/g;
  content = content.replace(relativeRegex, (match, importPath) => {
    if (!path.extname(importPath)) {
      const fullImportPath = path.resolve(path.dirname(filePath), importPath);

      // Verifica se é arquivo .js
      if (fs.existsSync(fullImportPath + '.js')) {
        changed = true;
        return `from "${importPath}.js"`;
      }

      // Verifica se é diretório com index.js
      if (
        fs.existsSync(fullImportPath) &&
        fs.statSync(fullImportPath).isDirectory()
      ) {
        if (fs.existsSync(path.join(fullImportPath, 'index.js'))) {
          changed = true;
          return `from "${path.join(importPath, 'index.js')}"`;
        }
      }
    }

    return match;
  });

  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8');
  }
}

function walk(dir: string) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      walk(fullPath);
    } else if (file.endsWith('.js')) {
      processFile(fullPath);
    }
  }
}

console.log(`🔧 Processing: ${ROOT}`);
walk(ROOT);
console.log('✅ POST-BUILD FIX COMPLETED');
