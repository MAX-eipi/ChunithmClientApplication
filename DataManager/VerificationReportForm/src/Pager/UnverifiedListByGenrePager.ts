import * as DataManager from "../../DataManager";
import { DataManagerOperator } from "../Operators/DataManagerOperator";
import { Operator } from "../Operators/Operator";
import { Utility } from "../Utility";
import { createHtmlOutput, getPageUrl, Pager, readHtml, resolveRootUrl, resolveVersionName } from "./Pager";
import { TopPager } from "./TopPager";

interface UnverifiedListByGenrePageParameter {
    difficulty: string;
    diff_bas: string;
    diff_adv: string;
    diff_exp: string;
    diff_mas: string;

    genre_1: string;
    genre_2: string;
    genre_3: string;
    genre_4: string;
    genre_5: string;
    genre_6: string;
    genre_7: string;

    send: string;
}

class Filter {
    private enabledBasic: boolean;
    private enabledAdvanced: boolean;
    private enabledExpert: boolean;
    private enabledMaster: boolean;

    private enabled_POPS_AND_ANIME: boolean;
    private enabled_niconico: boolean;
    private enabled_東方Project: boolean;
    private enabled_VARIETY: boolean;
    private enabled_イロドリミドリ: boolean;
    private enabled_言ノ葉Project: boolean;
    private enabled_ORIGINAL: boolean;

    public constructor(parameter: UnverifiedListByGenrePageParameter) {
        this.enabledBasic = parameter.diff_bas ? true : false;
        this.enabledAdvanced = parameter.diff_adv ? true : false;
        this.enabledExpert = parameter.diff_exp ? true : false;
        this.enabledMaster = parameter.diff_mas ? true : false;

        this.enabled_POPS_AND_ANIME = parameter.genre_1 ? true : false;
        this.enabled_niconico = parameter.genre_2 ? true : false;
        this.enabled_東方Project = parameter.genre_3 ? true : false;
        this.enabled_VARIETY = parameter.genre_4 ? true : false;
        this.enabled_イロドリミドリ = parameter.genre_5 ? true : false;
        this.enabled_言ノ葉Project = parameter.genre_6 ? true : false;
        this.enabled_ORIGINAL = parameter.genre_7 ? true : false;
    }

    public enabledDifficulty(difficulty: DataManager.Difficulty): boolean {
        switch (difficulty) {
            case DataManager.Difficulty.Basic:
                return this.enabledBasic;
            case DataManager.Difficulty.Advanced:
                return this.enabledAdvanced;
            case DataManager.Difficulty.Expert:
                return this.enabledExpert;
            case DataManager.Difficulty.Master:
                return this.enabledMaster;
        }
        return false;
    }

    public enabledGenre(genre: string): boolean {
        switch (genre) {
            case "POPS & ANIME":
                return this.enabled_POPS_AND_ANIME;
            case "niconico":
                return this.enabled_niconico;
            case "東方Project":
                return this.enabled_東方Project;
            case "VARIETY":
                return this.enabled_VARIETY;
            case "イロドリミドリ":
                return this.enabled_イロドリミドリ;
            case "言ノ葉Project":
                return this.enabled_言ノ葉Project;
            case "ORIGINAL":
                return this.enabled_ORIGINAL;
        }
        return false;
    }
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

export class UnverifiedListByGenrePager implements Pager {
    public static readonly PAGE_NAME = "unverified_list_genre";

    public static resolvePageUrl(source: string, rootUrl: string, versionName: string): string {
        return source ? source.replace(/%unverifiedListByGenrePageUrl%/g, getPageUrl(rootUrl, this.PAGE_NAME, versionName)) : "";
    }

    public getPageName(): string {
        return UnverifiedListByGenrePager.PAGE_NAME;
    }
    public call(parameter: UnverifiedListByGenrePageParameter): GoogleAppsScript.HTML.HtmlOutput {
        let filter = new Filter(parameter);

        var source = readHtml(this.getPageName());

        source = resolveRootUrl(source, Operator.getRootUrl());
        source = resolveVersionName(source, Operator.getTargetVersionName());
        source = TopPager.resolvePageUrl(source, Operator.getRootUrl(), Operator.getTargetVersionName());

        if (parameter.send) {
            source = source.replace(/%checked_basic%/g, filter.enabledDifficulty(DataManager.Difficulty.Basic) ? "checked" : "");
            source = source.replace(/%checked_advanced%/g, filter.enabledDifficulty(DataManager.Difficulty.Advanced) ? "checked" : "");
            source = source.replace(/%checked_expert%/g, filter.enabledDifficulty(DataManager.Difficulty.Expert) ? "checked" : "");
            source = source.replace(/%checked_master%/g, filter.enabledDifficulty(DataManager.Difficulty.Master) ? "checked" : "");

            source = source.replace(/%checked_genre_1%/g, filter.enabledGenre("POPS & ANIME") ? "checked" : "");
            source = source.replace(/%checked_genre_2%/g, filter.enabledGenre("niconico") ? "checked" : "");
            source = source.replace(/%checked_genre_3%/g, filter.enabledGenre("東方Project") ? "checked" : "");
            source = source.replace(/%checked_genre_4%/g, filter.enabledGenre("VARIETY") ? "checked" : "");
            source = source.replace(/%checked_genre_5%/g, filter.enabledGenre("イロドリミドリ") ? "checked" : "");
            source = source.replace(/%checked_genre_6%/g, filter.enabledGenre("言ノ葉Project") ? "checked" : "");
            source = source.replace(/%checked_genre_7%/g, filter.enabledGenre("ORIGINAL") ? "checked" : "");

            source = source.replace(/%list%/g, this.getListHtml(filter));
        }
        else {
            source = source.replace(/%checked_basic%/g, "");
            source = source.replace(/%checked_advanced%/g, "");
            source = source.replace(/%checked_expert%/g, "");
            source = source.replace(/%checked_master%/g, "");

            source = source.replace(/%checked_genre_1%/g, "checked");
            source = source.replace(/%checked_genre_2%/g, "checked");
            source = source.replace(/%checked_genre_3%/g, "checked");
            source = source.replace(/%checked_genre_4%/g, "checked");
            source = source.replace(/%checked_genre_5%/g, "checked");
            source = source.replace(/%checked_genre_6%/g, "checked");
            source = source.replace(/%checked_genre_7%/g, "checked");
            source = source.replace(/%checked_genre_8%/g, "checked");

            source = source.replace(/%list%/g, "");
        }

        return createHtmlOutput(source);
    }

    private getListHtml(filter: Filter): string {
        let genres = [
            "POPS & ANIME",
            "niconico",
            "東方Project",
            "VARIETY",
            "イロドリミドリ",
            "言ノ葉Project",
            "ORIGINAL",
        ];
        let self = this;
        let unverifiedMusicDatas = this.getUnverifiedMusicDatas();
        let genreListHtmls = genres.map(function (g) { return self.getGenreListHtml(unverifiedMusicDatas, g, filter); });
        var listHtml = "";
        for (var i = 0; i < genreListHtmls.length; i++) {
            listHtml += genreListHtmls[i] + "\n";
        }
        return listHtml;
    }

    private getGenreListHtml(musicDatas: MusicData[], genre: string, filter): string {
        if (!filter.enabledGenre(genre)) {
            return "";
        }
        var filteredMusicDatas = this.filterByGenre(musicDatas, genre, filter);
        filteredMusicDatas = this.filterByDifficulty(filteredMusicDatas, filter);
        var html = "";
        for (var i = 0; i < filteredMusicDatas.length; i++) {
            html += this.getListItemHtml(filteredMusicDatas[i]);
        }

        return `
<div class='box_2'>
    <div class='box_2_title'>${genre}</div>
    ${html}
</div>`;
    }

    private getListItemHtml(musicData: MusicData): string {
        return `<div class='music_list bg_${Utility.toDifficultyTextLowerCase(musicData.difficulty)}'>${musicData.name}</div>\n`;
    }

    private filterByDifficulty(musicDatas: MusicData[], filter: Filter): MusicData[] {
        if (!musicDatas || musicDatas.length == 0) {
            return [];
        }
        return musicDatas.filter(function (d) { return filter.enabledDifficulty(d.difficulty); });
    }

    private filterByGenre(musicDatas: MusicData[], genre: string, filter: Filter): MusicData[] {
        if (!musicDatas || musicDatas.length == 0) {
            return [];
        }
        if (!filter.enabledGenre(genre)) {
            return [];
        }
        return musicDatas.filter(function (d) { return d.genre == genre; });
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