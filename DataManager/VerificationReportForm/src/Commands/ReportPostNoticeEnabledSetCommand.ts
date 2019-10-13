import { ICommand } from "./ICommand";
import { LineConnectorOperator } from "../Operators/LineConnectorOperator";

export class ReportPostNoticeEnabledSetCommand implements ICommand {
    public called(command: string): boolean {
        return command.indexOf("report-post-notice-enabled=") == 0;
    }

    public invoke(command: string, event: any, postData: any): void {
        let value = command.replace("report-post-notice-enabled=", "") == "true";
        let result = value ? "有効" : "無効";
        LineConnectorOperator.setReportPostNoticeEnabled(value);
        LineConnectorOperator.replyMessage(event.replyToken, [`検証報告通知を${result}にしました`]);
    }
}