import { LINECommand } from "./@LINECommand";

export class PostTweetEnabledSetCommand extends LINECommand {
    public called(command: string): boolean {
        return command.indexOf("post-tweet-enabled=") === 0;
    }

    public invoke(command: string, event: any, postData: any): void {
        const value = command.replace("post-tweet-enabled=", "") === "true";
        const result = value ? "ON" : "OFF";
        this.module.config.twitter.postTweetEnabled = value;
        this.replyMessage(event.replyToken, [`Twitterへの通知を${result}にしました`]);
    }
}