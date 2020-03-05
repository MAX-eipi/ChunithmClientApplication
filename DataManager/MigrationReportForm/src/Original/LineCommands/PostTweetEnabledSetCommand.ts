import { ILineCommand } from "./ILineCommand";
import { Operator } from "../Operators/Operator";
import { LineConnectorOperator } from "../Operators/LineConnectorOperator";
import { TwitterConnectorOperator } from "../Operators/TwitterConnectorOperator";

export class PostTweetEnabledSetCommand implements ILineCommand {
    public called(command: string): boolean {
        return command.indexOf("post-tweet-enabled=") == 0;
    }

    public invoke(command: string, event: any, postData: any): void {
        if (!Operator.isDevelop()) {
            LineConnectorOperator.replyMessage(event.replyToken, ['このコマンドは開発環境でのみ使用可能です']);
            return;
        }

        let value = command.replace("post-tweet-enabled=", "") == "true";
        let result = value ? "有効" : "無効";
        TwitterConnectorOperator.setPostTweetEnabled(value);
        LineConnectorOperator.replyMessage(event.replyToken, [`Twitterへの通知を${result}にしました`]);
    }
}