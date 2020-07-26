import * as DebugLog from './Logger';
export class DefaultLogger implements DebugLog.Logger {
    log(message: string): void {
        Logger.log(message);
    }
    logWarning(message: string): void {
        Logger.log(message);
    }
    logError(message: string): void {
        Logger.log(message);
    }
}
