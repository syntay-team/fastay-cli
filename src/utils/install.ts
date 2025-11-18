import { exec } from 'child_process';
import chalk from 'chalk';
import fs from 'fs';
import path from 'path';

export function updatePackageJson(projectDir: string, newName: string) {
  const packageJsonPath = path.join(projectDir, 'package.json');

  const json = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  json.name = newName;

  fs.writeFileSync(packageJsonPath, JSON.stringify(json, null, 2));
}

export async function installDependencies(
  projectDir: string,
  orm: string,
  database: string,
  typescript: boolean,
  name: string
) {
  const deps = ['@syntay/fastay'];
  const devDeps = [];

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
  await updatePackageJson(projectDir, name);

  await run(`npm install -g tsx ${deps.join(' ')}`, projectDir);
  await run(`npm install ${deps.join(' ')}`, projectDir);
  if (devDeps.length > 0)
    await run(`npm install -D ${devDeps.join(' ')}`, projectDir);
}

function run(cmd: string, cwd: string) {
  return new Promise<void>((resolve, reject) => {
    exec(cmd, { cwd }, (err, stdout, stderr) => {
      if (err) {
        console.error(chalk.red('Error installing dependencies'));
        reject(err);
      } else resolve();
    });
  });
}
