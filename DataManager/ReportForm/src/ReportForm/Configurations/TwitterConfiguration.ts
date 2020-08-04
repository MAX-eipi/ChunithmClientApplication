import { ConfigurationScriptProperty } from "../../Configurations/ConfigurationDefinition";
import { ReportFormConfiguration } from "./@ReportFormConfiguration";

export class TwitterConfiguration extends ReportFormConfiguration {
    public get apiToken(): string { return this.global.twitterApiToken; }
    public get secretKey(): string { return this.global.twitterSecretKey; }

    public get postTweetEnabled(): boolean {
        return this.getScriptProperty(ConfigurationScriptProperty.POST_TWEET_ENABLED) === '1';
    }
    public set postTweetEnabled(value: boolean) {
        this.setScriptProperty(ConfigurationScriptProperty.POST_TWEET_ENABLED, value ? '1' : '0');
    }
}
