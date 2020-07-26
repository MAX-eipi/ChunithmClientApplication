import { Debug } from "../Debug";
import { ReportFormModule } from "../Modules/@ReportFormModule";
import { LogSheet, SpreadsheetLogger } from "../Logger/SpreadSheetLogger";
import { ReportFormLogger } from "../Logger/ReportFormLogger";
import { LINELogger } from "../Logger/LINELogger";

export class LoggerDI {
    public static initialize(module: ReportFormModule): void {
        let logger = new ReportFormLogger();
        {
            let log = LogSheet.openLogSheet(
                module.config.log.logSpreadSheetId,
                module.config.log.logWorkSheetName);
            let error = LogSheet.openLogSheet(
                module.config.log.errorLogSpreadSheetId,
                module.config.log.errorLogWorkSheetName);
            logger.addLogger(new SpreadsheetLogger(log, error, error));
        }
        {
            let error = module.line.errorNotice;
            logger.addLogger(new LINELogger(null, error, error));
        }
        Debug.logger = logger;
    }
}