import { Environment } from "../Environment";
import { LINECommand } from "./@LINECommand";

export class PostTweetEnabledSetCommand extends LINECommand {
    public called(command: string): boolean {
        return command.indexOf("post-tweet-enabled=") == 0;
    }

    public invoke(command: string, event: any, postData: any): void {
        if (this.module.config.common.environment != Environment.Develop) {
            this.replyMessage(event.replyToken, ['このコマンドは開発環境でのみ使用可能です']);
            return;
        }

        let value = command.replace("post-tweet-enabled=", "") == "true";
        let result = value ? "ON" : "OFF";
        this.module.config.twitter.postTweetEnabled = value;
        this.replyMessage(event.replyToken, [`Twitterへの通知を${result}にしました`]);
    }
}