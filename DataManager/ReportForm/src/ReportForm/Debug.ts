import { CustomLogger, LogLevel } from '../CustomLogger/CustomLogger';
import { CustomLogManager } from '../CustomLogger/CustomLogManager';

export class Debug {
    public static addLogger(logger: CustomLogger): void {
        CustomLogManager.addLogger(logger);
    }

    public static log(message): void {
        CustomLogManager.log(LogLevel.Info, message);
    }

    public static logWarning(message): void {
        CustomLogManager.log(LogLevel.Warning, message);
    }

    public static logError(message): void {
        CustomLogManager.log(LogLevel.Error, message);
    }

    public static logException(error: Error): void {
        CustomLogManager.exception(error);
    }
}

