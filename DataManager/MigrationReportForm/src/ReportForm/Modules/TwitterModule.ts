import { TwitterConnector } from "../../Twitter/TwitterConnector";
import { Debug } from "../Debug";
import { Environment } from "../Environment";
import { ReportFormModule } from "./@ReportFormModule";

export class TwitterModule extends ReportFormModule {
    private _connector: TwitterConnector;
    public get connector(): TwitterConnector {
        if (!this._connector) {
            let apiToken = this.config.twitter.apiToken;
            let secretKey = this.config.twitter.secretKey;
            if (!apiToken || !secretKey) {
                Debug.logError(`[TwitterModule]Instantiation failed. ${JSON.stringify({
                    apiToken: apiToken,
                    secretKey: secretKey,
                })}`);
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