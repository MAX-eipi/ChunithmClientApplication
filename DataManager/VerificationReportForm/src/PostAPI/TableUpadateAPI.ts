import * as DataManager from "../../DataManager";
import { DataManagerOperator } from "../Operators/DataManagerOperator";
import { IPostAPI } from "./IPostApi";
import { LineConnectorOperator } from "../Operators/LineConnectorOperator";
import { TwitterConnectorOperator } from "../Operators/TwitterConnectorOperator";
import { Operator } from "../Operators/Operator";

export class TableUpdateAPI implements IPostAPI {
    called(api: string): boolean {
        return api == "table/update";
    }

    invoke(api: string, postData: any): any {
        let oldMusicDatas = DataManagerOperator.getMusicDatas();
        let musicDatas = DataManagerOperator.updateTable(postData.MusicDatas);
        let musicDataTable = { MusicDatas: musicDatas.getTable() };
        let response = {
            MusicDataTable: musicDataTable
        }

        let addedMusicDatas = TableUpdateAPI.getAddedMusicDatas(oldMusicDatas, musicDatas.getTable());

        if (addedMusicDatas.length > 0) {
            let musicCounts = TableUpdateAPI.setMusicList();
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
                LineConnectorOperator.pushMessage([message]);
                TwitterConnectorOperator.postTweet(message);
            }
            else {
                message = '[新規定数表作成]\n';
                for (var genre in musicCounts) {
                    message += `${genre}: ${musicCounts[genre]}\n`;
                }
                LineConnectorOperator.pushMessage([message]);
                TwitterConnectorOperator.postTweet(message);
            }
        }

        return response;
    }

    private static getAddedMusicDatas(oldMusicDatas: DataManager.MusicData[], newMusicDatas: DataManager.MusicData[]): DataManager.MusicData[] {
        var oldMusicIds: { [key: string]: boolean } = {};
        for (var i = 0; i < oldMusicDatas.length; i++) {
            oldMusicIds[oldMusicDatas[i].Id.toString()] = true;
        }

        var added: DataManager.MusicData[] = [];
        for (var i = 0; i < newMusicDatas.length; i++) {
            let musicData = newMusicDatas[i];
            if (!oldMusicIds[musicData.Id.toString()]) {
                added.push(musicData);
            }
        }
        return added;
    }

    private static setMusicList(): { [genre: string]: number } {
        var musicDatas = DataManagerOperator.getMusicDatas();
        var form = Operator.getReportForm();
        var list = form.getItems(FormApp.ItemType.LIST);

        let genres = DataManagerOperator.getGenres();
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