import { ConfigurationPropertyName } from "../../../Configurations/ConfigurationDefinition";
import { ReportFormModule } from "../@ReportFormModule";
import { GoogleFormReport } from "../../Report/GoogleFormReport";
import { IReport } from "../../Report/IReport";
import { Debug } from "../../Debug";
import { Utility } from "../../Utility";
import { MusicDataModule } from "../MusicDataModule";
import { ReportModule } from "./ReportModule";
import { PostLocation } from "../../Report/ReportStorage";
import { VersionModule } from "../VersionModule";
import { MusicDataTable } from "../../../MusicDataTable/MusicDataTable";

export class GoogleFormReportModule {
    public constructor(private readonly _module: ReportFormModule) {
    }

    private _reportGoogleForm: GoogleAppsScript.Forms.Form;
    public get reportGoogleForm(): GoogleAppsScript.Forms.Form {
        if (!this._reportGoogleForm) {
            const formId = this._module.config.report.reportFormId;
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

    public insertReport(versionName: string, formReport: GoogleFormReport): IReport {
        const table = this._module.getModule(MusicDataModule).getTable(versionName);

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

        return this._module.getModule(ReportModule)
            .getReportStorage(versionName)
            .push(formReport, PostLocation.GoogleForm, formReport.imagePaths);
    }

    public buildForm(versionName: string): void {
        Debug.log(`報告フォームを構築します: ${versionName}`);

        Debug.log('フォームに送信された回答の削除...');
        const form = this._module.getModule(ReportModule).reportGoogleForm;
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
        const table = this._module.getModule(MusicDataModule).getTable(versionName);
        const genres = this._module.getModule(VersionModule).getVersionConfig(versionName).genres;
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
}
