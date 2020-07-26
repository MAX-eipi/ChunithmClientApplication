import * as DebugLog from './Logger';
export class DefaultLogger implements DebugLog.Logger {
    log(message): void {
        Logger.log(message);
    }
    logWarning(message): void {
        Logger.log(message);
    }
    logError(message): void {
        Logger.log(message);
    }
}
