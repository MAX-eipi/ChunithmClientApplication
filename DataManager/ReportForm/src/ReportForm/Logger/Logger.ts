export interface Logger {
    log(message: object): void;
    logWarning(message: object): void;
    logError(message: object): void;
}
