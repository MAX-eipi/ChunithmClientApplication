import { MusicData, MusicDataParameter } from "../../MusicDataTable/MusicData";
import { PostCommand, PostCommandParameter } from "./@PostCommand";

interface TableUpdateCommandParameter extends PostCommandParameter {
    MusicDatas: MusicDataParameter[];
}

export class TableUpdateCommand extends PostCommand {
    called(api: string): boolean {
        return api == "table/update";
    }

    invoke(api: string, postData: TableUpdateCommandParameter): any {
        let oldMusicDatas = this.module.musicData.getTable(postData.versionName).datas;
        let musicDataTable = this.module.musicData.updateTable(postData.versionName, postData.MusicDatas);
        let response = {
            MusicDataTable: {
                MusicDatas: musicDataTable.getTable(),
            }
        }

        let addedMusicDatas = this.getAddedMusicDatas(oldMusicDatas, musicDataTable.getTable());

        if (addedMusicDatas.length > 0) {
            let musicCounts = this.setMusicList(postData.versionName, musicDataTable.datas);
            if (oldMusicDatas.length > 0) {
                var message = "[新曲追加]";
                for (var i = 0; i < addedMusicDatas.length; i++) {
                    let m = addedMusicDatas[i];
                    let basicLevelText = m.BasicLevel.toString().replace(".7", "+");
                    let advancedLevelText = m.AdvancedLevel.toString().replace(".7", "+");
                    let expertLevelText = m.ExpertLevel.toString().replace(".7", "+");
                    let masterLevelText = m.MasterLevel.toString().replace(".7", "+");
                    message += `
${m.Name} ${basicLevelText}/${advancedLevelText}/${expertLevelText}/${masterLevelText}`;
                }
                this.module.line.notice.pushTextMessage([message]);
                this.module.twitter.postTweet(message);
            }
            else {
                message = '[新規定数表作成]\n';
                for (var genre in musicCounts) {
                    message += `${genre}: ${musicCounts[genre]}\n`;
                }
                this.module.line.notice.pushTextMessage([message]);
                this.module.twitter.postTweet(message);
            }
        }

        return response;
    }

    private getAddedMusicDatas(oldMusicDatas: MusicData[], newMusicDatas: MusicData[]): MusicData[] {
        let oldMusicIds: { [key: string]: boolean } = {};
        for (var i = 0; i < oldMusicDatas.length; i++) {
            oldMusicIds[oldMusicDatas[i].Id.toString()] = true;
        }

        var added: MusicData[] = [];
        for (var i = 0; i < newMusicDatas.length; i++) {
            let musicData = newMusicDatas[i];
            if (!oldMusicIds[musicData.Id.toString()]) {
                added.push(musicData);
            }
        }
        return added;
    }

    private setMusicList(versionName: string, musicDatas: MusicData[]): { [genre: string]: number } {
        var form = this.module.report.googleForm;
        var list = form.getItems(FormApp.ItemType.LIST);

        let genres = this.module.version.getVersionConfig(versionName).genres;
        genres.push("ALL");
        let musicCounts: { [genre: string]: number } = {};
        for (var i = 0; i < genres.length; i++) {
            let genre = genres[i];
            let musicList = list[i + 1].asListItem();
            let filteredMusicDatas = musicDatas.filter(function (m) { return genre == "ALL" ? true : m.Genre == genre; });
            if (filteredMusicDatas.length > 0) {
                musicList.setChoiceValues(filteredMusicDatas.map(function (m) { return m.Name; }));
            }
            else {
                musicList.setChoiceValues([""]);
            }
            musicCounts[genre] = filteredMusicDatas.length;
        }
        return musicCounts;
    }
}