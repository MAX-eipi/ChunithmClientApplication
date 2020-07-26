import { Logger } from './Logger/Logger';
import { DefaultLogger } from './Logger/DefaultLogger';

export class Debug {
    private static _defaultLogger: Logger;
    private static _logger: Logger;

    public static get logger(): Logger {
        if (this._logger) {
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

    public static log(message): void {
        this.logger.log(message);
    }

    public static logWarning(message): void {
        this.logger.logWarning(message);
    }

    public static logError(message): void {
        this.logger.logError(message);
    }

    public static logException(error: Error): void {
        this.logger.logError(this.toExceptionMessage(error));
    }

    private static toExceptionMessage(error: Error): string {
        return `[Message]
${error.message}

[Stack Trace]
${error.stack}`;
    }
}

