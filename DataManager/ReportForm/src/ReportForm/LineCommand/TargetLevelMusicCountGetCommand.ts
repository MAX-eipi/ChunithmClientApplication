import { LINECommand } from "./@LINECommand";
import { MusicDataModule } from "../Modules/MusicDataModule";

export class TargetLevelMusicCountGetCommand extends LINECommand {
    public called(command: string): boolean {
        return command.indexOf('get-target-level-music-count<<') == 0;
    }
    public invoke(command: string, event: any, postData: any): void {
        let targetLevel = parseInt(command.replace('get-target-level-music-count<<', ''));
        if (targetLevel > 6) {
            this.replyMessage(event.replyToken, ['このコマンドはLv.6以下のみ対応しています']);
            return;
        }
        let versionName = this.module.configuration.common.defaultVersionName;
        let table = this.module.getModule(MusicDataModule).getTable(versionName);
        let musicCount = table.getTargetLevelMusicCount(targetLevel);
        this.replyMessage(event.replyToken, [`対象レベル:${targetLevel}
楽曲数:${musicCount}`]);
    }

}
