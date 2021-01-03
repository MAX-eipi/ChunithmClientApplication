import { SlackLogger } from "../../CustomLogger.Slack/SlackLogger";
import { ConsoleLogger } from "../../CustomLogger/ConsoleLogger";
import { LogLevel } from "../../CustomLogger/CustomLogger";
import { CustomLogManager } from "../../CustomLogger/CustomLogManager";
import { ReportFormConfiguration } from "../Configurations/@ReportFormConfiguration";

export class LoggerDI {
    public static initialize(config: ReportFormConfiguration): void {
        {
            const logger = new ConsoleLogger();
            CustomLogManager.addLogger(logger);
        }
        {
            const logger = new SlackLogger();
            logger.slackApiToken = config.global.slackApiToken;
            logger.channelIdTable[LogLevel.Warning] = [config.global.slackChannelIdTable['alert']];
            logger.channelIdTable[LogLevel.Error] = [config.global.slackChannelIdTable['alert']];
            CustomLogManager.addLogger(logger);
        }
    }
}
