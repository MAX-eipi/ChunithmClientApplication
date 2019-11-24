import { ConfigurationEditor } from "./Configuration";
import { storeConfig } from "./operations";
import { CommandOperator } from "./Operators/CommandOperator";
import { DataManagerOperator } from "./Operators/DataManagerOperator";
import { LineConnectorOperator } from "./Operators/LineConnectorOperator";
import { Operator } from "./Operators/Operator";
import { ReportOperator } from "./Operators/ReportOperator";
import { SpreadSheetLoggerOperator } from "./Operators/SpreadSheetLoggerOperator";
import { ApprovalPager } from "./Pager/ApprovalPager";

export class VerificationReportForm {
    public static doGet(e: any): any {
        this.init();
        var versionName = e.parameter.versionName;
        if (!versionName) {
            versionName = Operator.getDefaultVersionName();
        }
        Operator.setVersion(versionName);
        return Operator.routing(e.parameter.page, e.parameter);
    }

    private static getStoreConfigRequest(postData: any): any {
        if (!postData.events) {
            return null;
        }
        for (var i = 0; i < postData.events.length; i++) {
            let event = postData.events[i];
            if (event.type == "message" && event.message.type == "text" && event.message.text == ":store-config") {
                return event;
            }
        }
        return null;
    }

    private static storeConfig(request): void {
        storeConfig();
        let messages = [ConfigurationEditor.getGlobalConfigurationJson(), ConfigurationEditor.getVersionConfigurationJson()];
        SpreadSheetLoggerOperator.log(messages);
        LineConnectorOperator.replyMessage(request.replyToken, messages);
    }

    public static doPost(e: any): any {
        this.init();
        let postData = JSON.parse(e.postData.getDataAsString());

        let storeConfigRequest = this.getStoreConfigRequest(postData);
        if (storeConfigRequest) {
            this.storeConfig(storeConfigRequest);
            return ContentService.createTextOutput(JSON.stringify({ "Success": true })).setMimeType(ContentService.MimeType.JSON);
        }

        var response = {};
        if (postData.events) {
            response = this.doPostLineCommand(e, postData);
        } else if (postData.API) {
            var versionName = postData.versionName;
            if (!versionName) {
                versionName = Operator.getDefaultVersionName();
            }
            Operator.setVersion(versionName);
            response = this.doPostAPICommand(e, postData);
        }
        response["Success"] = true;
        return ContentService.createTextOutput(JSON.stringify(response)).setMimeType(ContentService.MimeType.JSON);
    }

    private static doPostLineCommand(e: any, postData: any): any {
        SpreadSheetLoggerOperator.log([e.postData.getDataAsString()]);
        CommandOperator.invokeLineCommand(postData);
        return { 'content': 'post ok' };
    }

    private static doPostAPICommand(e: any, postData: any): any {
        SpreadSheetLoggerOperator.log([postData.API]);
        return CommandOperator.invokePostAPI(postData);

//        switch (postData.API) {
//            case "table/update":
//                {
//                    let oldMusicDatas = DataManagerOperator.getMusicDatas();
//                    let musicDatas = DataManagerOperator.updateTable(postData.MusicDatas);
//                    let musicDataTable = { MusicDatas: musicDatas.getTable() };
//                    let response = {
//                        MusicDataTable: musicDataTable
//                    }

//                    let addedMusicDatas = this.getAddedMusicDatas(oldMusicDatas, musicDatas.getTable());

//                    if (addedMusicDatas.length > 0) {
//                        let musicCounts = this.setMusicList();
//                        if (oldMusicDatas.length > 0) {
//                            var message = "[新曲追加]";
//                            for (var i = 0; i < addedMusicDatas.length; i++) {
//                                let m = addedMusicDatas[i];
//                                let basicLevelText = m.BasicLevel.toString().replace(".7", "+");
//                                let advancedLevelText = m.AdvancedLevel.toString().replace(".7", "+");
//                                let expertLevelText = m.ExpertLevel.toString().replace(".7", "+");
//                                let masterLevelText = m.MasterLevel.toString().replace(".7", "+");
//                                message += `
//${m.Name} ${basicLevelText}/${advancedLevelText}/${expertLevelText}/${masterLevelText}`;
//                            }
//                            LineConnectorOperator.pushMessage([message]);
//                            TwitterConnectorOperator.postTweet(message);
//                        }
//                        else {
//                            var message = `[新規定数表作成]
//総楽曲数:${musicCounts[0]}
//POPS & ANIME:${musicCounts[1]}
//niconico:${musicCounts[2]}
//東方Project:${musicCounts[3]}
//VARIETY:${musicCounts[4]}
//イロドリミドリ:${musicCounts[5]}
//言ノ葉Project:${musicCounts[6]}
//ORIGINAL:${musicCounts[7]}`;
//                            LineConnectorOperator.pushMessage([message]);
//                            TwitterConnectorOperator.postTweet(message);
//                        }
//                    }

//                    return response;
//                }
//            case "table/get":
//                {
//                    let musicDatas = DataManagerOperator.getMusicDatas();
//                    let musicDataTable = { MusicDatas: musicDatas };
//                    let response = {
//                        MusicDataTable: musicDataTable
//                    };
//                    return response;
//                }
//        }
    }

    //private static getAddedMusicDatas(oldMusicDatas: DataManager.MusicData[], newMusicDatas: DataManager.MusicData[]): DataManager.MusicData[] {
    //    var oldMusicIds: { [key: string]: boolean } = {};
    //    for (var i = 0; i < oldMusicDatas.length; i++) {
    //        oldMusicIds[oldMusicDatas[i].Id.toString()] = true;
    //    }

    //    var added: DataManager.MusicData[] = [];
    //    for (var i = 0; i < newMusicDatas.length; i++) {
    //        let musicData = newMusicDatas[i];
    //        if (!oldMusicIds[musicData.Id.toString()]) {
    //            added.push(musicData);
    //        }
    //    }
    //    return added;
    //}

    //private static setMusicList(): number[] {
    //    var musicDatas = DataManagerOperator.getMusicDatas();
    //    var form = Operator.getReportForm();
    //    var list = form.getItems(FormApp.ItemType.LIST);

    //    let genres = [
    //        "All",
    //        "POPS & ANIME",
    //        "niconico",
    //        "東方Project",
    //        "VARIETY",
    //        "イロドリミドリ",
    //        "言ノ葉Project",
    //        "ORIGINAL",
    //    ];
    //    let musicCounts: number[] = new Array();
    //    for (var i = 0; i < genres.length; i++) {
    //        let genre = genres[i];
    //        let musicList = list[i + 1].asListItem();
    //        let filteredMusicDatas = musicDatas.filter(function (m) { return genre == "ALL" ? true : m.Genre == genre; });
    //        if (filteredMusicDatas.length > 0) {
    //            musicList.setChoiceValues(filteredMusicDatas.map(function (m) { return m.Name; }));
    //        }
    //        else {
    //            musicList.setChoiceValues([""]);
    //        }
    //        musicCounts.push(filteredMusicDatas.length);
    //    }
    //    return musicCounts;
    //}

    public static onPost(e: any, versionName: string = ""): void {
        this.init();
        if (!versionName) {
            versionName = Operator.getDefaultVersionName();
        }
        Operator.setVersion(versionName);
        let report = ReportOperator.insertReport(e.response);
        let musicName = report.getMusicName();
        let difficulty = report.getDifficulty();
        let beforeOp = report.getBeforeOp();
        let afterOp = report.getAfterOp();
        let score = report.getScore();
        let comboStatus = report.getComboStatus();
        let baseRating = report.calcBaseRating();
        SpreadSheetLoggerOperator.log([
            "[検証結果報告]",
            `報告ID:${report.getReportId()}`,
            `報告ID:${report.getReportId()}`,
            `楽曲名:${musicName}`,
            `難易度:${difficulty}`,
            `OP:${beforeOp}→${afterOp}(${Math.round((afterOp - beforeOp) * 100) / 100})`,
            `スコア:${score}`,
            `コンボ:${comboStatus}`,
            `譜面定数:${baseRating}`,
        ]);
        LineConnectorOperator.noticeReportPost([`[検証結果 報告]
楽曲名:${report.getMusicName()}
難易度:${difficulty}
譜面定数:${baseRating}
URL:${ApprovalPager.getUrl(Operator.getRootUrl(), Operator.getTargetVersionName(), report.getReportId())}`]);
    }

    private static init() {
        Operator.addOnChangeTargetVersionEventHandler(DataManagerOperator.reset);
        Operator.addOnChangeTargetVersionEventHandler(ReportOperator.reset);
    }
}
