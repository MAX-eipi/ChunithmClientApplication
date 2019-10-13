import { HtmlParseUtility } from "./HtmlParseUtility";
import { ChainStatus, ComboStatus, DefaultParameter, Difficulty, Rank, getBorderBaseRating } from "./Utility";

export namespace MusicLevel {
    export class DataUnit {
        public id: number = DefaultParameter.id;
        public name: string = DefaultParameter.musicName;
        public difficulty: Difficulty = DefaultParameter.difficulty;
        public level: number = DefaultParameter.level;
        public score: number = DefaultParameter.score;
        public rank: Rank = DefaultParameter.rank;
        public isClear: boolean = DefaultParameter.isClear;
        public comboStatus: ComboStatus = DefaultParameter.comboStatus;
        public chainStatus: ChainStatus = DefaultParameter.chainStatus;
    }

    export class Data {
        public musicCount: number;
        public clearCount: number;
        public sCount: number;
        public ssCount: number;
        public sssCount: number;
        public fullComboCount: number;
        public allJusticeCount: number;
        public fullChainGoldCount: number;
        public fullChainPlatinumCount: number;

        public units: DataUnit[] = new Array();
    }

    export class Parser {
        public parse(document: Document): Data {
            if (document == null) {
                throw { message: "argument null exception" };
            }

            if (!this.isValidDocument(document)) {
                return null;
            }

            var scoreListResult = document.getElementById("scoreList_result");
            if (scoreListResult == null) {
                return null;
            }

            var musicDetail = document.getElementById("inner");
            if (musicDetail == null) {
                return null;
            }

            var musicLevel = new Data();

            musicLevel.musicCount = this.getMusicCount(scoreListResult);
            musicLevel.clearCount = this.getClearCount(scoreListResult);
            musicLevel.sCount = this.getSCount(scoreListResult);
            musicLevel.ssCount = this.getSsCount(scoreListResult);
            musicLevel.sssCount = this.getSssCount(scoreListResult);
            musicLevel.fullComboCount = this.getFullComboCount(scoreListResult);
            musicLevel.allJusticeCount = this.getAllJusticeCount(scoreListResult);
            musicLevel.fullChainGoldCount = this.getFullChainGoldCount(scoreListResult);
            musicLevel.fullChainPlatinumCount = this.getFullChainPlatinumCount(scoreListResult);
            musicLevel.units = this.getUnits(musicDetail);

            return musicLevel;
        }

        private isValidDocument(document: Document): boolean {
            return HtmlParseUtility.getPageTitle(document) == "楽曲別レコード";
        }

        private getMusicCount(content: Element): number {
            var scoreList = this.getScoreList(content);
            for (var i = 0; i < scoreList.length; i++) {
                let score = scoreList[i];
                if (score.key.indexOf("icon_clear") !== -1) {
                    return score.denominator;
                }
            }
            return 0;
        }

        private getClearCount(content: Element): number {
            return this.getNumerator(content, "icon_clear");
        }

        private getSCount(content: Element): number {
            return this.getNumerator(content, "icon_rank_8")
        }

        private getSsCount(content: Element): number {
            return this.getNumerator(content, "icon_rank_9");
        }

        private getSssCount(content: Element): number {
            return this.getNumerator(content, "icon_rank_10");
        }

        private getFullComboCount(content: Element): number {
            return this.getNumerator(content, "icon_fullcombo");
        }

        private getAllJusticeCount(content: Element): number {
            return this.getNumerator(content, "icon_alljustice");
        }

        private getFullChainGoldCount(content: Element): number {
            return this.getNumerator(content, "icon_fullchain2");
        }

        private getFullChainPlatinumCount(content: Element): number {
            var scoreList = this.getScoreList(content);
            for (var i = 0; i < scoreList.length; i++) {
                let score = scoreList[i];
                if (score.key.indexOf("icon_fullchain") !== -1 && score.key.indexOf("icon_fullchain2") === -1) {
                    return score.numerator;
                }
            }
            return 0;
        }

        private getNumerator(content: Element, key: string): number {
            var scoreList = this.getScoreList(content);
            for (var i = 0; i < scoreList.length; i++) {
                let score = scoreList[i];
                if (score.key.indexOf(key) !== -1) {
                    return score.numerator;
                }
            }
            return 0;
        }

        private getScoreList(content: Element): { key: string, numerator: number, denominator: number }[] {
            var scoreListContents = content.getElementsByClassName("score_list");
            if (scoreListContents == null) {
                return new Array();
            }

            var getKey = (e: Element): string => {
                var e1 = e.getElementsByClassName("score_list_left");
                if (!e1 || e1.length == 0) {
                    return null;
                }

                var e2 = e1[0].getElementsByTagName("img");
                if (!e2 || e2.length == 0) {
                    return null;
                }

                var e3 = e2[0].getAttribute("src");
                if (!e3 || e3 == "") {
                    return null;
                }
                return e3;
            };

            var getValue = (e: Element): { numerator: number, denominator: number } => {
                var e1 = e.getElementsByClassName("score_list_right");
                if (!e1 || e1.length == 0) {
                    return null;
                }

                var values = e1[0].textContent.replace(" ", "").split("/");
                if (!values || values.length < 2) {
                    return null;
                }

                return {
                    numerator: parseInt(values[0]),
                    denominator: parseInt(values[1]),
                };
            };

            var scoreList = new Array();
            for (var i = 0; i < scoreListContents.length; i++) {
                let score = scoreListContents[i];
                let key = getKey(score);
                let value = getValue(score);
                if (!key || !value) {
                    continue;
                }
                scoreList.push({
                    key: key,
                    numerator: value.numerator,
                    denominator: value.denominator
                });
            }
            return scoreList;
        }

        private getUnits(content: Element): DataUnit[] {
            var contents = content.getElementsByClassName("musiclist_box");
            if (contents == null) {
                return new Array();
            }

            var units = new Array();
            for (var i = 0; i < contents.length; i++) {
                units.push(this.parseUnit(contents[i], i));
            }
            return units;
        }

        private parseUnit(content: Element, index: number): DataUnit {
            var unit = new DataUnit();

            unit.id = this.getId(content);
            unit.name = this.getName(content);
            unit.difficulty = this.getDifficulty(content);
            unit.level = this.getLevel(content);
            unit.score = this.getScore(content);
            unit.rank = this.getRank(content);
            unit.isClear = this.getIsClear(content);
            unit.comboStatus = this.getComboStatus(content);
            unit.chainStatus = this.getChainStatus(content);

            return unit;
        }

        private getId(content: Element): number {
            return HtmlParseUtility.getMusicId(content);
        }

        private getName(content: Element): string {
            return HtmlParseUtility.getMusicTitle(content);
        }

        private getDifficulty(content: Element): Difficulty {
            return HtmlParseUtility.getDifficulty(content);
        }

        private getLevel(content: Element): number {
            let e1 = content.parentElement.parentElement.getElementsByClassName("box01_title");
            let levelText = (e1 && e1[0]) ? e1[0].textContent.replace("LEVEL ", "") : null;
            if (!levelText) {
                return DefaultParameter.level;
            }
            return getBorderBaseRating(levelText);
        }

        private getScore(content: Element): number {
            return HtmlParseUtility.getPlayMusicDataHighScore(content);
        }

        private getRank(content: Element): Rank {
            return HtmlParseUtility.getRank(content);
        }

        private getIsClear(content: Element): boolean {
            return HtmlParseUtility.getIsClear(content);
        }

        private getComboStatus(content: Element): ComboStatus {
            return HtmlParseUtility.getComboStatus(content);
        }

        private getChainStatus(content: Element): ChainStatus {
            return HtmlParseUtility.getChainStatus(content);
        }
    }
}