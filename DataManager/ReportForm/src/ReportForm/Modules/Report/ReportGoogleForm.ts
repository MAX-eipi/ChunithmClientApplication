import { ConfigurationPropertyName } from "../../../Configurations/ConfigurationDefinition";
import { MusicDataTable } from "../../../MusicDataTable/MusicDataTable";
import { Debug } from "../../Debug";
import { ReportFormModule } from "../@ReportFormModule";
import { MusicDataModule } from "../MusicDataModule";
import { VersionModule } from "../VersionModule";

export class ReportGoogleForm {
    public constructor(private readonly _module: ReportFormModule) {
    }

    private _form: GoogleAppsScript.Forms.Form;
    public get form(): GoogleAppsScript.Forms.Form {
        if (!this._form) {
            const formId = this._module.config.report.reportFormId;
            if (!formId) {
                throw new Error(`${ConfigurationPropertyName.REPORT_GOOGLE_FORM_ID} is not set.`);
            }
            const form = FormApp.openById(formId);
            if (!form) {
                throw new Error(`Form is invalid. formId: ${formId}`);
            }
            this._form = form;
        }
        return this._form;
    }

    public buildForm(versionName: string): void {
        Debug.log(`報告フォームを構築します: ${versionName}`);
        Debug.log('フォームに送信された回答の削除...');
        const form = this.form;
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
        const musicSelectPages: {
            [key: string]: GoogleAppsScript.Forms.PageBreakItem;
        } = {};
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
    private buildGenreSelect(genreSelect: GoogleAppsScript.Forms.ListItem, genres: string[], musicSelectPages: {
        [key: string]: GoogleAppsScript.Forms.PageBreakItem;
    }): void {
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
