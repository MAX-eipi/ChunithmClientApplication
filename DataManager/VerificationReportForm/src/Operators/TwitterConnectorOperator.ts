import { TwitterConnector } from "../TwitterConnector";
import { Operator } from "./Operator";

export class TwitterConnectorOperator {
    private static readonly API_TOKEN = "twitter_api_key";
    private static readonly SECRET_KEY = "twitter_api_secret_key";
    private static readonly POST_TWEET_ENABLED = "twitter_post_tweet_enabled";

    private static instance: TwitterConnector = null;
    private static initialized: boolean = false;
    
    private static postTweetEnabled: boolean = null;

    private static getInstance(): TwitterConnector {
        if (this.instance || this.initialized) {
            return this.instance;
        }

        let config = Operator.getConfiguration();
        let apiToken = config.getGlobalConfigurationProperty<string>(this.API_TOKEN, "");
        let secretKey = config.getGlobalConfigurationProperty<string>(this.SECRET_KEY, "");
        if (!apiToken || !secretKey) {
            Logger.log(`[TwitterConnectOperator]Instantiation failed. ${JSON.stringify({
                apiToken: apiToken,
                secretKey: secretKey,
            })}`);
            this.initialized = true;
            return null;
        }

        this.instance = new TwitterConnector(apiToken, secretKey);
        this.initialized = true;
        return this.instance;
    }

    public static authorize(): void {
        let instance = this.getInstance();
        if (!instance) {
            return;
        }
        return instance.authorize();
    }

    public static authCallback(request: any): any {
        let instance = this.getInstance();
        if (!instance) {
            return;
        }
        return instance.authCallback(request);
    }

    public static postTweet(message: string): any {
        if (!this.getPostTweetEnabled()) {
            return null;
        }
        let instance = this.getInstance();
        if (!instance) {
            return null;
        }
        if (Operator.isDevelop()) {
            message = "FROM DEVELOP\n" + message;
        }
        return instance.postTweet(message);
    }

    public static setPostTweetEnabled(enabled: boolean): void {
        PropertiesService.getScriptProperties().setProperty(this.POST_TWEET_ENABLED, enabled ? "1" : "0");
        this.postTweetEnabled = enabled;
    }

    public static getPostTweetEnabled(): boolean {
        if (!Operator.isDevelop()) {
            return true;
        }
        if (this.postTweetEnabled === null) {
            this.postTweetEnabled = PropertiesService.getScriptProperties().getProperty(this.POST_TWEET_ENABLED) == "1";
        }
        return this.postTweetEnabled;
    }
}
