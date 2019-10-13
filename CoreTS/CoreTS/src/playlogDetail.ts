import { HtmlParseUtility } from "./HtmlParseUtility";
import { ChainStatus, ComboStatus, DefaultParameter, Difficulty, Rank, parseNumber } from "./Utility";
import { Playlog } from "./playlog";

export namespace PlaylogDetail {
    export class Data {
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

        public storeName: string = DefaultParameter.storeName;
        public characterName: string = DefaultParameter.characterName;
        public skillName: string = DefaultParameter.skillName;
        public skillLevel: number = DefaultParameter.skillLevel;
        public skillResult: number = DefaultParameter.skillResult;

        public maxCombo: number = DefaultParameter.maxCombo;
        public justiceCriticalCount: number = DefaultParameter.justiceCriticalCount;
        public justiceCount: number = DefaultParameter.justiceCount;
        public attackCount: number = DefaultParameter.attackCount;
        public missCount: number = DefaultParameter.missCount;

        public tapPercentage: number = DefaultParameter.tapPercentage;
        public holdPercentage: number = DefaultParameter.holdPercentage;
        public slidePercentage: number = DefaultParameter.slidePercentage;
        public airPercentage: number = DefaultParameter.airPercentage;
        public flickPercentage: number = DefaultParameter.flickPercentage;
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

            var playlogDetail = new Data();

            playlogDetail.name = this.getName(content);
            playlogDetail.imageName = this.getImageName(content);
            playlogDetail.difficulty = this.getDifficulty(content);

            playlogDetail.score = this.getScore(content);
            playlogDetail.rank = this.getRank(content);
            // playlogDetail.IsChallengePiece
            playlogDetail.isNewRecord = this.getIsNewRecord(content);
            playlogDetail.isClear = this.getIsClear(content);
            playlogDetail.comboStatus = this.getComboStatus(content);
            playlogDetail.chainStatus = this.getChainStatus(content);
            playlogDetail.track = this.getTrack(content);
            playlogDetail.playDate = this.getPlayDate(content);

            playlogDetail.storeName = this.getStoreName(content);

            playlogDetail.characterName = this.getCharacterName(content);
            playlogDetail.skillLevel = this.getSkillLevel(content);
            playlogDetail.skillName = this.getSkillName(content);
            playlogDetail.skillResult = this.getSkillResult(content);

            playlogDetail.maxCombo = this.getMaxCombo(content);
            playlogDetail.justiceCriticalCount = this.getJusticeCriticalCount(content);
            playlogDetail.justiceCount = this.getJusticeCount(content);
            playlogDetail.attackCount = this.getAttackCount(content);
            playlogDetail.missCount = this.getMissCount(content);

            playlogDetail.tapPercentage = this.getTapPercentage(content);
            playlogDetail.holdPercentage = this.getHoldPercentage(content);
            playlogDetail.slidePercentage = this.getSlidePercentage(content);
            playlogDetail.airPercentage = this.getAirPercentage(content);
            playlogDetail.flickPercentage = this.getFlickPercentage(content);

            return playlogDetail;
        }

        private isValidDocument(document: Document): boolean {
            return HtmlParseUtility.getPageTitle(document) == "プレイ履歴";
        }

        private getName(content: Element): string {
            return HtmlParseUtility.getPlayMusicDataTitle(content);
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
            return HtmlParseUtility.getPlayDate(content);
        }

        private getStoreName(content: Element): string {
            let e1 = content.getElementsByClassName("play_data_inner_w388");
            return (e1 && e1[0]) ? e1[0].textContent : DefaultParameter.storeName;
        }

        private getCharacterName(content: Element): string {
            let e1 = content.getElementsByClassName("block_icon_text");
            return (e1 && e1[0]) ? e1[0].textContent : DefaultParameter.characterName;
        }

        private getSkillLevel(content: Element): number {
            let skillLevelText = this.getSkillLevelText(content);
            let skillLevel = parseInt(skillLevelText);
            if (skillLevel === NaN) {
                return DefaultParameter.skillLevel;
            }
            return skillLevel;
        }

        private getSkillName(content: Element): string {
            var skillName: string = null;
            {
                let e1 = content.getElementsByClassName("block_icon_text");
                let e2 = (e1 && e1[1]) ? e1[1] : null;
                if (e2) {
                    skillName = e2.textContent.replace(/[\t\n]/g, "");
                }
            }
            if (skillName == null) {
                return DefaultParameter.skillName;
            }

            var skillLevelText = this.getSkillLevelText(content);
            if (skillLevelText) {
                skillName = skillName.replace(skillLevelText, "");
            }
            return skillName;
        }

        private getSkillLevelText(content: Element): string {
            let e1 = content.getElementsByClassName("skill_level");
            return (e1 && e1[0]) ? e1[0].textContent : null;
        }

        private getSkillResult(content: Element): number {
            var skillResultText: string = null;
            {
                let e1 = content.getElementsByClassName("play_musicdata_skilleffect");
                let e2 = (e1 && e1[0]) ? e1[0].textContent : null;
                skillResultText = e2 ? e2.replace("SKILL RESULT", "") : null;
            }
            if (skillResultText == null) {
                return DefaultParameter.skillResult;
            }

            let skillResult = parseNumber(skillResultText);
            return skillResult;
        }

        private getMaxCombo(content: Element): number {
            var maxComboText: string = null;
            {
                let e1 = content.getElementsByClassName("play_musicdata_max_number");
                maxComboText = (e1 && e1[0]) ? e1[0].textContent : null;
            }
            return parseNumber(maxComboText, DefaultParameter.maxCombo);
        }

        private getJusticeCriticalCount(content: Element): number {
            return this.getCount(content, "text_critical", DefaultParameter.justiceCriticalCount);
        }

        private getJusticeCount(content: Element): number {
            return this.getCount(content, "text_justice", DefaultParameter.justiceCount);
        }

        private getAttackCount(content: Element): number {
            return this.getCount(content, "text_attack", DefaultParameter.attackCount);
        }

        private getMissCount(content: Element): number {
            return this.getCount(content, "text_miss", DefaultParameter.missCount);
        }

        private getCount(content: Element, className: string, defaultValue: number): number {
            let countText = this.getCountText(content, className);
            return parseNumber(countText, defaultValue);
        }

        private getCountText(content: Element, className: string): string {
            let e1 = content.getElementsByClassName(className);
            let e2 = (e1 && e1[0]) ? e1[0].textContent : null;
            return e2;
        }

        private getTapPercentage(content: Element): number {
            return this.getPercentage(content, 0, DefaultParameter.tapPercentage);
        }

        private getHoldPercentage(content: Element): number {
            return this.getPercentage(content, 1, DefaultParameter.holdPercentage);
        }

        private getSlidePercentage(content: Element): number {
            return this.getPercentage(content, 2, DefaultParameter.slidePercentage);
        }

        private getAirPercentage(content: Element): number {
            return this.getPercentage(content, 3, DefaultParameter.airPercentage);
        }

        private getFlickPercentage(content: Element): number {
            return this.getPercentage(content, 4, DefaultParameter.flickPercentage);
        }

        private getPercentage(content: Element, index: number, defaultValue: number): number {
            let noteNumberText = this.getPlayMusicDataNoteNumberText(content, index);
            let noteNumber = parseFloat(noteNumberText);
            if (isNaN(noteNumber)) {
                return defaultValue;
            }
            return noteNumber;
        }

        private getPlayMusicDataNoteNumberText(content: Element, index: number): string {
            let e1 = content.getElementsByClassName("play_musicdata_notesnumber");
            let e2 = (e1 && e1[index]) ? e1[index].textContent.replace("%", "") : null;
            return e2;
        }
    }
}