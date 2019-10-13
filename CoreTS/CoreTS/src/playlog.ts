import { HtmlParseUtility } from "./HtmlParseUtility";
import { ChainStatus, ComboStatus, DefaultParameter, Difficulty, Rank } from "./Utility";

export namespace Playlog {
    export class DataUnit {
        public name: string = DefaultParameter.musicName;
        public imageName: string = DefaultParameter.imageName;
        public difficulty: Difficulty = DefaultParameter.difficulty;
        public score: number = DefaultParameter.score;
        public rank: Rank = DefaultParameter.rank;
        public isNewRecord: boolean = DefaultParameter.isNewRecord;
        public isClear: boolean = DefaultParameter.isClear;
        public comboStatus: ComboStatus = DefaultParameter.comboStatus;
        public chainStatus: ChainStatus = DefaultParameter.chainStatus;
        public track: number = DefaultParameter.track;
        public playDate: Date = DefaultParameter.playDate;
    }

    export class Data {
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

            var content = document.getElementById("inner");
            if (content == null) {
                return null;
            }

            var playlog = new Data();
            playlog.units = this.getUnits(content);
            return playlog;
        }

        private isValidDocument(document: Document): boolean {
            return HtmlParseUtility.getPageTitle(document) == "プレイ履歴";
        }

        private getUnits(content: Element): DataUnit[] {
            var contents = content.getElementsByClassName("frame02");
            if (contents == null) {
                return new Array();
            }

            var units = new Array();
            for (var i = 0; i < contents.length; i++) {
                var unit = this.parseUnit(contents[i], i);
                units.push(unit);
            }
            return units.reverse();
        }

        private parseUnit(content: Element, index: number): DataUnit {
            var unit = new DataUnit();

            unit.name = this.getName(content);
            unit.imageName = this.getImageName(content);
            unit.difficulty = this.getDifficulty(content);
            unit.score = this.getScore(content);
            unit.rank = this.getRank(content);
            unit.isNewRecord = this.getIsNewRecord(content);
            unit.isClear = this.getIsClear(content);
            unit.comboStatus = this.getComboStatus(content);
            unit.chainStatus = this.getChainStatus(content);
            unit.track = this.getTrack(content);
            unit.playDate = this.getPlayDate(content);

            return unit;
        }

        private getName(content: Element): string {
            var e1 = content.getElementsByClassName("play_musicdata_title");
            return (e1 && e1[0]) ? e1[0].textContent : DefaultParameter.musicName;
        }

        private getImageName(content: Element): string {
            return HtmlParseUtility.getImageName(content);
        }

        private getDifficulty(content: Element): Difficulty {
            return HtmlParseUtility.getDifficultyFromPlayTrackResult(content);
        }

        private getScore(content: Element): number {
            return HtmlParseUtility.getPlayMusicDataScore(content);
        }

        private getRank(content: Element): Rank {
            return HtmlParseUtility.getRank(content);
        }

        private getIsNewRecord(content: Element): boolean {
            return HtmlParseUtility.getIsNewRecord(content);
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

        private getTrack(content: Element): number {
            return HtmlParseUtility.getTrack(content);
        }

        private getPlayDate(content: Element): Date {
            return HtmlParseUtility.getPlayDataListDate(content);
        }
    }
}