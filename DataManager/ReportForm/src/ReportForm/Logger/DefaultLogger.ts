import * as DebugLog from './Logger';
export class DefaultLogger implements DebugLog.Logger {
    log(message: object): void {
        Logger.log(message);
    }
    logWarning(message: object): void {
        Logger.log(message);
    }
    logError(message: object): void {
        Logger.log(message);
    }
}
