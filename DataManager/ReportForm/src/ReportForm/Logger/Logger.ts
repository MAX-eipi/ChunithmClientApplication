export interface Logger {
    log(message: string): void;
    logWarning(message: string): void;
    logError(message: string): void;
}