import { LINECommand } from "./@LINECommand";
import { ReportModule } from "../Modules/Report/ReportModule";

export class ReportFormBuildCommand extends LINECommand {
    public called(command: string): boolean {
        return command.indexOf('build-report-form<<') == 0;
    }

    public invoke(command: string, event: any, postData: any): void {
        let versionName = command.replace('build-report-form<<', '');
        if (!versionName) {
            versionName = this.module.configuration.common.defaultVersionName;
        }
        this.replyMessage(event.replyToken, [`報告フォームを構築します:${versionName}`]);
        this.module.getModule(ReportModule).buildForm(versionName);

        let url = this.module.getModule(ReportModule).reportGoogleForm.getPublishedUrl();
        this.pushMessage([`報告フォームの構築が完了しました
URL: ${url}`])
    }
}
