import { LINECommand } from "./@LINECommand";

export class LatestGameVersionGetCommand extends LINECommand {
    public called(command: string): boolean {
        return command == "latest-game-version";
    }

    public invoke(command: string, event: any, postData: any): void {
        let versionConfig = this.module.version.getLatestVersionConfig();
        let message = `最新ゲームバージョン:${versionConfig.displayVersionName}
内部コード:${versionConfig.versionName}`;
        this.replyMessage(event.replyToken, [message]);
    }
}