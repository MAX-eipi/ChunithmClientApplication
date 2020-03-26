import { LINEConnector } from "../../LINE/LINEConnector";
import { Logger } from "./Logger";

export class LINELogger implements Logger {
    private _log: LINEConnector;
    private _warning: LINEConnector;
    private _error: LINEConnector;

    public constructor(log: LINEConnector, warning: LINEConnector, error: LINEConnector) {
        this._log = log;
        this._warning = warning;
        this._error = error;
    }

    public log(message: string): void {
        if (this._log) {
            this._log.pushTextMessage([message]);
        }
    }
    public logWarning(message: string): void {
        if (this._warning) {
            this._warning.pushTextMessage([message]);
        }
    }
    public logError(message: string): void {
        if (this._error) {
            this._error.pushTextMessage([message]);
        }
    }

}