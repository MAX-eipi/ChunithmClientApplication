import { notifyUnverified } from "../operations";
import { LineConnectorOperator } from "../Operators/LineConnectorOperator";
import { ILineCommand } from "./ILineCommand";

export class TestCommand implements ILineCommand {
    public called(command: string): boolean {
        return command.indexOf("test-") == 0;
    }

    public invoke(command: string, event: any, postData: any): void {
        let subCommand = command.replace("test-", "");
        switch (subCommand) {
            case "reply":
                LineConnectorOperator.replyMessage(event.replyToken, ['テスト:リプライ']);
                break;
            case "notice":
                LineConnectorOperator.pushMessage(['テスト:通知']);
                break;
            case "error-notice":
                LineConnectorOperator.pushErrorMessage(['テスト:エラー通知']);
                break;
            case "operation-notifyUnverified":
                notifyUnverified();
                LineConnectorOperator.pushMessage(['完了']);
                break;
            default:
                LineConnectorOperator.replyMessage(event.replyToken, [`未知のコマンドです\n${command}`]);
                break;
        }
    }
}