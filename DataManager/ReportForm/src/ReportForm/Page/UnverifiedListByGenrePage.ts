import { Difficulty } from "../../MusicDataTable/Difficulty";
import { MusicData } from "../../MusicDataTable/MusicData";
import { Utility } from "../Utility";
import { ReportFormPage, ReportFormPageParameter } from "./@ReportFormPage";
import { TopPage } from "./TopPage";
import { VersionModule } from "../Modules/VersionModule";
import { MusicDataModule } from "../Modules/MusicDataModule";
import { Router } from "../Modules/Router";

interface UnverifiedListByGenrePageParameter extends ReportFormPageParameter {
    send: string;

    // diff_${difficulty}
    // genre_${genre}
}

class Filter {
    private parameter: UnverifiedListByGenrePageParameter;

    public constructor(parameter: UnverifiedListByGenrePageParameter) {
        this.parameter = parameter;
    }

    public enabledDifficulty(difficulty: Difficulty): boolean {
        return this.parameter[`diff_${difficulty}`] ? true : false;
    }

    public enabledGenre(genre: string): boolean {
        return this.parameter[`genre_${genre}`] ? true : false;
    }
}

export class ListItemMusicData {
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

export class UnverifiedListByGenrePage extends ReportFormPage {
    private static readonly difficulties = [
        Difficulty.Basic,
        Difficulty.Advanced,
        Difficulty.Expert,
        Difficulty.Master,
    ];

    public static readonly PAGE_NAME = "unverified_list_genre";

    private get router(): Router { return this.module.getModule(Router); }
    private get versionModule(): VersionModule { return this.module.getModule(VersionModule); }
    private get musicDataModule(): MusicDataModule { return this.module.getModule(MusicDataModule); }

    public get pageName(): string {
        return UnverifiedListByGenrePage.PAGE_NAME;
    }

    public call(parameter: UnverifiedListByGenrePageParameter): GoogleAppsScript.HTML.HtmlOutput {
        var source = this.readMainHtml();

        source = this.router.bindRoot(source);
        source = this.bind(TopPage, parameter, source);
        source = this.resolveVersionName(source, parameter.versionName);

        let filter = new Filter(parameter);
        let genres = this.versionModule.getVersionConfig(parameter.versionName).genres;
        source = source.replace(/%difficulty_select_list%/g, this.getDifficultySelectListHtml(filter));
        source = source.replace(/%genre_select_list%/g, this.getGenreSelectListHtml(filter, genres));
        if (parameter.send) {
            let musicDatas = this.musicDataModule.getTable(parameter.versionName).datas;
            let listItemDatas = this.getUnverifiedMusicDatas(musicDatas);
            source = source.replace(/%list%/g, this.getListHtml(filter, genres, listItemDatas));
        }
        else {
            source = source.replace(/%list%/g, "");
        }

        return this.createHtmlOutput(source);
    }

    private getDifficultySelectListHtml(filter: Filter): string {
        var listHtml = "";
        let difficulties = UnverifiedListByGenrePage.difficulties;
        for (var i = 0; i < difficulties.length; i++) {
            listHtml += this.getDifficultySelectListItemHtml(difficulties[i], filter) + "\n";
        }
        return listHtml;
    }

    private getDifficultySelectListItemHtml(difficulty: Difficulty, filter: Filter): string {
        let checked = filter.enabledDifficulty(difficulty) ? "checked" : "";
        return `<div><input type="checkbox" name="diff_${difficulty}" value="1" ${checked}>${Utility.toDifficultyText(difficulty)}</div>`;
    }

    private getGenreSelectListHtml(filter: Filter, genres: string[]): string {
        var listHtml = "";
        for (var i = 0; i < genres.length; i++) {
            listHtml += this.getGenreSelectListItemHtml(genres[i], filter) + "\n";
        }
        return listHtml;
    }

    private getGenreSelectListItemHtml(genre: string, filter: Filter): string {
        let checked = filter.enabledGenre(genre) ? "checked" : "";
        return `<div><div><input type="checkbox" name="genre_${genre}" value="1" ${checked}>${genre}</div></div>`;
    }

    private getListHtml(filter: Filter, genres: string[], unverifiedMusicDatas: ListItemMusicData[]): string {
        let self = this;
        let genreListHtmls = genres.map(function (g) { return self.getGenreListHtml(unverifiedMusicDatas, g, filter); });
        var listHtml = "";
        for (var i = 0; i < genreListHtmls.length; i++) {
            listHtml += genreListHtmls[i] + "\n";
        }
        return listHtml;
    }

    private getGenreListHtml(musicDatas: ListItemMusicData[], genre: string, filter): string {
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

    private getListItemHtml(musicData: ListItemMusicData): string {
        return `<div class='music_list bg_${Utility.toDifficultyTextLowerCase(musicData.difficulty)}'>${musicData.name}</div>\n`;
    }

    private filterByDifficulty(musicDatas: ListItemMusicData[], filter: Filter): ListItemMusicData[] {
        if (!musicDatas || musicDatas.length == 0) {
            return [];
        }
        return musicDatas.filter(function (d) { return filter.enabledDifficulty(d.difficulty); });
    }

    private filterByGenre(musicDatas: ListItemMusicData[], genre: string, filter: Filter): ListItemMusicData[] {
        if (!musicDatas || musicDatas.length == 0) {
            return [];
        }
        if (!filter.enabledGenre(genre)) {
            return [];
        }
        return musicDatas.filter(function (d) { return d.genre == genre; });
    }

    private getUnverifiedMusicDatas(musicDatas: MusicData[]): ListItemMusicData[] {
        let unverifiedMusicDatas: ListItemMusicData[] = new Array();
        let difficulties = UnverifiedListByGenrePage.difficulties;
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
