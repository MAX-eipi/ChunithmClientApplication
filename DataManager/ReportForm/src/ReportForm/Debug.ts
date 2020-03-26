import { Logger } from './Logger/Logger';

export class Debug {
    private static _defaultLogger: Logger;
    private static _logger: Logger;

    public static get logger(): Logger {
        if (this._logger != null) {
            return this._logger;
        }

        if (!this._defaultLogger) {
            this._defaultLogger = new DefaultLogger();
        }
        return this._defaultLogger;
    }
    public static set logger(value: Logger) {
        this._logger = value;
    }

    public static log(message: string): void {
        Debug.logger.log(message);
    }

    public static logWarning(message: string): void {
        Debug.logger.logWarning(message);
    }

    public static logError(message: string): void {
        Debug.logger.logError(message);
    }
}

class DefaultLogger implements Logger {
    log(message: string): void {
        console.log(message);
    }
    logWarning(message: string): void {
        console.warn(message);
    }
    logError(message: string): void {
        console.error(message);
    }
}