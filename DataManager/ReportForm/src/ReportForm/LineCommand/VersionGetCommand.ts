import { getAppVersion } from "../../@app";
import { LINECommand } from "./@LINECommand";

export class VersionGetCommand extends LINECommand {
    public called(command: string): boolean {
        return command == "version";
    }

    public invoke(command: string, event: any, postData: any): void {
        this.replyMessage(event.replyToken, [getAppVersion()]);
    }
}