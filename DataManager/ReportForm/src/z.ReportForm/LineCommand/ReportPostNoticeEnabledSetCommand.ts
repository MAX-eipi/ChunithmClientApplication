import { LINECommand } from "./@LINECommand";

export class ReportPostNoticeEnabledSetCommand extends LINECommand {
    public called(command: string): boolean {
        return command.indexOf("report-post-notice-enabled=") === 0;
    }

    public invoke(command: string, event: any, postData: any): void {
        const value = command.replace("report-post-notice-enabled=", "") === "true";
        const result = value ? "ON" : "OFF";
        this.module.configuration.runtime.lineNoticeUnitReportEnabled = value;
        this.module.configuration.applyRuntimeConfiguration();
        this.replyMessage(event.replyToken, [`検証報告通知を${result}にしました`]);
    }
}
