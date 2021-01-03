import { LINECommand } from "./@LINECommand";

export class ReportPostNoticeEnabledGetCommand extends LINECommand {
    public called(command: string): boolean {
        return command == "report-post-notice-enabled";
    }

    public invoke(command: string, event: any, postData: any): void {
        let enabledText = this.module.runtimeConfiguration.properties.lineNoticeUnitReportEnabled ? "ON" : "OFF";
        this.replyMessage(event.replyToken, [`検証報告通知設定:${enabledText}`]);
    }
}
