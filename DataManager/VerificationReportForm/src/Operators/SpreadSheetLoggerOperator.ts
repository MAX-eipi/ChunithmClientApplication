import { SpreadSheetLogger } from "../SpreadSheetLogger";
import { Operator } from "./Operator";

export class SpreadSheetLoggerOperator {
    private static readonly LOG_SHEET_ID = "log_sheet_id";
    private static readonly LOG_SHEET_NAME = "log_sheet_name";
    private static readonly ERROR_LOG_SHEET_ID = "error_log_sheet_id";
    private static readonly ERROR_LOG_SHEET_NAME = "error_log_sheet_name";

    private static instance: SpreadSheetLogger = null;
    private static initialized: boolean = false;

    private static getInstance(): SpreadSheetLogger {
        if (this.instance || this.initialized) {
            return this.instance;
        }

        let config = Operator.getConfiguration();
        let logSheetId = config.getGlobalConfigurationProperty<string>(this.LOG_SHEET_ID, "");
        let logSheetName = config.getGlobalConfigurationProperty<string>(this.LOG_SHEET_NAME, "");
        let errorLogSheetId = config.getGlobalConfigurationProperty<string>(this.ERROR_LOG_SHEET_ID, "");
        let errorLogSheetName = config.getGlobalConfigurationProperty<string>(this.ERROR_LOG_SHEET_NAME, "");
        if (!logSheetId || !logSheetName || !errorLogSheetId || !errorLogSheetName) {
            Logger.log(`[SpreadSheetLogOperator]Instantiation failed. ${JSON.stringify({
                logSheetId: logSheetId,
                logSheetName: logSheetName,
                errorLogSheetId: errorLogSheetId,
                errorLogSheetName: errorLogSheetName,
            })}`);
            this.initialized = true;
            return null;
        }

        this.instance = new SpreadSheetLogger(logSheetId, logSheetName, errorLogSheetId, errorLogSheetName);
        this.initialized = true;
        return this.instance;
    }

    public static log(message: string[]): void {
        let instance = this.getInstance();
        if (!instance) {
            return;
        }
        return instance.log(message);
    }

    public static logError(message: string[]): void {
        let instance = this.getInstance();
        if (!instance) {
            return;
        }
        return instance.logError(message);
    }
}
