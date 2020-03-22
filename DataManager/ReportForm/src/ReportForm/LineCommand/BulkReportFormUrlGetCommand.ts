import { LINECommand } from "./@LINECommand";

export class BulkReportFormUrlGetCommand extends LINECommand {
    public called(command: string): boolean {
        return command == 'bulk-report-form-url';
    }
    public invoke(command: string, event: any, postData: any): void {
        let url = this.module.report.bulkReportGoogleForm.getPublishedUrl();
        this.replyMessage(event.replyToken, [`[一括検証報告フォーム]\n${url}`]);
    }
}