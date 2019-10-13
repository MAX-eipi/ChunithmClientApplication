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

const RANK_MAX_BORDER_SCORE: number = 1010000;
const RANK_SSS_BORDER_SCORE: number = 1007500;
const RANK_SSA_BORDER_SCORE: number = 1005000;
const RANK_SS_BORDER_SCORE: number = 1000000;
const RANK_S_BORDER_SCORE: number = 975000;
const RANK_AAA_BORDER_SCORE: number = 950000;
const RANK_AA_BORDER_SCORE: number = 925000;
const RANK_A_BORDER_SCORE: number = 900000;
const RANK_BBB_BORDER_SCORE: number = 800000;
const RANK_BB_BORDER_SCORE: number = 700000;
const RANK_B_BORDER_SCORE: number = 600000;
const RANK_C_BORDER_SCORE: number = 500000;
const RANK_D_BORDER_SCORE: number = 0;
const RANK_NONE_BORDER_SCORE: number = 0;

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

export function getBorderBaseRating(levelText: string): number {
    var integer = 0;
    var decimal = 0;

    if (levelText.indexOf("+") !== -1) {
        decimal = 0.7;
    }

    levelText = levelText.replace("+", "");
    integer = parseInt(levelText);
    if (integer === NaN) {
        return 0;
    }

    return integer + decimal;
}

export function getRating(baseRating: number, score: number): number {
    return Math.floor(getIntegerPlayRating(baseRating, score)) / 100;
}

export function getOverPower(baseRating: number, score: number, comboStatus: ComboStatus): number {
    var integerPlayRating = getIntegerPlayRating(baseRating, score, true);
    if (integerPlayRating <= 0) {
        return 0;
    }

    var basePoint = integerPlayRating;
    if (score >= RANK_MAX_BORDER_SCORE) {
        basePoint += 25;
    }
    else {
        switch (comboStatus) {
            case ComboStatus.AllJustice:
                basePoint += 20;
                break;
            case ComboStatus.FullCombo:
                basePoint += 10;
                break;
        }
    }

    var overPower = basePoint * 5;
    if (score < RANK_S_BORDER_SCORE) {
        overPower = Math.floor(overPower) / 100;
    }
    else {
        overPower = overPower / 100;
    }

    return overPower;
}

function getIntegerPlayRating(baseRating: number, score: number, asOverPower: boolean = false): number {
    if (baseRating <= 0 || score <= 0) {
        return 0;
    }

    var integerBaseRating = convertToIntegerRating(baseRating);
    var borders = getBordersAsIntegerRating(integerBaseRating, asOverPower);

    for (var i = 1; i < borders.length; i++) {
        var nextBorder = borders[i - 1];
        var border = borders[i];
        if (score >= border.score) {
            var diffScore = score - border.score;
            var diffBorderScore = nextBorder.score - border.score;
            var diffBorderIntegerRating = nextBorder.integerRating - border.integerRating;
            var integerPlayRating = (diffScore * diffBorderIntegerRating + diffBorderScore * border.integerRating) / diffBorderScore;
            return integerPlayRating;
        }
    }

    return 0;
}

function getBordersAsIntegerRating(integerBaseRating: number, asOverPower: boolean): { score: number, integerRating: number }[] {
    if (asOverPower) {
        return [
            { score: RANK_MAX_BORDER_SCORE + 1, integerRating: integerBaseRating + 275 },
            { score: RANK_MAX_BORDER_SCORE, integerRating: integerBaseRating + 275 },
            { score: RANK_SSS_BORDER_SCORE, integerRating: integerBaseRating + 200 },
            { score: RANK_SSA_BORDER_SCORE, integerRating: integerBaseRating + 150 },
            { score: RANK_SS_BORDER_SCORE, integerRating: integerBaseRating + 100 },
            { score: RANK_S_BORDER_SCORE, integerRating: integerBaseRating },
            { score: RANK_AA_BORDER_SCORE, integerRating: Math.max(integerBaseRating - 300, 0) },
            { score: RANK_A_BORDER_SCORE, integerRating: Math.max(integerBaseRating - 500, 0) },
            { score: RANK_BBB_BORDER_SCORE, integerRating: Math.max((integerBaseRating - 500) / 2.0, 0) },
            { score: RANK_C_BORDER_SCORE, integerRating: 0 },
            { score: RANK_D_BORDER_SCORE, integerRating: 0 },
        ];
    }
    else {
        return [
            { score: RANK_SSS_BORDER_SCORE + 1, integerRating: integerBaseRating + 200 },
            { score: RANK_SSS_BORDER_SCORE, integerRating: integerBaseRating + 200 },
            { score: RANK_SSA_BORDER_SCORE, integerRating: integerBaseRating + 150 },
            { score: RANK_SS_BORDER_SCORE, integerRating: integerBaseRating + 100 },
            { score: RANK_S_BORDER_SCORE, integerRating: integerBaseRating },
            { score: RANK_AA_BORDER_SCORE, integerRating: Math.max(integerBaseRating - 300, 0) },
            { score: RANK_A_BORDER_SCORE, integerRating: Math.max(integerBaseRating - 500, 0) },
            { score: RANK_BBB_BORDER_SCORE, integerRating: Math.max((integerBaseRating - 500) / 2.0, 0) },
            { score: RANK_C_BORDER_SCORE, integerRating: 0 },
            { score: RANK_D_BORDER_SCORE, integerRating: 0 },
        ];
    }
}

function convertToIntegerRating(rating: number): number {
    return Math.round(rating * 100);
}

export function calcBaseRating(beforeOp: number, afterOp: number, score: number, comboStatus: ComboStatus): number {
    if (score < RANK_AA_BORDER_SCORE || score > RANK_MAX_BORDER_SCORE) {
        return 0;
    }
    
    if (beforeOp > afterOp) {
        return 0;
    }
    
    let diffOp = afterOp - beforeOp;
    var added = 0;
    if (score >= RANK_MAX_BORDER_SCORE) {
        added = 2.75;
    }
    else if (score >= RANK_SSS_BORDER_SCORE) {
        added = 2.0 + 0.75 * (score - RANK_SSS_BORDER_SCORE) / (RANK_MAX_BORDER_SCORE - RANK_SSS_BORDER_SCORE);
    }
    else if (score >= RANK_SSA_BORDER_SCORE) {
        added = 1.5 + 0.5 * (score - RANK_SSA_BORDER_SCORE) / (RANK_SSS_BORDER_SCORE - RANK_SSA_BORDER_SCORE);
    }
    else if (score >= RANK_SS_BORDER_SCORE) {
        added = 1.0 + 0.5 * (score - RANK_SS_BORDER_SCORE) / (RANK_SSA_BORDER_SCORE - RANK_SS_BORDER_SCORE);
    }
    else if (score >= RANK_S_BORDER_SCORE) {
        added = 1.0 * (score - RANK_S_BORDER_SCORE) / (RANK_SS_BORDER_SCORE - RANK_S_BORDER_SCORE);
    }
    else if (score >= RANK_AA_BORDER_SCORE) {
        added = -3.0 + 3.0 * (score - RANK_AA_BORDER_SCORE) / (RANK_S_BORDER_SCORE - RANK_AA_BORDER_SCORE);
    }
    switch (comboStatus) {
        case ComboStatus.AllJustice:
            if (score >= RANK_MAX_BORDER_SCORE) {
                added += 0.25;
            } else {
                added += 0.2;
            }
            break;
        case ComboStatus.FullCombo:
            added += 0.1;
            break;
    }
    
    let baseRating = Math.round((diffOp / 5 - added) * 100) / 100;
    return baseRating;
}