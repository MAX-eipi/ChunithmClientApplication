import { Difficulty } from "../../MusicDataTable/Difficulty";
import { MusicData } from "../../MusicDataTable/MusicData";
import { Utility } from "../Utility";
import { ReportFormPage, ReportFormPageParameter } from "./@ReportFormPage";
import { TopPage } from "./TopPage";

let levelTexts = [
    '1', '2', '3', '4', '5', '6', '7', '7p', '8', '8p', '9', '9p', '10', '10p', '11', '11p', '12', '12p', '13', '13p', '14',
];

interface UnverifiedListByLevelPageParameter extends ReportFormPageParameter {
    difficulty: string;
    diff_bas: string;
    diff_adv: string;
    diff_exp: string;
    diff_mas: string;

    // level_xp? : string

    send: string;
}

function enabledDifficulty(parameter: UnverifiedListByLevelPageParameter, difficulty: Difficulty): boolean {
    switch (difficulty) {
        case Difficulty.Basic:
            return parameter.diff_bas ? true : false;
        case Difficulty.Advanced:
            return parameter.diff_adv ? true : false;
        case Difficulty.Expert:
            return parameter.diff_exp ? true : false;
        case Difficulty.Master:
            return parameter.diff_mas ? true : false;
    }
}

function enabledLevel(parameter: UnverifiedListByLevelPageParameter, levelText: string): boolean {
    return parameter[`level_${levelText}`] ? true : false;
}

class ListItemMusicData {
    public name: string;
    public difficulty: Difficulty;
    public genre: string;
    public level: number;

    public setByMusicData(musicData: MusicData, difficulty: Difficulty): void {
        this.name = musicData.Name;
        this.difficulty = difficulty;
        this.genre = musicData.Genre;
        this.level = musicData.getLevel(difficulty);
    }
}

export class UnverifiedListByLevelPage extends ReportFormPage {
    public static readonly PAGE_NAME: string = "unverified_list_level";
    public getPageName(): string {
        return UnverifiedListByLevelPage.PAGE_NAME;
    }
    public call(parameter: UnverifiedListByLevelPageParameter): GoogleAppsScript.HTML.HtmlOutput {
        var source = this.readMainHtml();

        source = this.module.router.bindRoot(source);
        source = this.bind(TopPage, parameter, source);

        source = this.resolveVersionName(source, parameter.versionName);

        if (parameter.send) {
            source = source.replace(/%checked_basic%/g, enabledDifficulty(parameter, Difficulty.Basic) ? "checked" : "");
            source = source.replace(/%checked_advanced%/g, enabledDifficulty(parameter, Difficulty.Advanced) ? "checked" : "");
            source = source.replace(/%checked_expert%/g, enabledDifficulty(parameter, Difficulty.Expert) ? "checked" : "");
            source = source.replace(/%checked_master%/g, enabledDifficulty(parameter, Difficulty.Master) ? "checked" : "");

            source = source.replace(/%levelList%/g, this.getSelectLevelListHtml(parameter));

            source = source.replace(/%list%/g, this.getListHtml(parameter));
        }
        else {
            source = source.replace(/%checked_basic%/g, "");
            source = source.replace(/%checked_advanced%/g, "");
            source = source.replace(/%checked_expert%/g, "");
            source = source.replace(/%checked_master%/g, "");

            source = source.replace(/%levelList%/, this.getSelectLevelListHtml(parameter));

            source = source.replace(/%list%/g, "");
        }

        return this.createHtmlOutput(source);
    }

    private getSelectLevelListHtml(parameter: UnverifiedListByLevelPageParameter): string {
        let self = this;
        if (parameter.send) {
            return levelTexts
                .map(function (lt) { return self.getSelectLevelListItemHtml(lt, enabledLevel(parameter, lt)); })
                .reduce(function (acc, src) { return `${acc}\n${src}`; }, "");
        }
        else {
            return levelTexts
                .map(function (lt) { return self.getSelectLevelListItemHtml(lt, false); })
                .reduce(function (acc, src) { return `${acc}\n${src}`; }, "");
        }
    }

    private getSelectLevelListItemHtml(levelText: string, checked: boolean): string {
        return `<div><input type="checkbox" name="level_${levelText}" value="1" ${checked ? "checked" : ""}>Lv.${levelText.replace("p", "+")}</div>`;
    }

    private getListHtml(parameter: UnverifiedListByLevelPageParameter): string {
        let self = this;
        let unverifiedMusicDatas = this.getUnverifiedMusicDatas(parameter.versionName);
        let levelListHtmls = levelTexts.map(function (lt) { return self.getLevelListHtml(unverifiedMusicDatas, lt, parameter); });
        var listHtml = "";
        for (var i = 0; i < levelListHtmls.length; i++) {
            listHtml += levelListHtmls[i] + "\n";
        }
        return listHtml;
    }

    private getLevelListHtml(musicDatas: ListItemMusicData[], levelText: string, parameter: UnverifiedListByLevelPageParameter): string {
        if (!enabledLevel(parameter, levelText)) {
            return "";
        }
        var filteredMusicDatas = this.filterByLevel(musicDatas, levelText, parameter);
        filteredMusicDatas = this.filterByDifficulty(filteredMusicDatas, parameter);
        var html = "";
        for (var i = 0; i < filteredMusicDatas.length; i++) {
            html += this.getListItemHtml(filteredMusicDatas[i]);
        }

        return `
<div class='box_2'>
    <div class='box_2_title'>Lv.${levelText.replace("p", "+")}</div>
    ${html}
</div>`
    }

    private getListItemHtml(musicData: ListItemMusicData): string {
        return `<div class='music_list bg_${Utility.toDifficultyTextLowerCase(musicData.difficulty)}'>${musicData.name}</div>\n`;
    }

    private filterByDifficulty(musicDatas: ListItemMusicData[], parameter: UnverifiedListByLevelPageParameter): ListItemMusicData[] {
        if (!musicDatas || musicDatas.length == 0) {
            return [];
        }
        return musicDatas.filter(function (d) { return enabledDifficulty(parameter, d.difficulty); });
    }

    private filterByLevel(musicDatas: ListItemMusicData[], levelText: string, parameter: UnverifiedListByLevelPageParameter): ListItemMusicData[] {
        if (!musicDatas || musicDatas.length == 0) {
            return [];
        }
        if (!enabledLevel(parameter, levelText)) {
            return [];
        }
        levelText = levelText.replace(/p/g, ".7");
        return musicDatas.filter(function (d) { return d.level.toString() == levelText; });
    }

    private getUnverifiedMusicDatas(versionName: string): ListItemMusicData[] {
        let musicDatas = this.module.musicData.getTable(versionName).datas;
        let unverifiedMusicDatas: ListItemMusicData[] = new Array();
        let difficulties = [
            Difficulty.Basic,
            Difficulty.Advanced,
            Difficulty.Expert,
            Difficulty.Master,
        ];
        for (var i = 0; i < musicDatas.length; i++) {
            for (var j = 0; j < difficulties.length; j++) {
                let difficulty = difficulties[j];
                if (!musicDatas[i].getVerified(difficulty)) {
                    let musicData = new ListItemMusicData();
                    musicData.setByMusicData(musicDatas[i], difficulty);
                    unverifiedMusicDatas.push(musicData);
                }
            }
        }
        return unverifiedMusicDatas;
    }
}