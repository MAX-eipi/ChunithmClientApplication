import { LINECommand } from "./@LINECommand";
import { VersionModule } from "../Modules/VersionModule";

export class DefaultGameVersionGetCommand extends LINECommand {
    public called(command: string): boolean {
        return command === "default-game-version";
    }

    public invoke(command: string, event: any, postData: any): void {
        const versionConfig = this.module.getModule(VersionModule).getDefaultVersionConfig();
        const message = `デフォルトゲームバージョン:${versionConfig.displayVersionName}`;
        this.replyMessage(event.replyToken, [message]);
    }
}
