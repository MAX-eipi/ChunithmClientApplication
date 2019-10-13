import { DefaultParameter, parseScore, Difficulty, Rank, toRank, ComboStatus, ChainStatus, WorldsEndType, toWorldsEndType } from "./Utility";

export class HtmlParseUtility {
    public static getPageTitle(document: Document): string {
        if (!document) { return ""; }
        let e1 = document.getElementById("page_title");
        if (!e1) { return ""; }
        return e1.textContent;
    }

    public static getMusicTitle(content: Element): string {
        let e1 = content.getElementsByClassName("music_title");
        if (!e1 || !e1[0]) { return DefaultParameter.musicName; }
        let e2 = e1[0];
        return e2.textContent;
    }

    public static getPlayMusicDataTitle(content: Element): string {
        let e1 = content.getElementsByClassName("play_musicdata_title");
        if (!e1 || !e1[0]) { return DefaultParameter.musicName; }
        let e2 = e1[0];
        return e2.textContent;
    }

    public static getMusicId(content: Element): number;
    public static getMusicId(content: Element, className: string);
    public static getMusicId(content: Element, className?: string): number {
        if (!className) {
            let e1 = content.getElementsByTagName("input");
            if (!e1) { return DefaultParameter.id; }
            for (var i = 0; i < e1.length; i++) {
                if (e1[i] && e1[i].getAttribute("name") == "idx") {
                    var idText = e1[i].getAttribute("value");
                    var id = parseInt(idText);
                    return id ? id : DefaultParameter.id;
                }
            }
            return DefaultParameter.id;
        }
        else {
            let e1 = content.getElementsByClassName(className);
            if (!e1 || !e1[0]) { return DefaultParameter.id; }
            let e2 = e1[0];
            let onclick = e2.getAttribute("onclick");
            if (!onclick) { return DefaultParameter.id; }

            let match = onclick.match(/musicId_(\d+)/);
            if (!match || !match[1]) { return DefaultParameter.id }
            let id = parseInt(match[1]);
            if (!id && id !== 0) { return DefaultParameter.id; }
            return id;
        }
    }

    public static getWorldsEndMusicId(content: Element): number {
        return HtmlParseUtility.getMusicId(content, "musiclist_worldsend_title");
    }

    public static getPlayMusicDataHighScore(content: Element): number {
        let e1 = content.querySelector(".play_musicdata_highscore > .text_b");
        let scoreText = e1 ? e1.textContent : null;
        return parseScore(scoreText);
    }

    public static getPlayMusicDataScore(content: Element): number {
        let e1 = content.getElementsByClassName("play_musicdata_score_text");
        let e2 = e1 ? e1[0] : null;
        let scoreText = e2 ? e2.textContent.replace("Score：", "") : null;
        return parseScore(scoreText);
    }

    public static getScoreFromMusicDetail(content: Element): number {
        let e1 = content.getElementsByClassName("block_underline");
        let e2 = e1 ? e1[0] : null;
        let e3 = e2 ? e2.getElementsByTagName("span") : null;
        let e4 = e3 ? e3[1] : null;
        let scoreText = e4 ? e4.textContent : null;
        return parseScore(scoreText);
    }

    public static getDifficulty(content: Element): Difficulty {
        if (content.className.indexOf("master") !== -1) {
            return Difficulty.Master;
        }
        else if (content.className.indexOf("expert") !== -1) {
            return Difficulty.Expert;
        }
        else if (content.className.indexOf("advanced") !== -1) {
            return Difficulty.Advanced;
        }
        else if (content.className.indexOf("basic") !== -1) {
            return Difficulty.Basic;
        }
        else if (content.className.indexOf("world_end") !== -1) {
            return Difficulty.WorldsEnd;
        }
        return DefaultParameter.difficulty;
    }

    public static getDifficultyFromPlayTrackResult(content: Element): Difficulty {
        let e1 = content.getElementsByClassName("play_track_result");
        let e2 = e1 ? e1[0] : null;
        let e3 = e2 ? e2.getElementsByTagName("img") : null;
        let e4 = e3 ? e3[0] : null;
        let difficultyText = e4 ? e4.getAttribute("src") : null;

        if (!difficultyText) {
            return DefaultParameter.difficulty;
        }

        if (difficultyText.indexOf("basic") !== -1) {
            return Difficulty.Basic;
        }
        else if (difficultyText.indexOf("advanced") !== -1) {
            return Difficulty.Advanced;
        }
        else if (difficultyText.indexOf("expert") !== -1) {
            return Difficulty.Expert;
        }
        else if (difficultyText.indexOf("master") !== -1) {
            return Difficulty.Master;
        }
        else if (difficultyText.indexOf("worldsend") !== -1) {
            return Difficulty.WorldsEnd;
        }
        return DefaultParameter.difficulty;
    }

    public static getIsNewRecord(content: Element): boolean {
        let e1 = content.getElementsByClassName("play_musicdata_score_img");
        let scoreImage = e1 ? e1[0] : null;
        let e2 = scoreImage ? scoreImage.getElementsByTagName("img") : null;
        let e3 = e2 ? e2[0] : null;
        let newRecord = e3 ? e3.getAttribute("src") : null;
        if (!newRecord) {
            return DefaultParameter.isNewRecord;
        }
        return newRecord.indexOf("icon_newrecord") !== -1;
    }

    public static getRank(content: Element): Rank {
        let playMusicDataIcons = HtmlParseUtility.getPlayMusicDataIcons(content);
        for (var i = 0; i < playMusicDataIcons.length; i++) {
            let icon = playMusicDataIcons[i];
            if (icon.indexOf("icon_rank") !== -1) {
                let match = icon.match(/icon_rank_(\d+).png/);
                let rankCode = (match && match[1]) ? parseInt(match[1]) : null;
                return toRank(rankCode);
            }
        }
        return DefaultParameter.rank;
    }

    public static getIsClear(content: Element): boolean {
        let playMusicDataIcons = HtmlParseUtility.getPlayMusicDataIcons(content);
        for (var i = 0; i < playMusicDataIcons.length; i++) {
            let icon = playMusicDataIcons[i];
            if (icon.indexOf("clear") !== -1) {
                return true;
            }
        }
        return DefaultParameter.isClear;
    }

    public static getComboStatus(content: Element): ComboStatus {
        let playMusicDataIcons = HtmlParseUtility.getPlayMusicDataIcons(content);
        for (var i = 0; i < playMusicDataIcons.length; i++) {
            let icon = playMusicDataIcons[i];
            if (icon.indexOf("alljustice") !== -1) {
                return ComboStatus.AllJustice;
            }
            else if (icon.indexOf("fullcombo") !== -1) {
                return ComboStatus.FullCombo;
            }
        }
        return DefaultParameter.comboStatus;
    }

    public static getChainStatus(content: Element): ChainStatus {
        let playMusicDataIcons = HtmlParseUtility.getPlayMusicDataIcons(content);
        for (var i = 0; i < playMusicDataIcons.length; i++) {
            let icon = playMusicDataIcons[i];
            if (icon.indexOf("fullchain2") !== -1) {
                return ChainStatus.FullChainGold;
            }
            else if (icon.indexOf("fullchain") !== -1) {
                return ChainStatus.FullChainPlatinum;
            }
        }
        return DefaultParameter.chainStatus;
    }

    private static getPlayMusicDataIcons(content: Element): string[] {
        var e1 = content.getElementsByClassName("play_musicdata_icon");
        var e2 = e1 ? e1[0] : null;
        var e3 = e2 ? e2.getElementsByTagName("img") : null;
        if (!e3) {
            return new Array();
        }

        var playMusicDataIcons = new Array();
        for (var i = 0; i < e3.length; i++) {
            var icon = e3[i].getAttribute("src");
            if (icon) {
                playMusicDataIcons.push(icon);
            }
        }
        return playMusicDataIcons;
    }

    public static getPlayDataListDate(content: Element): Date {
        return HtmlParseUtility._getPlayDate(content, "play_datalist_date");
    }

    public static getMusicDataDetailDate(content: Element): Date {
        return HtmlParseUtility._getPlayDate(content, "musicdata_detail_date");
    }

    public static getPlayDate(content: Element): Date {
        return HtmlParseUtility._getPlayDate(content, "box_inner01");
    }

    private static _getPlayDate(content: Element, className: string): Date {
        let e1 = content.getElementsByClassName(className);
        let playDateText = (e1 && e1[0]) ? e1[0].textContent : null;
        if (!playDateText) {
            return DefaultParameter.playDate;
        }

        let playDateRegex = /(\d+)\/(\d+)\/(\d+) (\d+):(\d+)/;
        let match = playDateText.match(playDateRegex);
        if (!match) {
            return DefaultParameter.playDate;
        }

        var year = parseInt(match[1]);
        var month = parseInt(match[2]);
        var day = parseInt(match[3]);
        var hour = parseInt(match[4]);
        var minute = parseInt(match[5]);
        if (year !== NaN && month !== NaN && day !== NaN && hour !== NaN && minute !== NaN) {
            return new Date(year, month - 1, day, hour, minute);
        }
        return DefaultParameter.playDate;
    }

    public static getTrack(content: Element): number {
        let e1 = content.getElementsByClassName("play_track_text");
        let trackText = (e1 && e1[0]) ? e1[0].textContent.replace("Track ", "") : null;
        let track = parseInt(trackText);
        if (track === NaN) {
            return DefaultParameter.track
        }
        return track;
    }

    public static getImageName(content: Element): string {
        let e1 = content.getElementsByClassName("play_jacket_img");
        let e2 = (e1 && e1[0]) ? e1[0].getElementsByTagName("img") : null;
        let imageName = (e2 && e2[0]) ? e2[0].getAttribute("src") : null;
        return imageName ? imageName : DefaultParameter.imageName;
    }

    public static getArtistName(content: Element): string {
        let e1 = content.getElementsByClassName("play_musicdata_artist");
        return (e1 && e1[0]) ? e1[0].textContent : DefaultParameter.artistName;
    }

    public static getPlayCount(content: Element): number {
        let e1 = content.getElementsByClassName("block_underline");
        let e2 = (e1 && e1[1]) ? e1[1].getElementsByTagName("span") : null;
        let playCountText = (e2 && e2[1]) ? e2[1].textContent : null;
        let playCount = parseInt(playCountText);
        if (playCount === NaN) {
            return DefaultParameter.playCount;
        }
        return playCount;
    }

    public static getWorldsEndLevelFromHighScoreRecord(content: Element): number {
        return HtmlParseUtility.getWorldsEndLevel(content, "musiclist_worldsend_star");
    }

    public static getWorldsEndLevelFromMusicDetail(content: Element): number {
        return HtmlParseUtility.getWorldsEndLevel(content, "musiclist_worldsend_star2");
    }

    private static getWorldsEndLevel(content: Element, className: string): number {
        let e1 = content.getElementsByClassName(className);
        let e2 = (e1 && e1[0]) ? e1[0].getElementsByTagName("img") : null;
        let starImage = (e2 && e2[0]) ? e2[0].getAttribute("src") : null;

        if (!starImage) {
            return DefaultParameter.worldsEndLevel;
        }

        let match = starImage.match(/icon_we_star(\d+).png/);
        let level = match ? parseInt(match[1]) : NaN;
        return level !== NaN ? level : DefaultParameter.worldsEndLevel;
    }


    private static getWorldsEndType(content: Element, className: string): WorldsEndType {
        let e1 = content.getElementsByClassName(className);
        let e2 = (e1 && e1[0]) ? e1[0].getElementsByTagName("img") : null;
        let typeImage = (e2 && e2[0]) ? e2[0].getAttribute("src") : null;

        if (!typeImage) {
            return DefaultParameter.worldsEndType;
        }

        var match = typeImage.match(/icon_we_(\d+).png/);
        var typeCode = match ? parseInt(match[1]) : NaN;
        return typeCode !== NaN ? toWorldsEndType(typeCode) : DefaultParameter.worldsEndType;
    }
}