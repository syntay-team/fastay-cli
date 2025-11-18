import esbuild from 'esbuild';
import fs, { watch } from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { glob } from 'glob';

export interface FastayConfig {
  outDir?: string;
  routesDir?: string;
  compiler?: {
    target?: string;
    treeShaking?: boolean;
    legalComments?: 'none' | 'inline' | 'linked' | 'external';
  };
}

// recriar __dirname em ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function buildProject(config: FastayConfig, root: string) {
  const outDir = path.join(root, config.outDir || 'build');
  const projectTsConfig = path.join(root, 'tsconfig.json');
  const whatLanguage = fs.existsSync(projectTsConfig) ? 'ts' : 'js';

  console.log('📦 Building project...');

  // 1) ───── LINT (ESLint)
  try {
    console.log('🔍 Checking for ESLint in project...');

    const projectEslint = path.join(root, 'node_modules/.bin/eslint');
    const projectEslintConfig = path.join(root, 'eslint.config.mjs'); // ou eslint.config.mjs

    if (fs.existsSync(projectEslint) && fs.existsSync(projectEslintConfig)) {
      try {
        console.log('🔍 Running ESLint...');
        execSync(
          `"${projectEslint}" --fix -c "${projectEslintConfig}" "${path.join(
            root,
            'src'
          )}"`,
          { stdio: 'inherit' }
        );
      } catch {
        console.error('❌ ESLint errors detected. Fix them before building.');
        process.exit(1);
      }
    } else {
      console.log('ℹ No ESLint found in this project. Skipping lint step.');
    }
  } catch {
    console.error('❌ ESLint found errors. Fix them before building.');
    process.exit(1);
  }

  // 2) ───── TYPE CHECK (tsc --noEmit)
  if (whatLanguage === 'ts') {
    try {
      console.log('🔧 Checking TypeScript types...');
      execSync('npx tsc --noEmit', { cwd: root, stdio: 'inherit' });
    } catch {
      console.error('❌ TypeScript errors detected. Build aborted.');
      process.exit(1);
    }
  }
  // 3) ───── Limpar build anterior
  fs.rmSync(outDir, { recursive: true, force: true });
  fs.mkdirSync(outDir, { recursive: true });

  // 4) ───── Compilar entry principal com esbuild

  console.log('📦 Discovering source files...');

  const files = await glob('src/**/*.' + whatLanguage, { cwd: root });
  console.log('📦 Building files:', files);

  await esbuild.build({
    entryPoints: files.map((f) => path.join(root, f)),
    outbase: path.join(root, 'src'),
    outdir: outDir,
    bundle: false,
    format: 'esm',
    platform: 'node',
    sourcemap: true,
    treeShaking: config.compiler?.treeShaking
      ? config.compiler.treeShaking
      : false,
    legalComments: config.compiler?.legalComments
      ? config.compiler?.legalComments
      : 'none',
    loader: whatLanguage === 'ts' ? { '.ts': 'ts' } : { '.js': 'js' },
    target: config.compiler?.target ?? 'es2020',
    logLevel: 'info',
  });

  // 5) ───── Copiar rotas se existirem
  if (config.routesDir) {
    const srcRoutes = path.join(root, config.routesDir);
    const distRoutes = path.join(outDir, 'routes');

    if (fs.existsSync(srcRoutes)) {
      fs.cpSync(srcRoutes, distRoutes, { recursive: true });
    }
  }

  // 6) ───── Corrigir imports
  console.log('🔧 Running import fix...');
  const fixScript = path.join(__dirname, '../compiler/post-build-fix.js');
  execSync(`node ${fixScript} ${outDir}`, { stdio: 'inherit' });

  console.log('✔ Build finished.');
}
