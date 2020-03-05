import * as DataManager from "../../DataManager";
import { DataManagerOperator } from "../Operators/DataManagerOperator";
import { Operator } from "../Operators/Operator";
import { Utility } from "../Utility";
import { createHtmlOutput, getPageUrl, Pager, readHtml, resolveRootUrl, resolveVersionName } from "./Pager";
import { TopPager } from "./TopPager";
import { Role } from "../Role";

let levelTexts = [
    '1', '2', '3', '4', '5', '6', '7', '7p', '8', '8p', '9', '9p', '10', '10p', '11', '11p', '12', '12p', '13', '13p', '14',
];

interface UnverifiedListByLevelPageParameter {
    difficulty: string;
    diff_bas: string;
    diff_adv: string;
    diff_exp: string;
    diff_mas: string;

    // level_xp? : string

    send: string;
}

function enabledDifficulty(parameter: UnverifiedListByLevelPageParameter, difficulty: DataManager.Difficulty): boolean {
    switch (difficulty) {
        case DataManager.Difficulty.Basic:
            return parameter.diff_bas ? true : false;
        case DataManager.Difficulty.Advanced:
            return parameter.diff_adv ? true : false;
        case DataManager.Difficulty.Expert:
            return parameter.diff_exp ? true : false;
        case DataManager.Difficulty.Master:
            return parameter.diff_mas ? true : false;
    }
}

function enabledLevel(parameter: UnverifiedListByLevelPageParameter, levelText: string): boolean {
    return parameter[`level_${levelText}`] ? true : false;
}

class MusicData {
    public name: string;
    public difficulty: DataManager.Difficulty;
    public genre: string;
    public level: number;

    public setByMusicData(musicData: DataManager.MusicData, difficulty: DataManager.Difficulty): void {
        this.name = musicData.Name;
        this.difficulty = difficulty;
        this.genre = musicData.Genre;
        this.level = musicData.getLevel(difficulty);
    }
}

export class UnverifiedListByLevelPager implements Pager {
    public static readonly PAGE_NAME = "unverified_list_level";

    public static resolvePageUrl(source: string, rootUrl: string, versionName: string): string {
        return source ? source.replace(/%unverifiedListByLevelPageUrl%/g, getPageUrl(rootUrl, this.PAGE_NAME, versionName)) : "";
    }

    public getPageName() {
        return UnverifiedListByLevelPager.PAGE_NAME;
    }

    public isAccessable(role: Role): boolean {
        return true;
    }

    public call(parameter: UnverifiedListByLevelPageParameter): GoogleAppsScript.HTML.HtmlOutput {
        var source = readHtml(this.getPageName());

        source = resolveRootUrl(source, Operator.getRootUrl());
        source = resolveVersionName(source, Operator.getTargetVersionName());
        source = TopPager.resolvePageUrl(source, Operator.getRootUrl(), Operator.getTargetVersionName());

        if (parameter.send) {
            source = source.replace(/%checked_basic%/g, enabledDifficulty(parameter, DataManager.Difficulty.Basic) ? "checked" : "");
            source = source.replace(/%checked_advanced%/g, enabledDifficulty(parameter, DataManager.Difficulty.Advanced) ? "checked" : "");
            source = source.replace(/%checked_expert%/g, enabledDifficulty(parameter, DataManager.Difficulty.Expert) ? "checked" : "");
            source = source.replace(/%checked_master%/g, enabledDifficulty(parameter, DataManager.Difficulty.Master) ? "checked" : "");

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

        return createHtmlOutput(source);
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
        let unverifiedMusicDatas = this.getUnverifiedMusicDatas();
        let levelListHtmls = levelTexts.map(function (lt) { return self.getLevelListHtml(unverifiedMusicDatas, lt, parameter); });
        var listHtml = "";
        for (var i = 0; i < levelListHtmls.length; i++) {
            listHtml += levelListHtmls[i] + "\n";
        }
        return listHtml;
    }

    private getLevelListHtml(musicDatas: MusicData[], levelText: string, parameter: UnverifiedListByLevelPageParameter): string {
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

    private getListItemHtml(musicData: MusicData): string {
        return `<div class='music_list bg_${Utility.toDifficultyTextLowerCase(musicData.difficulty)}'>${musicData.name}</div>\n`;
    }

    private filterByDifficulty(musicDatas: MusicData[], parameter: UnverifiedListByLevelPageParameter): MusicData[] {
        if (!musicDatas || musicDatas.length == 0) {
            return [];
        }
        return musicDatas.filter(function (d) { return enabledDifficulty(parameter, d.difficulty); });
    }

    private filterByLevel(musicDatas: MusicData[], levelText: string, parameter: UnverifiedListByLevelPageParameter): MusicData[] {
        if (!musicDatas || musicDatas.length == 0) {
            return [];
        }
        if (!enabledLevel(parameter, levelText)) {
            return [];
        }
        levelText = levelText.replace(/p/g, ".7");
        return musicDatas.filter(function (d) { return d.level.toString() == levelText; });
    }

    private getUnverifiedMusicDatas(): MusicData[] {
        let musicDatas = DataManagerOperator.getMusicDatas();
        let unverifiedMusicDatas: MusicData[] = new Array();
        let difficulties = [
            DataManager.Difficulty.Basic,
            DataManager.Difficulty.Advanced,
            DataManager.Difficulty.Expert,
            DataManager.Difficulty.Master,
        ];
        for (var i = 0; i < musicDatas.length; i++) {
            for (var j = 0; j < difficulties.length; j++) {
                let difficulty = difficulties[j];
                if (!musicDatas[i].getVerified(difficulty)) {
                    let musicData = new MusicData();
                    musicData.setByMusicData(musicDatas[i], difficulty);
                    unverifiedMusicDatas.push(musicData);
                }
            }
        }
        return unverifiedMusicDatas;
    }
}