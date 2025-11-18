import { promptProjectInfo } from '../utils/prompts.js';
import { copyTemplate } from '../utils/copyTemplate.js';
import { installDependencies } from '../utils/install.js';
import chalk from 'chalk';
import ora from 'ora';
import path from 'path';

export async function createApp(initialName?: string) {
  console.log(chalk.cyan('\n🚀 Fastay — Create a modern backend project\n'));

  const answers = await promptProjectInfo(initialName);

  const { name, orm, database, typescript } = answers;

  const spinner = ora('Creating project...').start();

  const template = resolveTemplate(typescript);

  const dest = path.join(process.cwd(), name);

  await copyTemplate(template, dest);

  spinner.text = 'Installing dependencies...';
  await installDependencies(dest, orm, database, typescript, name);

  spinner.succeed('Project created successfully!');

  console.log(
    chalk.green(`
✔ Your Fastay app is ready!

Next steps:
   cd ${name}
   npm run dev
`)
  );
}

function resolveTemplate(lang: boolean) {
  if (lang === true) {
    return 'typescript';
  } else if (lang === false) {
    return 'javascript';
  }

  return 'no-orm';
}
