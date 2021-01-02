import { LogLevel } from "../../CustomLogger/CustomLogger";
import { CustomLogManager } from "../../CustomLogger/CustomLogManager";
import { TwitterConnector } from "../../Twitter/TwitterConnector";
import { Environment } from "../Environment";
import { ReportFormModule } from "./@ReportFormModule";

export class TwitterModule extends ReportFormModule {
    public static readonly moduleName = 'twitter';

    private _connector: TwitterConnector;
    public get connector(): TwitterConnector {
        if (!this._connector) {
            let apiToken = this.config.twitter.apiToken;
            let secretKey = this.config.twitter.secretKey;
            if (!apiToken || !secretKey) {
                const message = `[TwitterModule]Instantiation failed. ${JSON.stringify({
                    apiToken: apiToken,
                    secretKey: secretKey,
                })}`;
                CustomLogManager.log(LogLevel.Error, message);
                return null;
            }
            this._connector = new TwitterConnector(apiToken, secretKey);
        }
        return this._connector;
    }

    public postTweet(message: string): any {
        if (!this.config.twitter.postTweetEnabled || !this.connector) {
            return null;
        }
        if (this.module.config.common.environment == Environment.Develop) {
            message = "FROM DEV\n" + message;
        }
        return this.connector.postTweet(message);
    }
}
