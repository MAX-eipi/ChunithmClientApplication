import * as util from "./Utility";
import { ComboStatus } from "./Utility";

export function getRating(baseRating: number, score: number): number {
    return Math.floor(getIntegerPlayRating(baseRating, score)) / 100;
}

export function getOverPower(baseRating: number, score: number, comboStatus: ComboStatus): number {
    var integerPlayRating = getIntegerPlayRating(baseRating, score, true);
    if (integerPlayRating <= 0) {
        return 0;
    }

    var basePoint = integerPlayRating;
    if (score >= util.RANK_MAX_BORDER_SCORE) {
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
    if (score < util.RANK_S_BORDER_SCORE) {
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
            { score: util.RANK_MAX_BORDER_SCORE + 1, integerRating: integerBaseRating + 275 },
            { score: util.RANK_MAX_BORDER_SCORE, integerRating: integerBaseRating + 275 },
            { score: util.RANK_SSS_BORDER_SCORE, integerRating: integerBaseRating + 200 },
            { score: util.RANK_SSA_BORDER_SCORE, integerRating: integerBaseRating + 150 },
            { score: util.RANK_SS_BORDER_SCORE, integerRating: integerBaseRating + 100 },
            { score: util.RANK_S_BORDER_SCORE, integerRating: integerBaseRating },
            { score: util.RANK_AA_BORDER_SCORE, integerRating: Math.max(integerBaseRating - 300, 0) },
            { score: util.RANK_A_BORDER_SCORE, integerRating: Math.max(integerBaseRating - 500, 0) },
            { score: util.RANK_BBB_BORDER_SCORE, integerRating: Math.max((integerBaseRating - 500) / 2.0, 0) },
            { score: util.RANK_C_BORDER_SCORE, integerRating: 0 },
            { score: util.RANK_D_BORDER_SCORE, integerRating: 0 },
        ];
    }
    else {
        return [
            { score: util.RANK_SSS_BORDER_SCORE + 1, integerRating: integerBaseRating + 200 },
            { score: util.RANK_SSS_BORDER_SCORE, integerRating: integerBaseRating + 200 },
            { score: util.RANK_SSA_BORDER_SCORE, integerRating: integerBaseRating + 150 },
            { score: util.RANK_SS_BORDER_SCORE, integerRating: integerBaseRating + 100 },
            { score: util.RANK_S_BORDER_SCORE, integerRating: integerBaseRating },
            { score: util.RANK_AA_BORDER_SCORE, integerRating: Math.max(integerBaseRating - 300, 0) },
            { score: util.RANK_A_BORDER_SCORE, integerRating: Math.max(integerBaseRating - 500, 0) },
            { score: util.RANK_BBB_BORDER_SCORE, integerRating: Math.max((integerBaseRating - 500) / 2.0, 0) },
            { score: util.RANK_C_BORDER_SCORE, integerRating: 0 },
            { score: util.RANK_D_BORDER_SCORE, integerRating: 0 },
        ];
    }
}

function convertToIntegerRating(rating: number): number {
    return Math.round(rating * 100);
}
