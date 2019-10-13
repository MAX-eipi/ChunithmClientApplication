import { PlaylogDetail } from '../src/PlaylogDetail';
import { ChainStatus, ComboStatus, Difficulty, Rank } from '../src/Utility';
import { loadDocument } from './TestUtility';

describe("PlaylogDetail", () => {
    var parser = new PlaylogDetail.Parser();

    it("Parser Test 1", () => {
        var data = parser.parse(loadDocument("PlaylogDetail/html_test_case_1.html"));
        expect(data).not.toBeNull();

        expect(data.name).toStrictEqual("Summer is over");
        expect(data.difficulty).toStrictEqual(Difficulty.Master);
        expect(data.score).toStrictEqual(1006611);
        expect(data.rank).toStrictEqual(Rank.SS);
        expect(data.isClear).toStrictEqual(true);
        expect(data.isNewRecord).toStrictEqual(true);
        expect(data.comboStatus).toStrictEqual(ComboStatus.None);
        expect(data.chainStatus).toStrictEqual(ChainStatus.None);
        expect(data.track).toStrictEqual(2);
        expect(data.playDate).toStrictEqual(new Date(2018, 11 - 1, 5, 21, 45, 0));
        expect(data.storeName).toStrictEqual("THE 3RD PLANET フレスポ八潮店");
        expect(data.characterName).toStrictEqual("黒柳 ルリ子");
        expect(data.skillName).toStrictEqual("勇気のしるし");
        expect(data.skillLevel).toStrictEqual(5);
        expect(data.skillResult).toStrictEqual(96684);
        expect(data.maxCombo).toStrictEqual(1156);
        expect(data.justiceCriticalCount).toStrictEqual(1872);
        expect(data.justiceCount).toStrictEqual(43);
        expect(data.attackCount).toStrictEqual(6);
        expect(data.missCount).toStrictEqual(3);
        expect(data.tapPercentage).toStrictEqual(100.39);
        expect(data.holdPercentage).toStrictEqual(100.96);
        expect(data.slidePercentage).toStrictEqual(101);
        expect(data.airPercentage).toStrictEqual(101);
        expect(data.flickPercentage).toStrictEqual(100.17);
    });

    it("Parser Test Error", () => {
        var data = parser.parse(loadDocument("Common/error_page.html"));
        expect(data).toBeNull();
    });
});
