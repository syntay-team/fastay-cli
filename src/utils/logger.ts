// src/utils/logger.ts
import chalk from 'chalk';

export class Logger {
  static info(message: string, ...args: any[]) {
    console.log(chalk.blue('  ○ ') + chalk.white(message), ...args);
  }

  static success(message: string, ...args: any[]) {
    console.log(chalk.green('  ✓ ') + chalk.white(message), ...args);
  }

  static warning(message: string, ...args: any[]) {
    console.log(chalk.yellow('  ⚠ ') + chalk.white(message), ...args);
  }

  static error(message: string, ...args: any[]) {
    console.log(chalk.red('  ✗ ') + chalk.white(message), ...args);
  }

  static debug(message: string, ...args: any[]) {
    if (process.env.DEBUG) {
      console.log(chalk.magenta('  🔧 ') + chalk.white(message), ...args);
    }
  }

  static start(message: string, ...args: any[]) {
    console.log(chalk.cyan('  ⥨ ') + chalk.white(message), ...args);
  }

  static route(method: string, path: string) {
    const methodColor =
      {
        GET: chalk.green,
        POST: chalk.blue,
        PUT: chalk.yellow,
        PATCH: chalk.magenta,
        DELETE: chalk.red,
        OPTIONS: chalk.cyan,
        HEAD: chalk.gray,
      }[method] || chalk.white;

    console.log(
      '  ' +
        chalk.green('  ✓ ') +
        ' Route: ' +
        methodColor(`[${method}]`) +
        ' ' +
        chalk.cyan(path)
    );
  }

  static buildStep(message: string) {
    console.log(chalk.blue('  ○ ') + chalk.white(message));
  }
}
