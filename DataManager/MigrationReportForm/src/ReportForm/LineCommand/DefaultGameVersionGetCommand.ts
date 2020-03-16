import { LINECommand } from "./@LINECommand";

export class DefaultGameVersionGetCommand extends LINECommand {
    public called(command: string): boolean {
        return command == "default-game-version";
    }

    public invoke(command: string, event: any, postData: any): void {
        let versionConfig = this.module.version.getDefaultVersionConfig();
        let message = `デフォルトゲームバージョン:${versionConfig.displayVersionName}
内部コード:${versionConfig.versionName}`;
        this.replyMessage(event.replyToken, [message]);
    }
}