import { GoogleFormReport } from "../Report/GoogleFormReport";
import { Report, ReportStatus } from "../Report/Report";
import { ReportGroupContainer } from "../Report/ReportGroupContainer";
import { ReportSheet } from "../Report/ReportSheet";
import { ReportFormModule } from "./@ReportFormModule";
import { Debug } from "../Debug";
import { Utility } from "../Utility";
import { MusicDataTable } from "../../MusicDataTable/MusicDataTable";
import { ConfigurationPropertyName } from "../../Configurations/ConfigurationDefinition";
import { GoogleFormBulkReport } from "../Report/GoogleFormBulkReport";
import { BulkReport } from "../Report/BulkReport";
import { BulkReportSheet } from "../Report/BulkReportSheet";

export class ReportModule extends ReportFormModule {
    Debug: any;

    public noticeReportPost(message: string): void {
        if (this.config.line.reportPostNoticeEnabled) {
            this.line.notice.pushTextMessage([message]);
        }
    }

    private _reportSheetMap: { [key: string]: ReportSheet } = {};
    public getReportSheet(versionName: string): ReportSheet {
        if (versionName in this._reportSheetMap) {
            return this._reportSheetMap[versionName];
        }
        this._reportSheetMap[versionName] = new ReportSheet(
            this.musicData.getTable(versionName),
            this.version.getVersionConfig(versionName).reportSpreadsheetId,
            this.version.getVersionConfig(versionName).reportWorksheetName);
        return this._reportSheetMap[versionName];
    }

    public getReports(versionName: string): Report[] {
        return this.getReportSheet(versionName).reports;
    }

    private _reportGroupContainer: { [key: string]: ReportGroupContainer } = {};
    public getReportGroupContainer(versionName: string): ReportGroupContainer {
        if (versionName in this._reportGroupContainer) {
            return this._reportGroupContainer[versionName];
        }

        let versionConfig = this.version.getVersionConfig(versionName);
        let reportGroupSheet = SpreadsheetApp
            .openById(versionConfig.reportSpreadsheetId)
            .getSheetByName(versionConfig.reportGroupWorksheetName);
        let reportSheet = this.getReportSheet(versionName);
        let reportGroupContainer = ReportGroupContainer.createBySheet(reportGroupSheet, reportSheet);

        this._reportGroupContainer[versionName] = reportGroupContainer;
        return reportGroupContainer;
    }

    private _reportGoogleForm: GoogleAppsScript.Forms.Form;
    public get reportGoogleForm(): GoogleAppsScript.Forms.Form {
        if (!this._reportGoogleForm) {
            let formId = this.config.report.reportFormId;
            if (!formId) {
                throw new Error(`${ConfigurationPropertyName.REPORT_GOOGLE_FORM_ID} is not set.`);
            }
            let form = FormApp.openById(formId);
            if (!form) {
                throw new Error(`Form is invalid. formId: ${formId}`);
            }
            this._reportGoogleForm = form;
        }
        return this._reportGoogleForm;
    }

    private _bulkReportSheetMap: { [key: string]: BulkReportSheet } = {};
    public getBulkReportSheet(versionName: string): BulkReportSheet {
        if (versionName in this._bulkReportSheetMap) {
            return this._bulkReportSheetMap[versionName];
        }
        this._bulkReportSheetMap[versionName] = new BulkReportSheet(
            this.musicData.getTable(versionName),
            this.version.getVersionConfig(versionName).reportSpreadsheetId,
            this.version.getVersionConfig(versionName).bulkReportWorksheetName);
        return this._bulkReportSheetMap[versionName];
    }

    public getBulkReports(versionName: string): BulkReport[] {
        return this.getBulkReportSheet(versionName).bulkReports;
    }

    private _bulkReportGoogleForm: GoogleAppsScript.Forms.Form;
    public get bulkReportGoogleForm(): GoogleAppsScript.Forms.Form {
        if (!this._bulkReportGoogleForm) {
            let formId = this.config.report.bulkReportFormId;
            if (!formId) {
                throw new Error(`${ConfigurationPropertyName.BULK_REPORT_GOOGLE_FORM_ID} is not set.`);
            }
            let form = FormApp.openById(formId);
            if (!form) {
                throw new Error(`Form is invalid. formId: ${formId}`);
            }
            this._bulkReportGoogleForm = form;
        }
        return this._bulkReportGoogleForm;
    }

    public approve(versionName: string, reportId: number): void {
        let reportSheet = this.getReportSheet(versionName);
        let targetReport = reportSheet.getReport(reportId);
        let duplicatedReports = reportSheet.reports.filter(r =>
            r.reportId != targetReport.reportId && r.musicId == targetReport.musicId && r.difficulty == targetReport.difficulty);

        let updateList: { reportId: number, status: ReportStatus }[] = [];
        updateList.push({ reportId: reportId, status: ReportStatus.Resolved });
        for (let report of duplicatedReports) {
            updateList.push({ reportId: report.reportId, status: ReportStatus.Rejected });
        }
        reportSheet.updateStatus(updateList);
    }

    public reject(versionName: string, reportId: number): void {
        let reportSheet = this.getReportSheet(versionName);
        reportSheet.updateStatus([{ reportId: reportId, status: ReportStatus.Rejected }]);
    }

    public approveGroup(versionName: string, reportIdList: number[]): void {
        let reportSheet = this.getReportSheet(versionName);
        let updateList: { reportId: number, status: ReportStatus }[] = [];

        for (let reportId of reportIdList) {
            let targetReport = reportSheet.getReport(reportId);
            let duplicatedReports = reportSheet.reports.filter(r =>
                r.reportId != targetReport.reportId && r.musicId == targetReport.musicId && r.difficulty == targetReport.difficulty);

            updateList.push({ reportId: reportId, status: ReportStatus.Resolved });
            for (let duplicated of duplicatedReports) {
                updateList.push({ reportId: duplicated.reportId, status: ReportStatus.Rejected });
            }
        }
        reportSheet.updateStatus(updateList);
    }

    public insertReport(versionName: string, formReport: GoogleFormReport): Report {
        let table = this.musicData.getTable(versionName);
        let reportSheet = this.getReportSheet(versionName);

        let targetMusicData = table.getMusicDataByName(formReport.musicName);
        if (!targetMusicData) {
            Debug.logError(`[検証報告エラー]楽曲表に存在しない楽曲
楽曲名: ${formReport.musicName}
VERSION: ${versionName}`);
            return null;
        }

        if (targetMusicData.getVerified(formReport.difficulty)) {
            Debug.logError(`[検証報告エラー]既に検証済みの楽曲
楽曲名: ${formReport.musicName}
難易度: ${Utility.toDifficultyText(formReport.difficulty)}
VERSION: ${versionName}`);
            return null;
        }

        var diff = formReport.afterOp - formReport.beforeOp;
        if (diff <= 0 || diff > 100) {
            Debug.logError(`[検証報告エラー]OP変動値が範囲外
${JSON.stringify(formReport)}`);
            return null;
        }

        return reportSheet.insertReport(formReport);
    }

    public approveBulk(versionName: string, bulkReportId: number): void {
        let bulkReportSheet = this.getBulkReportSheet(versionName);
        bulkReportSheet.updateStatus([{ reportId: bulkReportId, status: ReportStatus.Resolved }]);
    }

    public rejectBulk(versionName: string, bulkReportId: number): void {
        let bulkReportSheet = this.getBulkReportSheet(versionName);
        bulkReportSheet.updateStatus([{ reportId: bulkReportId, status: ReportStatus.Rejected }]);
    }

    public insertBulkReport(versionName: string, formReport: GoogleFormBulkReport): BulkReport {
        let table = this.musicData.getTable(versionName);
        let bulkReportSheet = this.getBulkReportSheet(versionName);

        let musicCount = table.getTargetLevelMusicCount(formReport.targetLevel);
        let maxOp = Math.round((formReport.targetLevel + 3) * 5 * musicCount);
        let checkOp = maxOp + 0.5;

        let opRatio_x100 = Math.round(formReport.opRatio * 100);
        let calcOpRatio_x100 = Math.floor(formReport.op / maxOp * 100 * 100);
        let checkCalcOpRatio_x100 = Math.floor(formReport.op / (maxOp + 0.5) * 100 * 100);
        if (opRatio_x100 != calcOpRatio_x100) {
            let message = `[一括検証エラー]OP割合推定値とOP割合実測値が一致してません
対象レベル:${formReport.targetLevel}
楽曲数:${musicCount}
OP理論値:${maxOp}
OP実測値:${formReport.op}
OP割合[万分率]:${opRatio_x100}
実測値と理論値の比率[万分率]:${calcOpRatio_x100}`;
            this.line.notice.pushTextMessage([message]);
            Debug.logError(message);
            return null;
        }
        if (calcOpRatio_x100 == checkCalcOpRatio_x100) {
            let message = `[一括検証エラー]確定ではありません
対象レベル:${formReport.targetLevel}
楽曲数:${musicCount}
OP理論値:${maxOp}
OP実測値:${formReport.op}
OP割合[万分率]:${opRatio_x100}
実測値と理論値の比率[万分率]:${calcOpRatio_x100}`;
            this.line.notice.pushTextMessage([message]);
            Debug.logError(message);
            return null;
        }

        return bulkReportSheet.insertBulkReport(formReport);
    }

    public buildForm(versionName: string): void {
        Debug.log(`報告フォームを構築します: ${versionName}`);

        Debug.log('フォームに送信された回答の削除...');
        let form = this.module.report.reportGoogleForm;
        form.deleteAllResponses();
        {
            for (let item of form.getItems()) {
                form.deleteItem(item);
                Utilities.sleep(100);
            }
        }
        Debug.log(`フォームに送信された回答の削除が完了しました`);

        form.setTitle('譜面定数 検証報告');

        let genreSelect = form.addListItem();
        genreSelect.setTitle('ジャンルを選択してください');
        genreSelect.setRequired(true);

        Debug.log(`楽曲選択画面の作成...`);
        let table = this.musicData.getTable(versionName);
        let genres = this.version.getVersionConfig(versionName).genres;
        genres.push('ALL');
        let musicSelectPages: { [key: string]: GoogleAppsScript.Forms.PageBreakItem } = {};
        for (let genre of genres) {
            musicSelectPages[genre] = this.buildFormMusicSelectPage(form, table, genre);
            Utilities.sleep(500);
        }
        Debug.log(`楽曲選択画面の作成が完了しました`);

        Debug.log(`ジャンル選択画面の構築...`);
        this.buildGenreSelect(genreSelect, genres, musicSelectPages);
        Debug.log(`ジャンル選択画面の構築中が完了しました`);

        Utilities.sleep(1000);

        Debug.log(`パラメータ記入画面の作成...`);
        let scoreInputPage = this.buildInputPage(form);
        Debug.log(`パラメータ記入画面の作成が完了しました`);

        Utilities.sleep(1000);

        Debug.log(`ページ遷移の構築...`);
        for (let genre of genres) {
            musicSelectPages[genre].setGoToPage(scoreInputPage);
        }
        Debug.log(`ページ遷移の構築が完了しました`);

        Debug.log(`報告フォームの構築が完了しました`);
    }

    private buildFormMusicSelectPage(form: GoogleAppsScript.Forms.Form, table: MusicDataTable, targetGenre: string): GoogleAppsScript.Forms.PageBreakItem {
        let page = form.addPageBreakItem();
        page.setTitle('楽曲選択');

        let musicList = form.addListItem();

        let displayGenreText = targetGenre == 'ALL' ? '全ジャンル' : targetGenre;
        musicList.setTitle(`楽曲を選択してください(${displayGenreText})`);
        musicList.setRequired(true);

        let targetMusicDatas = targetGenre == 'ALL'
            ? table.datas
            : table.datas.filter(m => m.Genre == targetGenre);
        if (targetMusicDatas.length > 0) {
            musicList.setChoiceValues(targetMusicDatas.map(m => m.Name));
        }

        return page;
    }

    private buildGenreSelect(
        genreSelect: GoogleAppsScript.Forms.ListItem,
        genres: string[],
        musicSelectPages: { [key: string]: GoogleAppsScript.Forms.PageBreakItem }): void {
        let choices: GoogleAppsScript.Forms.Choice[] = new Array();
        for (let genre of genres) {
            let displayGenreText = genre == 'ALL' ? '全ジャンル' : genre;
            let page = musicSelectPages[genre];
            let choice = genreSelect.createChoice(displayGenreText, page);
            choices.push(choice);
        }
        genreSelect.setChoices(choices);
    }

    private buildInputPage(form: GoogleAppsScript.Forms.Form): GoogleAppsScript.Forms.PageBreakItem {
        let scoreInputPage = form.addPageBreakItem();
        scoreInputPage.setTitle('スコア入力');

        let difficultyList = form.addMultipleChoiceItem();
        difficultyList.setTitle("難易度を選択してください");
        difficultyList.setRequired(true);
        difficultyList.setChoiceValues(["MASTER", "EXPERT", "ADVANCED", "BASIC"]);

        let beforeOpInput = form.addTextItem();
        beforeOpInput.setTitle("変動前のOPを入力してください");
        beforeOpInput.setRequired(true);
        beforeOpInput.setValidation(FormApp.createTextValidation()
            .requireNumberGreaterThanOrEqualTo(0)
            /// @ts-ignore
            .build());

        let afterOpInput = form.addTextItem();
        afterOpInput.setTitle("変動後のOPを入力してください");
        afterOpInput.setRequired(true);
        afterOpInput.setValidation(FormApp.createTextValidation()
            .requireNumberGreaterThanOrEqualTo(0)
            /// @ts-ignore
            .build());

        let scoreInput = form.addTextItem();
        scoreInput.setTitle("スコアを入力してください");
        scoreInput.setRequired(true);
        scoreInput.setValidation(FormApp.createTextValidation()
            .requireNumberBetween(950000, 1010000)
            /// @ts-ignore
            .setHelpText("許容スコア範囲は[950000,1010000]です")
            /// @ts-ignore
            .build());

        let comboStatusInput = form.addMultipleChoiceItem();
        comboStatusInput.setTitle("コンボステータスを入力してください");
        comboStatusInput.setRequired(true);
        comboStatusInput.setChoiceValues(["AJ", "FC", "なし"]);

        // OP変動確認用の画像を添付してください(バージョン名)
        // 特定のファイル形式のみ許可
        //  - 画像
        // ファイルの最大数 5
        // 最大ファイルサイズ 10MB

        return scoreInputPage;
    }

    public buildBulkReportForm(versionName: string): void {

    }
}
