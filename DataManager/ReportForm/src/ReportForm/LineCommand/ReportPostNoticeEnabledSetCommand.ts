import { LINECommand } from "./@LINECommand";

export class ReportPostNoticeEnabledSetCommand extends LINECommand {
    public called(command: string): boolean {
        return command.indexOf("report-post-notice-enabled=") == 0;
    }

    public invoke(command: string, event: any, postData: any): void {
        let value = command.replace("report-post-notice-enabled=", "") == "true";
        let result = value ? "ON" : "OFF";
        this.module.config.line.reportPostNoticeEnabled = value;
        this.replyMessage(event.replyToken, [`検証報告通知を${result}にしました`]);
    }
}