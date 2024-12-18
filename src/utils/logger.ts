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
      console.debug(message, ...args);
    }
  }

  static info(message: string, ...args: unknown[]): void {
    if (this.level <= LogLevel.INFO) {
      console.info(message, ...args);
    }
  }

  static warn(message: string, ...args: unknown[]): void {
    if (this.level <= LogLevel.WARN) {
      console.warn(message, ...args);
    }
  }

  static error(message: string, ...args: unknown[]): void {
    if (this.level <= LogLevel.ERROR) {
      console.error(message, ...args);
    }
  }
} 