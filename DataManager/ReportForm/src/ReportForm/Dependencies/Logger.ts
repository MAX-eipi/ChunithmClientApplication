import { SlackLogger } from "../../CustomLogger.Slack/SlackLogger";
import { ConsoleLogger } from "../../CustomLogger/ConsoleLogger";
import { LogLevel } from "../../CustomLogger/CustomLogger";
import { CustomLogManager } from "../../CustomLogger/CustomLogManager";
import { ReportFormModule } from "../Modules/@ReportFormModule";

export class LoggerDI {
    public static initialize(module: ReportFormModule): void {
        {
            const logger = new ConsoleLogger();
            CustomLogManager.addLogger(logger);
        }
        {
            const logger = new SlackLogger();
            logger.slackApiToken = module.config.global.slackApiToken;
            logger.channelIdTable[LogLevel.Warning] = [module.config.global.slackChannelIdTable['alert']];
            logger.channelIdTable[LogLevel.Error] = [module.config.global.slackChannelIdTable['alert']];
            CustomLogManager.addLogger(logger);
        }
    }
}
