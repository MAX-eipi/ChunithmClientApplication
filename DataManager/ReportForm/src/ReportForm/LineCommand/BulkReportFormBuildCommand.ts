import { LINECommand } from "./@LINECommand";
import { ReportModule } from "../Modules/Report/ReportModule";

export class BulkReportFormBuildCommand extends LINECommand {
    public called(command: string): boolean {
        return command.indexOf('build-bulk-report-form<<') == 0;
    }

    public invoke(command: string, event: any, postData: any): void {
        let versionName = command.replace('build-bulk-report-form<<', '');
        if (!versionName) {
            versionName = this.module.config.common.defaultVersionName;
        }
        this.replyMessage(event.replyToken, [`一括報告フォームを構築します:${versionName}`]);
        this.module.getModule(ReportModule).buildBulkReportForm(versionName);

        let url = this.module.getModule(ReportModule).levelBulkReportGoogleForm.getPublishedUrl();
        this.pushMessage([`一括報告フォームの構築が完了しました
URL: ${url}`]);
    }

}
