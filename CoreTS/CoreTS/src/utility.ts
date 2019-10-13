export enum Difficulty {
    Invalid,
    Basic,
    Advanced,
    Expert,
    Master,
    WorldsEnd
}

export enum Genre {
    Invalid,
    POPS_AND_ANIME,
    niconico,
    東方Project,
    VARIETY,
    イロドリミドリ,
    言ノ葉Project,
    ORIGINAL,
    All,
}

export enum Rank {
    None,
    D,
    C,
    B,
    BB,
    BBB,
    A,
    AA,
    AAA,
    S,
    SS,
    SSA,
    SSS,
    Max,
}

export enum ComboStatus {
    None,
    FullCombo,
    AllJustice,
}

export enum ChainStatus {
    None,
    FullChainGold,
    FullChainPlatinum,
}


export enum WorldsEndType {
    Invalid,
    招,
    狂,
    止,
    改,
    両,
    嘘,
    半,
    時,
    光,
    割,
    跳,
    弾,
    戻,
    伸,
    布,
    敷,
    翔,
    謎,
    疑, // ?
    驚, // !
    避,
    速,
    歌,
    没,
    舞,
    俺,
    蔵,
    覚,
}

export const RANK_MAX_BORDER_SCORE: number = 1010000;
export const RANK_SSS_BORDER_SCORE: number = 1007500;
export const RANK_SSA_BORDER_SCORE: number = 1005000;
export const RANK_SS_BORDER_SCORE: number = 1000000;
export const RANK_S_BORDER_SCORE: number = 975000;
export const RANK_AAA_BORDER_SCORE: number = 950000;
export const RANK_AA_BORDER_SCORE: number = 925000;
export const RANK_A_BORDER_SCORE: number = 900000;
export const RANK_BBB_BORDER_SCORE: number = 800000;
export const RANK_BB_BORDER_SCORE: number = 700000;
export const RANK_B_BORDER_SCORE: number = 600000;
export const RANK_C_BORDER_SCORE: number = 500000;
export const RANK_D_BORDER_SCORE: number = 0;
export const RANK_NONE_BORDER_SCORE: number = 0;

export const RANK_MAX_TEXT: string = "MAX";
export const RANK_SSS_TEXT: string = "SSS";
export const RANK_SSA_TEXT: string = "SS+";
export const RANK_SS_TEXT: string = "SS";
export const RANK_S_TEXT: string = "S";
export const RANK_AAA_TEXT: string = "AAA";
export const RANK_AA_TEXT: string = "AA";
export const RANK_A_TEXT: string = "A";
export const RANK_BBB_TEXT: string = "BBB";
export const RANK_BB_TEXT: string = "BB";
export const RANK_B_TEXT: string = "B";
export const RANK_C_TEXT: string = "C";
export const RANK_D_TEXT: string = "D";
export const RANK_NONE_TEXT: string = "NONE";

export const RANK_MAX_CODE: number = 10;
export const RANK_SSS_CODE: number = 10;
export const RANK_SSA_CODE: number = 9;
export const RANK_SS_CODE: number = 9;
export const RANK_S_CODE: number = 8;
export const RANK_AAA_CODE: number = 7;
export const RANK_AA_CODE: number = 6;
export const RANK_A_CODE: number = 5;
export const RANK_BBB_CODE: number = 4;
export const RANK_BB_CODE: number = 3;
export const RANK_B_CODE: number = 2;
export const RANK_C_CODE: number = 1;
export const RANK_D_CODE: number = 0;
export const RANK_NONE_CODE: number = -1;

export function getBorderScore(rank: Rank): number {
    switch (rank) {
        case Rank.Max:
            return RANK_MAX_BORDER_SCORE;
        case Rank.SSS:
            return RANK_SSS_BORDER_SCORE;
        case Rank.SSA:
            return RANK_SSA_BORDER_SCORE;
        case Rank.SS:
            return RANK_SS_BORDER_SCORE;
        case Rank.S:
            return RANK_S_BORDER_SCORE;
        case Rank.AAA:
            return RANK_AAA_BORDER_SCORE;
        case Rank.AA:
            return RANK_AA_BORDER_SCORE;
        case Rank.A:
            return RANK_A_BORDER_SCORE;
        case Rank.BBB:
            return RANK_BBB_BORDER_SCORE;
        case Rank.BB:
            return RANK_BB_BORDER_SCORE;
        case Rank.B:
            return RANK_B_BORDER_SCORE;
        case Rank.C:
            return RANK_C_BORDER_SCORE;
        case Rank.D:
            return RANK_D_BORDER_SCORE;
    }
    return RANK_NONE_BORDER_SCORE;
}

export function getRank(score: number): Rank {
    if (score >= RANK_MAX_BORDER_SCORE) {
        return Rank.Max;
    }
    else if (score >= RANK_SSS_BORDER_SCORE) {
        return Rank.SSS;
    }
    else if (score >= RANK_SSA_BORDER_SCORE) {
        return Rank.SSA;
    }
    else if (score >= RANK_SS_BORDER_SCORE) {
        return Rank.SS;
    }
    else if (score >= RANK_S_BORDER_SCORE) {
        return Rank.S;
    }
    else if (score >= RANK_AAA_BORDER_SCORE) {
        return Rank.AAA;
    }
    else if (score >= RANK_AA_BORDER_SCORE) {
        return Rank.AA;
    }
    else if (score >= RANK_A_BORDER_SCORE) {
        return Rank.A;
    }
    else if (score >= RANK_BBB_BORDER_SCORE) {
        return Rank.BBB;
    }
    else if (score >= RANK_BB_BORDER_SCORE) {
        return Rank.BB;
    }
    else if (score >= RANK_B_BORDER_SCORE) {
        return Rank.B;
    }
    else if (score >= RANK_C_BORDER_SCORE) {
        return Rank.C;
    }
    else if (score >= RANK_D_BORDER_SCORE) {
        return Rank.D;
    }

    return RANK_NONE_BORDER_SCORE;
}

export function toRank(rankCode: number): Rank {
    switch (rankCode) {
        case RANK_SSS_CODE:
            return Rank.SSS;
        case RANK_SS_CODE:
            return Rank.SS;
        case RANK_S_CODE:
            return Rank.S;
        case RANK_AAA_CODE:
            return Rank.AAA;
        case RANK_AA_CODE:
            return Rank.AA;
        case RANK_A_CODE:
            return Rank.A;
        case RANK_BBB_CODE:
            return Rank.BBB;
        case RANK_BB_CODE:
            return Rank.BB;
        case RANK_B_CODE:
            return Rank.B;
        case RANK_C_CODE:
            return Rank.C;
        case RANK_D_CODE:
            return Rank.D;
    }

    return Rank.None;
}

export function toRankText(rank: Rank): string {
    switch (rank) {
        case Rank.Max:
            return RANK_MAX_TEXT;
        case Rank.SSS:
            return RANK_SSS_TEXT;
        case Rank.SSA:
            return RANK_SSA_TEXT;
        case Rank.SS:
            return RANK_SS_TEXT;
        case Rank.S:
            return RANK_S_TEXT;
        case Rank.AAA:
            return RANK_AAA_TEXT;
        case Rank.AA:
            return RANK_AA_TEXT;
        case Rank.A:
            return RANK_A_TEXT;
        case Rank.BBB:
            return RANK_BBB_TEXT;
        case Rank.BB:
            return RANK_BB_TEXT;
        case Rank.B:
            return RANK_B_TEXT;
        case Rank.C:
            return RANK_C_TEXT;
        case Rank.D:
            return RANK_D_TEXT;
        case Rank.None:
            return RANK_NONE_TEXT;
    }
}

export function toRankCode(rank: Rank): number;
export function toRankCode(rankText: string): number;
export function toRankCode(value: any): number {
    if (typeof value === "number") {
        switch (value) {
            case Rank.Max:
                return RANK_MAX_CODE;
            case Rank.SSS:
                return RANK_SSS_CODE;
            case Rank.SSA:
                return RANK_SSA_CODE;
            case Rank.SS:
                return RANK_SS_CODE;
            case Rank.S:
                return RANK_S_CODE;
            case Rank.AAA:
                return RANK_AAA_CODE;
            case Rank.AA:
                return RANK_AA_CODE;
            case Rank.A:
                return RANK_A_CODE;
            case Rank.BBB:
                return RANK_BBB_CODE;
            case Rank.BB:
                return RANK_BB_CODE;
            case Rank.B:
                return RANK_B_CODE;
            case Rank.C:
                return RANK_C_CODE;
            case Rank.D:
                return RANK_D_CODE;
            case Rank.None:
                return RANK_NONE_CODE;
        }
    }
    else if (typeof value === "string") {
        switch (value) {
            case RANK_SSS_TEXT:
                return RANK_SSS_CODE;
            case RANK_SS_TEXT:
                return RANK_SS_CODE;
            case RANK_S_TEXT:
                return RANK_S_CODE;
            case RANK_AAA_TEXT:
                return RANK_AAA_CODE;
            case RANK_AA_TEXT:
                return RANK_AA_CODE;
            case RANK_A_TEXT:
                return RANK_A_CODE;
            case RANK_BBB_TEXT:
                return RANK_BBB_CODE;
            case RANK_BB_TEXT:
                return RANK_BB_CODE;
            case RANK_B_TEXT:
                return RANK_B_CODE;
            case RANK_C_TEXT:
                return RANK_C_CODE;
            case RANK_D_TEXT:
                return RANK_D_CODE;
        }
        return RANK_NONE_CODE;
    }
}

export class DefaultParameter {
    public static id: number = -1;
    public static musicName: string = "";
    public static artistName: string = "";
    public static imageName: string = "";
    public static genre: Genre = Genre.Invalid;
    public static difficulty: Difficulty = Difficulty.Invalid;
    public static level: number = 0;
    public static worldsEndLevel: number = -1;
    public static worldsEndType: WorldsEndType = WorldsEndType.Invalid;
    public static score: number = 0;
    public static rank: Rank = Rank.None;
    public static baseRating: number = 0;
    public static rating: number = 0;
    public static isNewRecord: boolean = false;
    public static isClear: boolean = false;
    public static comboStatus: ComboStatus = ComboStatus.None;
    public static chainStatus: ChainStatus = ChainStatus.None;
    public static track: number = 0;
    public static playDate: Date = new Date(0);
    public static playCount: number = 0;
    public static storeName: string = "";
    public static characterName: string = "";
    public static skillName: string = "";
    public static skillLevel: number = 0;
    public static skillResult: number = 0;
    public static maxCombo: number = 0;
    public static justiceCriticalCount: number = 0;
    public static justiceCount: number = 0;
    public static attackCount: number = 0;
    public static missCount: number = 0;
    public static tapPercentage: number = 0;
    public static holdPercentage: number = 0;
    public static slidePercentage: number = 0;
    public static airPercentage: number = 0;
    public static flickPercentage: number = 0;
}

export function parseScore(scoreText: string): number {
    if (!scoreText) { return DefaultParameter.score; }
    var score = parseInt(scoreText.replace(/,/g, ""));
    if (!score) {
        return DefaultParameter.score;
    }
    return score;
}

export function parseNumber(text: string, defaultValue: number = NaN): number {
    if (!text) { return defaultValue; }
    var num = parseInt(text.replace(/,/g, ""));
    if (!num) {
        return defaultValue;
    }
    return num;
}

export function toGenre(genreName: string): Genre {
    switch (genreName) {
        case "POPS & ANIME":
            return Genre.POPS_AND_ANIME;
        case "niconico":
            return Genre.niconico;
        case "東方Project":
            return Genre.東方Project;
        case "VARIETY":
            return Genre.VARIETY;
        case "イロドリミドリ":
            return Genre.イロドリミドリ;
        case "言ノ葉Project":
            return Genre.言ノ葉Project;
        case "ORIGINAL":
            return Genre.ORIGINAL;
        case "ALL":
            return Genre.All;
    }
    return Genre.Invalid;
}

export function toWorldsEndType(typeCode: number): WorldsEndType {
    return DefaultParameter.worldsEndType;
}

export function getBorderBaseRating(levelText: string): number {
    var integer = 0;
    var decimal = 0;

    if (levelText.indexOf("+") !== -1) {
        decimal = 0.7;
    }

    levelText = levelText.replace("+", "");
    integer = parseInt(levelText);
    if (integer === NaN) {
        return DefaultParameter.baseRating;
    }

    return integer + decimal;
}

export function toDocument(html: string): Document {
    return (new DOMParser()).parseFromString(html, "text/html");
}