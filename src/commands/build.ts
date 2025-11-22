import esbuild from 'esbuild';
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { glob } from 'glob';
import { Logger } from '../utils/logger.js';

export interface FastayConfig {
  outDir?: string;
  routesDir?: string;
  alias?: Record<string, string>;
  compiler?: {
    target?: string;
    treeShaking?: boolean;
    legalComments?: 'none' | 'inline' | 'linked' | 'external';
  };
}

// recriar __dirname em ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Pré-processa os arquivos substituindo aliases por caminhos relativos
 */
async function preprocessFiles(
  files: string[],
  root: string,
  aliases: Record<string, string>
): Promise<string[]> {
  const tempDir = path.join(root, '.fastay-temp');
  fs.rmSync(tempDir, { recursive: true, force: true });
  fs.mkdirSync(tempDir, { recursive: true });

  const processedFiles: string[] = [];

  for (const file of files) {
    const filePath = path.join(root, file);
    const content = fs.readFileSync(filePath, 'utf8');

    // Substitui aliases por caminhos relativos
    let processedContent = content;
    for (const [alias, aliasPath] of Object.entries(aliases)) {
      const regex = new RegExp(
        `from\\s+["']${alias.replace('@', '\\@')}([^"']*)["']`,
        'g'
      );
      processedContent = processedContent.replace(regex, (match, pathPart) => {
        // Calcula o caminho relativo do arquivo atual para o alias
        const relativePath = path.relative(
          path.dirname(filePath),
          path.join(aliasPath, pathPart)
        );
        return `from "${
          relativePath.startsWith('.') ? relativePath : './' + relativePath
        }"`;
      });
    }

    const tempFile = path.join(tempDir, file);
    fs.mkdirSync(path.dirname(tempFile), { recursive: true });
    fs.writeFileSync(tempFile, processedContent, 'utf8');
    processedFiles.push(tempFile);
  }

  return processedFiles;
}

export async function buildProject(config: FastayConfig, root: string) {
  const outDir = path.join(root, config.outDir || 'build');
  const projectTsConfig = path.join(root, 'tsconfig.json');
  const whatLanguage = fs.existsSync(projectTsConfig) ? 'ts' : 'js';

  Logger.start('Fastay.js - Building Project');
  Logger.info('Project root:', root);

  // 1) ───── LINT (ESLint)
  try {
    Logger.info('Checking for ESLint in project...');
    const projectEslint = path.join(root, 'node_modules/.bin/eslint');
    const projectEslintConfig = path.join(root, 'eslint.config.mjs');

    if (fs.existsSync(projectEslint) && fs.existsSync(projectEslintConfig)) {
      Logger.buildStep('LINT', 'Running ESLint...');
      execSync(
        `"${projectEslint}" --fix -c "${projectEslintConfig}" "${path.join(
          root,
          'src'
        )}"`,
        { stdio: 'inherit' }
      );
      Logger.success('ESLint completed successfully.');
    } else {
      Logger.info('No ESLint found. Skipping lint step.');
    }
  } catch {
    Logger.warning('ESLint had issues, continuing build...');
  }

  // 2) ───── TYPE CHECK (tsc --noEmit)
  if (whatLanguage === 'ts') {
    try {
      Logger.buildStep('TYPE CHECK', 'Checking TypeScript types...');
      execSync('npx tsc --noEmit', { cwd: root, stdio: 'inherit' });
    } catch {
      Logger.error('TypeScript errors detected. Build aborted.');
      process.exit(1);
    }
  }

  // 3) ───── Limpar build anterior
  Logger.buildStep('CLEAN', 'Removing previous build...');
  fs.rmSync(outDir, { recursive: true, force: true });
  fs.mkdirSync(outDir, { recursive: true });

  // 4) ───── Resolver aliases
  const aliases: Record<string, string> = {};
  if (config.alias) {
    for (const [alias, aliasPath] of Object.entries(config.alias)) {
      const cleanAlias = alias.replace(/\/\*$/, '');
      const resolvedPath = path.resolve(root, aliasPath.replace(/\/\*$/, ''));
      aliases[cleanAlias] = resolvedPath;
    }
  }

  // 5) ───── Compilar com esbuild
  Logger.buildStep('DISCOVER', 'Discovering source files...');
  const files = await glob('src/**/*.' + whatLanguage, { cwd: root });
  Logger.info(`Found ${files.length} source files`);

  Logger.buildStep('BUILD', 'Creating an optimized production build ...');
  await esbuild.build({
    entryPoints: files.map((f) => path.join(root, f)),
    outbase: path.join(root, 'src'),
    outdir: outDir,
    bundle: false,
    format: 'esm',
    platform: 'node',
    resolveExtensions: whatLanguage === 'ts' ? ['.ts', '.js'] : ['.js'],
    sourcemap: true,
    treeShaking: config.compiler?.treeShaking ?? false,
    legalComments: config.compiler?.legalComments ?? 'none',
    loader: whatLanguage === 'ts' ? { '.ts': 'ts' } : { '.js': 'js' },
    target: config.compiler?.target ?? 'es2020',
    logLevel: 'info',
  });

  // 6) ───── Copiar rotas se existirem
  if (config.routesDir) {
    const srcRoutes = path.join(root, config.routesDir);
    const distRoutes = path.join(outDir, 'routes');
    if (fs.existsSync(srcRoutes)) {
      fs.cpSync(srcRoutes, distRoutes, { recursive: true });
    }
  }

  // 7) ───── Corrigir imports (AGORA ESSA É A PARTE MAIS IMPORTANTE)
  Logger.buildStep('FIX', 'Running import fix...');
  const fixScript = path.join(__dirname, '../compiler/post-build-fix.js');
  execSync(`node ${fixScript} ${outDir}`, { stdio: 'inherit' });

  // Limpar temp dir
  const tempDir = path.join(root, '.fastay-temp');
  fs.rmSync(tempDir, { recursive: true, force: true });

  Logger.success('Build completed successfully!');
}
