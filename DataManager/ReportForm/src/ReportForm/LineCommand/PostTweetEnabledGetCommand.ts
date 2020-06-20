import { LINECommand } from "./@LINECommand";

export class PostTweetEnabledGetCommand extends LINECommand {
    public called(command: string): boolean {
        return command === "post-tweet-enabled";
    }

    public invoke(command: string, event: any, postData: any): void {
        const enabledText = this.module.config.twitter.postTweetEnabled ? "ON" : "OFF";
        this.replyMessage(event.replyToken, [`Twitter通知設定:${enabledText}`]);
    }
}