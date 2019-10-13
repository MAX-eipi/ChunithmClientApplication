import { HtmlParseUtility } from "./HtmlParseUtility";
import { ChainStatus, ComboStatus, DefaultParameter, Difficulty, Rank, RANK_AAA_BORDER_SCORE } from "./Utility";

export namespace MusicDetail {
    export class DataUnit {
        public difficulty: Difficulty = DefaultParameter.difficulty;
        public score: number = DefaultParameter.score;
        public rank: Rank = DefaultParameter.rank;
        public isClear: boolean = DefaultParameter.isClear;
        public comboStatus: ComboStatus = DefaultParameter.comboStatus;
        public chainStatus: ChainStatus = DefaultParameter.chainStatus;
        public playDate: Date = DefaultParameter.playDate;
        public playCount: number = DefaultParameter.playCount;
    }

    export class Data {
        public name: string = DefaultParameter.musicName;
        public artistName: string = DefaultParameter.artistName;
        public imageName: string = DefaultParameter.imageName;
        public units: DataUnit[] = new Array();

        public getBasic(): DataUnit {
            return this.getUnit(Difficulty.Basic);
        }

        public getAdvanced(): DataUnit {
            return this.getUnit(Difficulty.Advanced);
        }

        public getExpert(): DataUnit {
            return this.getUnit(Difficulty.Expert);
        }

        public getMaster(): DataUnit {
            return this.getUnit(Difficulty.Master);
        }

        public getUnit(difficulty: Difficulty): DataUnit {
            for (var i = 0; i < this.units.length; i++) {
                if (this.units[i].difficulty == difficulty) {
                    return this.units[i];
                }
            }
            return null;
        }
    }

    export class Parser {
        public parse(document: Document): Data {
            if (document == null) {
                throw { message: "argument null exception" };
            }

            if (!this.isValidDocument(document)) {
                return null;
            }

            var content = document.getElementById("inner");
            if (content == null) {
                return null;
            }

            var musicDetail = new Data();

            musicDetail.name = this.getName(content);
            musicDetail.artistName = this.getArtistName(content);
            musicDetail.imageName = this.getImageName(content);
            musicDetail.units = this.getUnits(content);

            return musicDetail;
        }

        private isValidDocument(document: Document): boolean {
            return HtmlParseUtility.getPageTitle(document) == "楽曲別レコード";
        }

        private getName(content: Element): string {
            return HtmlParseUtility.getPlayMusicDataTitle(content);
        }

        private getArtistName(content: Element): string {
            return HtmlParseUtility.getArtistName(content);
        }

        private getImageName(content: Element): string {
            return HtmlParseUtility.getImageName(content);
        }

        private getUnits(content: Element): DataUnit[] {
            var contents = content.getElementsByClassName("music_box");
            if (!content) {
                return new Array();
            }

            var units = new Array();
            for (var i = 0; i < contents.length; i++) {
                units.push(this.parseUnit(contents[i]));
            }
            return units;
        }

        private parseUnit(content: Element): DataUnit {
            var unit = new DataUnit();

            unit.difficulty = this.getDifficulty(content);
            unit.score = this.getScore(content);
            unit.rank = this.getRank(content);
            unit.isClear = this.getIsClear(content);
            unit.comboStatus = this.getComboStatus(content);
            unit.chainStatus = this.getChainStatus(content);
            unit.playDate = this.getPlayDate(content);
            unit.playCount = this.getPlayCount(content);

            return unit;
        }

        private getDifficulty(node: Element): Difficulty {
            return HtmlParseUtility.getDifficulty(node);
        }

        private getScore(node: Element): number {
            return HtmlParseUtility.getScoreFromMusicDetail(node);
        }

        private getRank(node: Element): Rank {
            return HtmlParseUtility.getRank(node);
        }

        private getIsClear(node: Element): boolean {
            return HtmlParseUtility.getIsClear(node);
        }

        private getComboStatus(node: Element): ComboStatus {
            return HtmlParseUtility.getComboStatus(node);
        }

        private getChainStatus(node: Element): ChainStatus {
            return HtmlParseUtility.getChainStatus(node);
        }

        private getPlayDate(node: Element): Date {
            return HtmlParseUtility.getMusicDataDetailDate(node);
        }

        private getPlayCount(node: Element): number {
            return HtmlParseUtility.getPlayCount(node);
        }
    }
}