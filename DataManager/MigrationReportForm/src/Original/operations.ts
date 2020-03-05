import * as DataManager from "../DataManager";
import { ConfigurationEditor } from "./Configuration";
import { DataManagerOperator } from "./Operators/DataManagerOperator";
import { LineConnectorOperator } from "./Operators/LineConnectorOperator";
import { Operator } from "./Operators/Operator";
import { ReportOperator } from "./Operators/ReportOperator";
import { TwitterConnectorOperator } from "./Operators/TwitterConnectorOperator";
import { ReportStatus } from "./Report";
import { InProgressListPager } from "./Pager/InProgressListPager";

export function storeConfig() {
    try {
        let spreadsheetId = PropertiesService.getScriptProperties().getProperty("config_sheet_id");
        ConfigurationEditor.load(spreadsheetId, "Global", "Version");
        ConfigurationEditor.store();
        Logger.log(ConfigurationEditor.getGlobalConfigurationJson());
        Logger.log(ConfigurationEditor.getVersionConfigurationJson());
    }
    catch (e) {
        Operator.exception(e);
    }
}

function setupForm() {
    try {
        Operator.setDefaultVersion();

        let musicDatas = DataManagerOperator.getMusicDatas();
        let form = Operator.getReportForm();
        form.deleteAllResponses();
        {
            let items = form.getItems();
            for (var i = 0; i < items.length; i++) {
                form.deleteItem(items[i]);
                Utilities.sleep(100);
            }
        }

        form.setTitle("譜面定数検証報告");
        //form.setDescription("検証方法は下記リンクを参照");

        let genres = DataManagerOperator.getGenres();
        genres.push("ALL");
        let genreList = form.addListItem();
        genreList.setTitle("ジャンルを選択してください");
        genreList.setRequired(true);

        let musicListPages: GoogleAppsScript.Forms.PageBreakItem[] = new Array();
        for (var i = 0; i < genres.length; i++) {
            let genre = genres[i];
            let page = form.addPageBreakItem();
            page.setTitle("楽曲選択");
            let genreText = genre == "ALL" ? "全ジャンル" : genre;
            let musicList = form.addListItem();
            musicList.setRequired(true);
            musicList.setTitle(`楽曲を選択してください(${genreText})`);
            let filteredMusicDatas = musicDatas.filter(function (m) { return genre == "ALL" ? true : m.Genre == genre; });
            if (filteredMusicDatas.length > 0) {
                musicList.setChoiceValues(filteredMusicDatas.map(function (m) { return m.Name; }));
            }
            musicListPages.push(page);
            Utilities.sleep(500);
        }
        {
            let choices: GoogleAppsScript.Forms.Choice[] = new Array();
            for (var i = 0; i < genres.length; i++) {
                let genre = genres[i];
                let genreText = genre == "ALL" ? "全ジャンル" : genre;
                let page = musicListPages[i];
                let choice = genreList.createChoice(genreText, page);
                choices.push(choice);
            }
            genreList.setChoices(choices);
            Utilities.sleep(500);
        }

        let scoreInputPage = form.addPageBreakItem();
        {
            scoreInputPage.setTitle("スコア入力");

            let difficultyList = form.addMultipleChoiceItem();
            difficultyList.setTitle("難易度を選択してください");
            difficultyList.setRequired(true);
            difficultyList.setChoiceValues(["MASTER", "EXPERT", "ADVANCED", "BASIC"]);
            Utilities.sleep(500);

            let beforeOpInput = form.addTextItem();
            beforeOpInput.setTitle("変動前のOPを入力してください");
            beforeOpInput.setRequired(true);
            beforeOpInput.setValidation(FormApp.createTextValidation()
                .requireNumberGreaterThanOrEqualTo(0)
                /// @ts-ignore
                .build());
            Utilities.sleep(500);

            let afterOpInput = form.addTextItem();
            afterOpInput.setTitle("変動後のOPを入力してください");
            afterOpInput.setRequired(true);
            afterOpInput.setValidation(FormApp.createTextValidation()
                .requireNumberGreaterThanOrEqualTo(0)
                /// @ts-ignore
                .build());
            Utilities.sleep(500);

            let scoreInput = form.addTextItem();
            scoreInput.setTitle("スコアを入力してください");
            scoreInput.setRequired(true);
            scoreInput.setValidation(FormApp.createTextValidation()
                .requireNumberBetween(950000, 1010000)
                /// @ts-ignore
                .setHelpText("許容スコア範囲は[950000,1010000]です")
                /// @ts-ignore
                .build());
            Utilities.sleep(500);

            let comboStatusInput = form.addMultipleChoiceItem();
            comboStatusInput.setTitle("コンボステータスを入力してください");
            comboStatusInput.setRequired(true);
            comboStatusInput.setChoiceValues(["AJ", "FC", "なし"]);
            Utilities.sleep(500);

            // OP変動確認用の画像を添付してください(バージョン名)
            // 特定のファイル形式のみ許可
            //  - 画像
            // ファイルの最大数 5
            // 最大ファイルサイズ 10MB
        }

        for (var i = 0; i < musicListPages.length; i++) {
            musicListPages[i].setGoToPage(scoreInputPage);
        }
    }
    catch (e) {
        Operator.exception(e);
    }
}

function authorizeTwitter() {
    try {
        TwitterConnectorOperator.authorize();
    }
    catch (e) {
        Operator.exception(e);
    }
}

function authCallback(request): any {
    try {
        return TwitterConnectorOperator.authCallback(request);
    }
    catch (e) {
        Operator.exception(e);
    }
}

function getGenres(): string[] {
    try {
        Operator.setDefaultVersion();
        let genres: string[] = [];
        let musicDatas: DataManager.MusicData[] = DataManagerOperator.getMusicDatas();
        for (var i = 0; i < musicDatas.length; i++) {
            let genre = musicDatas[i].Genre;
            if (genres.indexOf(genre) == -1) {
                genres.push(genre);
            }
        }
        Logger.log(Operator.getTargetVersionName());
        Logger.log(JSON.stringify(genres));
        return genres;
    }
    catch (e) {
        Operator.exception(e);
    }
}

export function notifyUnverified() {
    try {
        Operator.setDefaultVersion();

        let reports = ReportOperator.getReports();
        var unverifiedCount = 0;
        for (var i = 0; i < reports.length; i++) {
            if (reports[i].getReportStatus() == ReportStatus.InProgress) {
                unverifiedCount++;
            }
        }

        if (unverifiedCount > 0) {
            let unverifiedListUrl = InProgressListPager.getUrl(Operator.getRootUrl(), Operator.getTargetVersionName());
            let message = `未承認の報告が${unverifiedCount}件あります
[報告リストURL]
${unverifiedListUrl}`;
            LineConnectorOperator.pushMessage([message]);
        }
    }
    catch (e) {
        Operator.exception(e);
    }
}