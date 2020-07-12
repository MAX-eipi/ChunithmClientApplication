import { LINECommand } from "./@LINECommand";

export class FormUrlGetCommand extends LINECommand {
    public called(command: string): boolean {
        return command == 'report-form-url';
    }

    public invoke(command: string, event: any, postData: any): void {
        let url = this.module.report.reportGoogleForm.getPublishedUrl();
        this.replyMessage(event.replyToken, [`[検証報告フォーム]\n${url}`]);
    }
}