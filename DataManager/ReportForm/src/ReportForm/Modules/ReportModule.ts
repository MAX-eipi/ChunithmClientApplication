import { ConfigurationPropertyName } from "../../Configurations/ConfigurationDefinition";
import { Difficulty } from "../../MusicDataTable/Difficulty";
import { MusicDataTable } from "../../MusicDataTable/MusicDataTable";
import { Debug } from "../Debug";
import { Environment } from "../Environment";
import { GoogleFormBulkReport } from "../Report/GoogleFormBulkReport";
import { GoogleFormReport } from "../Report/GoogleFormReport";
import { IMusicDataReport } from "../Report/IMusicDataReport";
import { IReport } from "../Report/IReport";
import { LevelBulkReport } from "../Report/LevelBulkReport";
import { LevelBulkReportSheet } from "../Report/LevelBulkReportSheet";
import { MusicDataReportGroupContainer } from "../Report/MusicDataReportGroupContainer";
import { ReportStatus } from "../Report/ReportStatus";
import { PostLocation, ReportStorage } from "../Report/ReportStorage";
import { Utility } from "../Utility";
import { ReportFormModule } from "./@ReportFormModule";

export class ReportModule extends ReportFormModule {
    public noticeReportPost(message: string): void {
        if (this.config.line.reportPostNoticeEnabled) {
            this.line.notice.pushTextMessage([message]);
        }
    }

    private _reportStorage: { [key: string]: ReportStorage } = {};
    public getReportStorage(versionName: string): ReportStorage {
        if (versionName in this._reportStorage) {
            return this._reportStorage[versionName];
        }
        this._reportStorage[versionName] = new ReportStorage(
            this.musicData.getTable(versionName),
            this.version.getVersionConfig(versionName).reportSpreadsheetId,
            this.version.getVersionConfig(versionName).reportWorksheetName);
        return this._reportStorage[versionName];
    }

    public getReportContainers(versionName: string): IMusicDataReport[] {
        return this.getReportStorage(versionName).reportContainers;
    }

    public getReportContainer(versionName: string, musicId: number, difficulty: Difficulty): IMusicDataReport {
        return this.getReportStorage(versionName).getMusicDataReport(musicId, difficulty);
    }

    public getReports(versionName: string): IReport[] {
        return this.getReportStorage(versionName).reports;
    }

    public getReport(versionName: string, reportId: number): IReport {
        return this.getReportStorage(versionName).getReportById(reportId);
    }

    private readonly _musicDataReportGroupContainer: { [key: string]: MusicDataReportGroupContainer } = {};
    public getMusicDataReportGroupContainer(versionName: string): MusicDataReportGroupContainer {
        if (versionName in this._musicDataReportGroupContainer) {
            return this._musicDataReportGroupContainer[versionName];
        }

        const versionConfig = this.version.getVersionConfig(versionName);
        const sheet = SpreadsheetApp
            .openById(versionConfig.reportSpreadsheetId)
            .getSheetByName(versionConfig.reportGroupWorksheetName);
        const storage = this.getReportStorage(versionName);
        const container = MusicDataReportGroupContainer.createByStorage(sheet, storage);

        this._musicDataReportGroupContainer[versionName] = container;
        return container;
    }

    private _reportGoogleForm: GoogleAppsScript.Forms.Form;
    public get reportGoogleForm(): GoogleAppsScript.Forms.Form {
        if (!this._reportGoogleForm) {
            const formId = this.config.report.reportFormId;
            if (!formId) {
                throw new Error(`${ConfigurationPropertyName.REPORT_GOOGLE_FORM_ID} is not set.`);
            }
            const form = FormApp.openById(formId);
            if (!form) {
                throw new Error(`Form is invalid. formId: ${formId}`);
            }
            this._reportGoogleForm = form;
        }
        return this._reportGoogleForm;
    }

    private _levelBulkReportSheetMap: { [key: string]: LevelBulkReportSheet } = {};
    public getLevelBulkReportSheet(versionName: string): LevelBulkReportSheet {
        if (versionName in this._levelBulkReportSheetMap) {
            return this._levelBulkReportSheetMap[versionName];
        }
        this._levelBulkReportSheetMap[versionName] = new LevelBulkReportSheet(
            this.musicData.getTable(versionName),
            this.version.getVersionConfig(versionName).reportSpreadsheetId,
            this.version.getVersionConfig(versionName).bulkReportWorksheetName);
        return this._levelBulkReportSheetMap[versionName];
    }

    public getLevelBulkReports(versionName: string): LevelBulkReport[] {
        return this.getLevelBulkReportSheet(versionName).bulkReports;
    }

    private _levelBulkReportGoogleForm: GoogleAppsScript.Forms.Form;
    public get levelBulkReportGoogleForm(): GoogleAppsScript.Forms.Form {
        if (!this._levelBulkReportGoogleForm) {
            const formId = this.config.report.bulkReportFormId;
            if (!formId) {
                throw new Error(`${ConfigurationPropertyName.BULK_REPORT_GOOGLE_FORM_ID} is not set.`);
            }
            const form = FormApp.openById(formId);
            if (!form) {
                throw new Error(`Form is invalid. formId: ${formId}`);
            }
            this._levelBulkReportGoogleForm = form;
        }
        return this._levelBulkReportGoogleForm;
    }

    public approve(versionName: string, reportId: number): void {
        const reportStorage = this.getReportStorage(versionName);
        const targetReport = reportStorage.getReportById(reportId);
        const duplicatedReports = reportStorage.reports.filter(r =>
            r.reportId !== targetReport.reportId && r.musicId === targetReport.musicId && r.difficulty === targetReport.difficulty);

        reportStorage.updateStatus(reportId, ReportStatus.Resolved);
        for (const report of duplicatedReports) {
            reportStorage.updateStatus(report.reportId, ReportStatus.Rejected);
        }
        reportStorage.write();
    }

    public reject(versionName: string, reportId: number): void {
        const reportStorage = this.getReportStorage(versionName);
        reportStorage.updateStatus(reportId, ReportStatus.Rejected);
        reportStorage.write();
    }

    public approveGroup(versionName: string, reportIdList: number[]): void {
        const reportStorage = this.getReportStorage(versionName);
        for (const reportId of reportIdList) {
            const targetReport = reportStorage.getReportById(reportId);
            const duplicatedReports = reportStorage.reports.filter(r =>
                r.reportId !== targetReport.reportId && r.musicId === targetReport.musicId && r.difficulty === targetReport.difficulty);

            reportStorage.updateStatus(reportId, ReportStatus.Resolved);
            for (const duplicated of duplicatedReports) {
                reportStorage.updateStatus(duplicated.reportId, ReportStatus.Rejected);
            }
        }
        reportStorage.write();
    }

    public insertReport(versionName: string, formReport: GoogleFormReport): IReport {
        const table = this.musicData.getTable(versionName);

        const targetMusicData = table.getMusicDataByName(formReport.musicName);
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

        const diff = formReport.afterOp - formReport.beforeOp;
        if (diff <= 0 || diff > 100) {
            Debug.logError(`[検証報告エラー]OP変動値が範囲外
${JSON.stringify(formReport)}`);
            return null;
        }

        return this.getReportStorage(versionName)
            .push(formReport, PostLocation.GoogleForm, formReport.imagePaths);
    }

    public approveBulk(versionName: string, bulkReportId: number): void {
        const bulkReportSheet = this.getLevelBulkReportSheet(versionName);
        bulkReportSheet.updateStatus([{ reportId: bulkReportId, status: ReportStatus.Resolved }]);
    }

    public rejectBulk(versionName: string, bulkReportId: number): void {
        const bulkReportSheet = this.getLevelBulkReportSheet(versionName);
        bulkReportSheet.updateStatus([{ reportId: bulkReportId, status: ReportStatus.Rejected }]);
    }

    public insertBulkReport(versionName: string, formReport: GoogleFormBulkReport): LevelBulkReport {
        const table = this.musicData.getTable(versionName);
        const bulkReportSheet = this.getLevelBulkReportSheet(versionName);

        const musicCount = table.getTargetLevelMusicCount(formReport.targetLevel);
        const maxOp = Math.round((formReport.targetLevel + 3) * 5 * musicCount);
        const checkOp = maxOp + 0.5;

        const opRatio100Fold = Math.round(formReport.opRatio * 100);
        const calcOpRatio100Fold = Math.floor(formReport.op / maxOp * 100 * 100);
        const checkCalcOpRatio100Fold = Math.floor(formReport.op / checkOp * 100 * 100);
        if (opRatio100Fold !== calcOpRatio100Fold) {
            const message = `[一括検証エラー]OP割合推定値とOP割合実測値が一致してません
対象レベル:${formReport.targetLevel}
楽曲数:${musicCount}
OP理論値:${maxOp}
OP実測値:${formReport.op}
OP割合[万分率]:${opRatio100Fold}
実測値と理論値の比率[万分率]:${calcOpRatio100Fold}`;
            this.line.notice.pushTextMessage([message]);
            Debug.logError(message);
            return null;
        }
        if (calcOpRatio100Fold === checkCalcOpRatio100Fold) {
            const message = `[一括検証エラー]確定ではありません
対象レベル:${formReport.targetLevel}
楽曲数:${musicCount}
OP理論値:${maxOp}
OP実測値:${formReport.op}
OP割合[万分率]:${opRatio100Fold}
実測値と理論値の比率[万分率]:${calcOpRatio100Fold}`;
            this.line.notice.pushTextMessage([message]);
            Debug.logError(message);
            return null;
        }

        return bulkReportSheet.insertBulkReport(formReport);
    }

    public buildForm(versionName: string): void {
        Debug.log(`報告フォームを構築します: ${versionName}`);

        Debug.log('フォームに送信された回答の削除...');
        const form = this.module.report.reportGoogleForm;
        form.deleteAllResponses();
        {
            for (const item of form.getItems()) {
                form.deleteItem(item);
                Utilities.sleep(100);
            }
        }
        Debug.log(`フォームに送信された回答の削除が完了しました`);

        form.setTitle('譜面定数 検証報告');

        const genreSelect = form.addListItem();
        genreSelect.setTitle('ジャンルを選択してください');
        genreSelect.setRequired(true);

        Debug.log(`楽曲選択画面の作成...`);
        const table = this.musicData.getTable(versionName);
        const genres = this.version.getVersionConfig(versionName).genres;
        genres.push('ALL');
        const musicSelectPages: { [key: string]: GoogleAppsScript.Forms.PageBreakItem } = {};
        for (const genre of genres) {
            musicSelectPages[genre] = this.buildFormMusicSelectPage(form, table, genre);
            Utilities.sleep(500);
        }
        Debug.log(`楽曲選択画面の作成が完了しました`);

        Debug.log(`ジャンル選択画面の構築...`);
        this.buildGenreSelect(genreSelect, genres, musicSelectPages);
        Debug.log(`ジャンル選択画面の構築中が完了しました`);

        Utilities.sleep(1000);

        Debug.log(`パラメータ記入画面の作成...`);
        const scoreInputPage = this.buildInputPage(form);
        Debug.log(`パラメータ記入画面の作成が完了しました`);

        Utilities.sleep(1000);

        Debug.log(`ページ遷移の構築...`);
        for (const genre of genres) {
            musicSelectPages[genre].setGoToPage(scoreInputPage);
        }
        Debug.log(`ページ遷移の構築が完了しました`);

        Debug.log(`報告フォームの構築が完了しました`);
    }

    private buildFormMusicSelectPage(form: GoogleAppsScript.Forms.Form, table: MusicDataTable, targetGenre: string): GoogleAppsScript.Forms.PageBreakItem {
        const page = form.addPageBreakItem();
        page.setTitle('楽曲選択');

        const musicList = form.addListItem();

        const displayGenreText = targetGenre === 'ALL' ? '全ジャンル' : targetGenre;
        musicList.setTitle(`楽曲を選択してください(${displayGenreText})`);
        musicList.setRequired(true);

        const targetMusicDatas = targetGenre === 'ALL'
            ? table.datas
            : table.datas.filter(m => m.Genre === targetGenre);
        if (targetMusicDatas.length > 0) {
            musicList.setChoiceValues(targetMusicDatas.map(m => m.Name));
        }

        return page;
    }

    private buildGenreSelect(
        genreSelect: GoogleAppsScript.Forms.ListItem,
        genres: string[],
        musicSelectPages: { [key: string]: GoogleAppsScript.Forms.PageBreakItem }): void {
        const choices: GoogleAppsScript.Forms.Choice[] = [];
        for (const genre of genres) {
            const displayGenreText = genre === 'ALL' ? '全ジャンル' : genre;
            const page = musicSelectPages[genre];
            const choice = genreSelect.createChoice(displayGenreText, page);
            choices.push(choice);
        }
        genreSelect.setChoices(choices);
    }

    private buildInputPage(form: GoogleAppsScript.Forms.Form): GoogleAppsScript.Forms.PageBreakItem {
        const scoreInputPage = form.addPageBreakItem();
        scoreInputPage.setTitle('スコア入力');

        const difficultyList = form.addMultipleChoiceItem();
        difficultyList.setTitle("難易度を選択してください");
        difficultyList.setRequired(true);
        difficultyList.setChoiceValues(["MASTER", "EXPERT", "ADVANCED", "BASIC"]);

        const beforeOpInput = form.addTextItem();
        beforeOpInput.setTitle("変動前のOPを入力してください");
        beforeOpInput.setRequired(true);
        beforeOpInput.setValidation(FormApp.createTextValidation()
            .requireNumberGreaterThanOrEqualTo(0)
            .build());

        const afterOpInput = form.addTextItem();
        afterOpInput.setTitle("変動後のOPを入力してください");
        afterOpInput.setRequired(true);
        afterOpInput.setValidation(FormApp.createTextValidation()
            .requireNumberGreaterThanOrEqualTo(0)
            .build());

        const scoreInput = form.addTextItem();
        scoreInput.setTitle("スコアを入力してください");
        scoreInput.setRequired(true);
        scoreInput.setValidation(FormApp.createTextValidation()
            .requireNumberBetween(950000, 1010000)
            .setHelpText("許容スコア範囲は[950000,1010000]です")
            .build());

        const comboStatusInput = form.addMultipleChoiceItem();
        comboStatusInput.setTitle("コンボステータスを入力してください");
        comboStatusInput.setRequired(true);
        comboStatusInput.setChoiceValues(["AJ", "FC", "なし"]);

        // OP変動確認用の画像を添付してください
        // 特定のファイル形式のみ許可
        //  - 画像
        // ファイルの最大数 5
        // 最大ファイルサイズ 10MB

        return scoreInputPage;
    }

    public buildBulkReportForm(versionName: string): void {
        Debug.log(`一括報告フォームを構築します: ${versionName}`);

        Debug.log('フォームに送信された回答の削除...');
        const form = this.module.report.levelBulkReportGoogleForm;
        form.deleteAllResponses();
        {
            for (const item of form.getItems()) {
                form.deleteItem(item);
                Utilities.sleep(100);
            }
        }
        Debug.log(`フォームに送信された回答の削除が完了しました`);

        const versionConfig = this.version.getVersionConfig(versionName);
        if (this.config.common.environment === Environment.Release) {
            form.setTitle(`譜面定数 一括検証報告 ${versionConfig.displayVersionName}`);
        }
        else {
            form.setTitle(`譜面定数 一括検証報告 ${versionConfig.displayVersionName} [Dev]`);
        }

        Debug.log('パラメータ記入画面の作成...');
        {
            const levelSelector = form.addListItem();
            levelSelector.setTitle('レベルを選択してください');
            levelSelector.setRequired(true);
            const choices: GoogleAppsScript.Forms.Choice[] = [];
            for (let i = 1; i <= 6; i++) {
                const choice = levelSelector.createChoice(i.toString());
                choices.push(choice);
            }
            levelSelector.setChoices(choices);
        }
        {
            const opInput = form.addTextItem();
            opInput.setTitle("OPを入力してください");
            opInput.setRequired(true);
            opInput.setValidation(FormApp.createTextValidation()
                .requireNumberGreaterThan(0)
                .build());
        }
        {
            const opRatioInput = form.addTextItem();
            opRatioInput.setTitle("OP割合を入力してください");
            opRatioInput.setRequired(true);
            opRatioInput.setValidation(FormApp.createTextValidation()
                .requireNumberBetween(0, 100)
                .build());
        }
        Debug.log(`パラメータ記入画面の作成が完了しました`);

        // 検証画像を添付してください
        // 特定のファイル形式のみ許可
        //  - 画像
        // ファイルの最大数 1
        // 最大ファイルサイズ 10MB

        Debug.log(`一括報告フォームの構築が完了しました`);
    }
}
