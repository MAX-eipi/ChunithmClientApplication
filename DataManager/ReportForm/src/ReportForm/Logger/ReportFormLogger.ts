import { Logger } from "./Logger";

export class ReportFormLogger implements Logger {
    private loggerCollection: Logger[] = [];

    public addLogger(logger: Logger): void {
        if (this.loggerCollection.indexOf(logger) === -1) {
            this.loggerCollection.push(logger);
        }
    }
    public removeLogger(logger: Logger): void {
        this.loggerCollection = this.loggerCollection.filter(x => x != logger);
    }

    log(message): void {
        this.loggerCollection.forEach(logger => logger.log(message));
    }
    logWarning(message): void {
        this.loggerCollection.forEach(logger => logger.logWarning(message));
    }
    logError(message): void {
        this.loggerCollection.forEach(logger => logger.logError(message));
    }
}
