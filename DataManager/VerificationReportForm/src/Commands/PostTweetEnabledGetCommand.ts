import { ICommand } from "./ICommand";
import { Operator } from "../Operators/Operator";
import { LineConnectorOperator } from "../Operators/LineConnectorOperator";
import { TwitterConnectorOperator } from "../Operators/TwitterConnectorOperator";

export class PostTweetEnabledGetCommand implements ICommand {
    public called(command: string): boolean {
        return command == "post-tweet-enabled";
    }

    public invoke(command: string, event: any, postData: any): void {
        if (!Operator.isDevelop()) {
            LineConnectorOperator.replyMessage(event.replyToken, ['このコマンドは開発環境でのみ使用可能です']);
            return;
        }

        LineConnectorOperator.replyMessage(event.replyToken, [`Twitter通知設定:${TwitterConnectorOperator.getPostTweetEnabled() ? "true" : "false"}`]);
    }
}