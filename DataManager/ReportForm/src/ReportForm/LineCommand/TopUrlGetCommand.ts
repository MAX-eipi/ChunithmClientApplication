import { TopPage } from "../Page/TopPage";
import { LINECommand } from "./@LINECommand";
import { Router } from "../Modules/Router";

export class TopUrlGetCommand extends LINECommand {
    public called(command: string): boolean {
        return command == "top-url";
    }

    public invoke(command: string, event: any, postData: any): void {
        this.replyMessage(event.replyToken, [`[検証報告管理ツール]\n${this.module.getModule(Router).getPage(TopPage).getPageUrl()}`]);
    }
}
