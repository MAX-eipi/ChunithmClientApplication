import { LINECommand } from "./@LINECommand";

export class TopUrlGetCommand extends LINECommand {
    public called(command: string): boolean {
        return command == "top-url";
    }

    public invoke(command: string, event: any, postData: any): void {
        throw new Error("Not implemented");
        //this.replyMessage(event.replyToken, [`[検証報告管理ツール]\n${this.module.getModule(RoutingModule).getPage(TopPage).getPageUrl()}`]);
    }
}
