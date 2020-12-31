import { Debug } from "../Debug";
import { ReportFormModule } from "../Modules/@ReportFormModule";
import { LogSheet, SpreadsheetLogger } from "../Logger/SpreadSheetLogger";
import { ReportFormLogger } from "../Logger/ReportFormLogger";
import { LINELogger } from "../Logger/LINELogger";
import { LINEModule } from "../Modules/LINEModule";
import { SlackLogger } from "../Logger/SlackLogger";

export class LoggerDI {
    public static initialize(module: ReportFormModule): void {
        const logger = new ReportFormLogger();
        {
            const log = LogSheet.openLogSheet(
                module.config.log.logSpreadSheetId,
                module.config.log.logWorkSheetName);
            const error = LogSheet.openLogSheet(
                module.config.log.errorLogSpreadSheetId,
                module.config.log.errorLogWorkSheetName);
            logger.addLogger(new SpreadsheetLogger(log, error, error));
        }
        {
            const error = module.getModule(LINEModule).errorNotice;
            logger.addLogger(new LINELogger(null, error, error));
        }
        {
            const error = module.config.global.slackChannelIdTable['alert'];
            logger.addLogger(new SlackLogger(
                module.config.global.slackApiToken,
                null,
                error,
                error
            ));
        }
        Debug.logger = logger;
    }
}
