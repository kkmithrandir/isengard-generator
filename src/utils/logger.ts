import chalk from 'chalk';

export enum LogLevel {
  DEBUG,
  INFO,
  WARN,
  ERROR
}

export class Logger {
  private static level: LogLevel = LogLevel.INFO;

  static setLevel(level: LogLevel): void {
    this.level = level;
  }

  static debug(message: string, ...args: unknown[]): void {
    if (this.level <= LogLevel.DEBUG) {
      console.debug(chalk.gray(`🔍 ${message}`), ...args);
    }
  }

  static info(message: string, ...args: unknown[]): void {
    if (this.level <= LogLevel.INFO) {
      console.info(chalk.blue(`ℹ️  ${message}`), ...args);
    }
  }

  static success(message: string, ...args: unknown[]): void {
    if (this.level <= LogLevel.INFO) {
      console.info(chalk.green(`✅ ${message}`), ...args);
    }
  }

  static warn(message: string, ...args: unknown[]): void {
    if (this.level <= LogLevel.WARN) {
      console.warn(chalk.yellow(`⚠️  ${message}`), ...args);
    }
  }

  static error(message: string, ...args: unknown[]): void {
    if (this.level <= LogLevel.ERROR) {
      console.error(chalk.red(`❌ ${message}`), ...args);
    }
  }

  static pattern(pattern: string, replacement: string): void {
    if (this.level <= LogLevel.INFO) {
      console.info(
        chalk.magenta('🔄 Pattern match:'),
        chalk.cyan(pattern),
        '→',
        chalk.green(replacement)
      );
    }
  }

  static file(filename: string): void {
    if (this.level <= LogLevel.INFO) {
      console.info(chalk.green(`📄 Generated: ${filename}`));
    }
  }

  static feature(name: string): void {
    if (this.level <= LogLevel.INFO) {
      console.info(chalk.blue(`\n🎯 Processing feature: ${name}`));
    }
  }
}