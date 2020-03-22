import { Debug } from "../Debug";
import { notifyUnverified } from "../operations";
import { LINECommand } from "./@LINECommand";

export class TestCommand extends LINECommand {
    public called(command: string): boolean {
        return command.indexOf("test-") == 0;
    }

    public invoke(command: string, event: any, postData: any): void {
        let subCommand = command.replace("test-", "");
        switch (subCommand) {
            case "reply":
                this.replyMessage(event.replyToken, ['テスト:リプライ']);
                break;
            case "notice":
                this.pushMessage(['テスト:通知']);
                break;
            case "error-notice":
                Debug.logError('テスト:エラー通知');
                break;
            case "operation-notifyUnverified":
                notifyUnverified();
                this.pushMessage(['完了']);
                break;
            case "bulkApprove":
                this.module.approval.bulkApprove(
                    this.module.config.common.defaultVersionName,
                    [1, 2, 3, 4, 5, 6,]);
                break;
            default:
                this.replyMessage(event.replyToken, [`未知のコマンドです\n${command}`]);
                break;
        }
    }
}