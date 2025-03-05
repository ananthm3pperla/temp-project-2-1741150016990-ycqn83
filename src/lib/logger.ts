import { LogLevel } from '../types';

class Logger {
  private static instance: Logger;
  private logLevel: LogLevel = 'info';

  private constructor() {}

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  setLogLevel(level: LogLevel) {
    this.logLevel = level;
  }

  private shouldLog(level: LogLevel): boolean {
    const levels: LogLevel[] = ['error', 'warn', 'info', 'debug'];
    return levels.indexOf(level) <= levels.indexOf(this.logLevel);
  }

  private formatMessage(level: LogLevel, message: string, data?: any): string {
    const timestamp = new Date().toISOString();
    const dataString = data ? `\nData: ${JSON.stringify(data, null, 2)}` : '';
    return `[${timestamp}] [${level.toUpperCase()}] ${message}${dataString}`;
  }

  error(message: string, error?: any) {
    if (this.shouldLog('error')) {
      console.error(this.formatMessage('error', message, error));
    }
  }

  warn(message: string, data?: any) {
    if (this.shouldLog('warn')) {
      console.warn(this.formatMessage('warn', message, data));
    }
  }

  info(message: string, data?: any) {
    if (this.shouldLog('info')) {
      console.info(this.formatMessage('info', message, data));
    }
  }

  debug(message: string, data?: any) {
    if (this.shouldLog('debug')) {
      console.debug(this.formatMessage('debug', message, data));
    }
  }
}

export const logger = Logger.getInstance();