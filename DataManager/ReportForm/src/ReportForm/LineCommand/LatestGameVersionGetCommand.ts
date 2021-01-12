import { LINECommand } from "./@LINECommand";
import { VersionModule } from "../Modules/VersionModule";

export class LatestGameVersionGetCommand extends LINECommand {
    public called(command: string): boolean {
        return command === "latest-game-version";
    }

    public invoke(command: string, event: any, postData: any): void {
        const versionConfig = this.module.getModule(VersionModule).getLatestVersionConfig();
        const message = `最新ゲームバージョン:${versionConfig.displayVersionName}`;
        this.replyMessage(event.replyToken, [message]);
    }
}
