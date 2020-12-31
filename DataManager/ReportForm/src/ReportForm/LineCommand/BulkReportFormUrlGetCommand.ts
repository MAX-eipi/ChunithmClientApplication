import { LINECommand } from "./@LINECommand";
import { ReportModule } from "../Modules/Report/ReportModule";

export class BulkReportFormUrlGetCommand extends LINECommand {
    public called(command: string): boolean {
        return command == 'bulk-report-form-url';
    }
    public invoke(command: string, event: any, postData: any): void {
        let url = this.module.getModule(ReportModule).levelBulkReportGoogleForm.getPublishedUrl();
        this.replyMessage(event.replyToken, [`[一括検証報告フォーム]\n${url}`]);
    }
}
