import { Environment } from "../Environment";
import { LINECommand } from "./@LINECommand";

export class PostTweetEnabledGetCommand extends LINECommand {
    public called(command: string): boolean {
        return command == "post-tweet-enabled";
    }

    public invoke(command: string, event: any, postData: any): void {
        if (this.module.config.common.environment != Environment.Develop) {
            this.replyMessage(event.replyToken, ['このコマンドは開発環境でのみ使用可能です']);
            return;
        }

        let enabledText = this.module.config.twitter.postTweetEnabled ? "ON" : "OFF";
        this.replyMessage(event.replyToken, [`Twitter通知設定:${enabledText}`]);
    }
}