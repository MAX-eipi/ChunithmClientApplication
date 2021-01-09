import { LINECommand } from "./@LINECommand";
import { ReportModule } from "../Modules/Report/ReportModule";

export class FormUrlGetCommand extends LINECommand {
    public called(command: string): boolean {
        return command == 'report-form-url';
    }

    public invoke(command: string, event: any, postData: any): void {
        let url = this.module.getModule(ReportModule).reportGoogleForm.getPublishedUrl();
        this.replyMessage(event.replyToken, [`[検証報告フォーム]\n${url}`]);
    }
}
