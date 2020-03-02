import * as DataManager from "../../DataManager";
import { DataManagerOperator } from "../Operators/DataManagerOperator";
import { Operator } from "../Operators/Operator";
import { Utility } from "../Utility";
import { createHtmlOutput, getPageUrl, Pager, readHtml, resolveRootUrl, resolveVersionName } from "./Pager";
import { TopPager } from "./TopPager";
import { Role } from "../Role";

interface UnverifiedListByGenrePageParameter {
    send: string;

    // diff_${difficulty}
    // genre_${genre}
}

class Filter {
    private parameter: UnverifiedListByGenrePageParameter;

    public constructor(parameter: UnverifiedListByGenrePageParameter) {
        this.parameter = parameter;
    }

    public enabledDifficulty(difficulty: DataManager.Difficulty): boolean {
        return this.parameter[`diff_${difficulty}`] ? true : false;
    }

    public enabledGenre(genre: string): boolean {
        return this.parameter[`genre_${genre}`] ? true : false;
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
    private static readonly difficulties = [
        DataManager.Difficulty.Basic,
        DataManager.Difficulty.Advanced,
        DataManager.Difficulty.Expert,
        DataManager.Difficulty.Master,
    ];

    public static readonly PAGE_NAME = "unverified_list_genre";

    public static resolvePageUrl(source: string, rootUrl: string, versionName: string): string {
        return source ? source.replace(/%unverifiedListByGenrePageUrl%/g, getPageUrl(rootUrl, this.PAGE_NAME, versionName)) : "";
    }

    public getPageName(): string {
        return UnverifiedListByGenrePager.PAGE_NAME;
    }

    public isAccessable(role: Role): boolean {
        return true;
    }
    
    public call(parameter: UnverifiedListByGenrePageParameter): GoogleAppsScript.HTML.HtmlOutput {
        var source = readHtml(this.getPageName());

        source = resolveRootUrl(source, Operator.getRootUrl());
        source = resolveVersionName(source, Operator.getTargetVersionName());
        source = TopPager.resolvePageUrl(source, Operator.getRootUrl(), Operator.getTargetVersionName());

        let filter = new Filter(parameter);
        source = source.replace(/%difficulty_select_list%/g, this.getDifficultySelectListHtml(filter));
        source = source.replace(/%genre_select_list%/g, this.getGenreSelectListHtml(filter));
        if (parameter.send) {
            source = source.replace(/%list%/g, this.getListHtml(filter));
        }
        else {
            source = source.replace(/%list%/g, "");
        }

        return createHtmlOutput(source);
    }

    private getDifficultySelectListHtml(filter: Filter): string {
        var listHtml = "";
        let difficulties = UnverifiedListByGenrePager.difficulties;
        for (var i = 0; i < difficulties.length; i++) {
            listHtml += this.getDifficultySelectListItemHtml(difficulties[i], filter) + "\n";
        }
        return listHtml;
    }

    private getDifficultySelectListItemHtml(difficulty: DataManager.Difficulty, filter: Filter): string {
        let checked = filter.enabledDifficulty(difficulty) ? "checked" : "";
        return `<div><input type="checkbox" name="diff_${difficulty}" value="1" ${checked}>${Utility.toDifficultyText(difficulty)}</div>`;
    }

    private getGenreSelectListHtml(filter: Filter): string {
        var listHtml = "";
        let genres = DataManagerOperator.getGenres();
        for (var i = 0; i < genres.length; i++) {
            listHtml += this.getGenreSelectListItemHtml(genres[i], filter) + "\n";
        }
        return listHtml;
    }

    private getGenreSelectListItemHtml(genre: string, filter: Filter): string {
        let checked = filter.enabledGenre(genre) ? "checked" : "";
        return `<div><div><input type="checkbox" name="genre_${genre}" value="1" ${checked}>${genre}</div></div>`;
    }

    private getListHtml(filter: Filter): string {
        let genres = DataManagerOperator.getGenres();
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
        let difficulties = UnverifiedListByGenrePager.difficulties;
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