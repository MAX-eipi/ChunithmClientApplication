import { ILineCommand } from "./ILineCommand";
import { LineConnectorOperator } from "../Operators/LineConnectorOperator";

export class ReportPostNoticeEnabledGetCommand implements ILineCommand {
    public called(command: string): boolean {
        return command == "report-post-notice-enabled";
    }

    public invoke(command: string, event: any, postData: any): void {
        LineConnectorOperator.replyMessage(event.replyToken, [`検証報告通知設定:${LineConnectorOperator.getReportPostNoticeEnabled() ? "true" : "false"}`]);
    }
}