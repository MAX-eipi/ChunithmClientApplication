import { Logger } from './Logger/Logger';
import { DefaultLogger } from './Logger/DefaultLogger';

export class Debug {
    private static _defaultLogger: Logger;
    private static _logger: Logger;

    public static get logger(): Logger {
        if (this._logger !== null) {
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

