import { ReportFormConfiguration } from "./@ReportFormConfiguration";
import { ConfigurationScriptProperty, ConfigurationPropertyName } from "../../Configurations/ConfigurationDefinition";

export class TwitterConfiguration extends ReportFormConfiguration {
    public get apiToken(): string { return this.getProperty(ConfigurationPropertyName.TWITTER_API_TOKEN, ''); }
    public get secretKey(): string { return this.getProperty(ConfigurationPropertyName.TWITTER_API_SECRET_KEY, ''); }

    public get postTweetEnabled(): boolean {
        return this.getScriptProperty(ConfigurationScriptProperty.POST_TWEET_ENABLED) == '1';
    }
    public set postTweetEnabled(value: boolean) {
        this.setScriptProperty(ConfigurationScriptProperty.POST_TWEET_ENABLED, value ? '1' : '0');
    }
}