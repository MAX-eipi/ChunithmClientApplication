import { HtmlParseUtility } from "./HtmlParseUtility";

export namespace AimeList {
    export class DataUnit {
        public rebornCount: number;
        public level: number;
        public name: string;
        public nowRating: number;
        public maxRating: number;
        public voucherText: string;
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

            var parseData = new Data();

            parseData.units = this.getUnit(content);

            return parseData;
        }

        private isValidDocument(document: Document): boolean {
            return HtmlParseUtility.getPageTitle(document) == "Aime選択・利用権設定";
        }

        private getUnit(content: Element): DataUnit[] {
            var contents = content.getElementsByClassName("box_player");
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

            unit.rebornCount = this.getRebornCount(content);
            unit.level = this.getLevel(content);
            unit.name = this.getName(content);
            unit.nowRating = this.getNowRating(content);
            unit.maxRating = this.getMaxRating(content);
            unit.voucherText = this.getVoucherText(content);

            return unit;
        }

        private getRebornCount(node: Element): number {
            let e1 = node.getElementsByClassName("player_reborn");
            let playerRebornText = (e1 && e1[0]) ? e1[0].textContent : null;

            if (!playerRebornText) {
                return 0;
            }

            var rebornCount = parseInt(playerRebornText);
            if (rebornCount === NaN) {
                return 0;
            }

            return rebornCount;
        }

        private getLevel(node: Element): number {
            let playerInfo = this.getPlayerInfoTexts(node);
            let level = parseInt(playerInfo[0].match(/Lv.(\d+)/)[1]);

            if (level === NaN) {
                return 0;
            }
            return level;
        }

        private getName(node: Element): string {
            var playerInfo = this.getPlayerInfoTexts(node);
            var name = playerInfo[1];
            return name;
        }

        private getNowRating(node: Element): number {
            let ratingInfo = this.getRatingInfoText(node);
            let regex = /(\d{1,2}\.\d{1,2})/g;
            let matches = ratingInfo.match(regex);

            let nowRating = parseFloat(matches[0]);
            if (nowRating === NaN) {
                return 0;
            }

            return nowRating;
        }

        private getMaxRating(node: Element): number {
            let ratingInfo = this.getRatingInfoText(node);
            let regex = /(\d{1,2}\.\d{1,2})/g;
            let matches = ratingInfo.match(regex);

            let maxRating = parseFloat(matches[1]);
            if (maxRating === NaN) {
                return 0;
            }

            return maxRating;
        }

        private getVoucherText(node: Element): string {
            let e1 = node.getElementsByClassName("home_player_riyouken");
            let e2 = (e1 && e1[0]) ? e1[0].textContent : null;

            if (!e2) {
                return null;
            }

            return e2.replace(/\t/g, "").replace(/\n/g, "");
        }

        private getPlayerInfoTexts(node: Element): string[] {
            let e1 = node.getElementsByClassName("player_name");
            let e2 = (e1 && e1[0]) ? e1[0].textContent : null;

            if (!e2) {
                return new Array();
            }

            let e3 = e2.replace(/\t/g, "");
            let e4 = e3.split("\n");

            var texts = new Array();
            for (var i = 0; i < e4.length; i++) {
                if (e4[i]) {
                    texts.push(e4[i]);
                }
            }
            return texts;
        }

        private getRatingInfoText(node: Element): string {
            let e1 = node.getElementsByClassName("player_rating");
            let e2 = (e1 && e1[0]) ? e1[0].textContent : null;

            if (!e2) {
                return "";
            }

            return e2.replace(/\t/g, "").replace(/\n/g, "");
        }
    }
}