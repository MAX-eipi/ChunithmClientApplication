import { ReportFormModule } from "../Modules/@ReportFormModule";
import { LINEModule } from "../Modules/LINEModule";

export abstract class LINECommand {
    private _module: ReportFormModule;
    protected get module(): ReportFormModule {
        return this._module;
    }

    public constructor(module: ReportFormModule) {
        this._module = module;
    }

    public abstract called(command: string): boolean;
    public abstract invoke(command: string, event: any, postData: any): void;

    protected pushMessage(messages: string[]): void {
        this.module.getModule(LINEModule).noticeConnector.pushTextMessage(messages);
    }

    protected replyMessage(replyToken: string, messages: string[]): void {
        this.module.getModule(LINEModule).noticeConnector.replyTextMessage(replyToken, messages);
    }
}
