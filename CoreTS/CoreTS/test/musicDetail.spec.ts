import { MusicDetail } from '../src/MusicDetail';
import { ChainStatus, ComboStatus, Difficulty, Rank } from '../src/Utility';
import { loadDocument } from './TestUtility';

describe("MusicDetail", () => {
    var parser = new MusicDetail.Parser();
    it("Parser Test 1", () => {
        var data = parser.parse(loadDocument("MusicDetail/html_test_case_1.html"));
        expect(data).not.toBeNull();

        expect(data.name).toStrictEqual("業 -善なる神とこの世の悪について-");
        expect(data.artistName).toStrictEqual("光吉猛修 VS 穴山大輔");
        expect(data.imageName).toStrictEqual("https://chunithm-net.com/mobile/img/6c682b055a448ee8.jpg");

        {
            var unit = data.getBasic();
            expect(unit).not.toBeNull();
            expect(unit.difficulty).toStrictEqual(Difficulty.Basic);
            expect(unit.score).toStrictEqual(1010000);
            expect(unit.rank).toStrictEqual(Rank.SSS);
            expect(unit.isClear).toStrictEqual(true);
            expect(unit.comboStatus).toStrictEqual(ComboStatus.AllJustice);
            expect(unit.chainStatus).toStrictEqual(ChainStatus.None);
            expect(unit.playDate).toEqual(new Date(2018, 9 - 1, 21, 20, 5));
            expect(unit.playCount).toStrictEqual(1);
        }
        {
            var unit = data.getAdvanced();
            expect(unit).not.toBeNull();
            expect(unit.difficulty).toStrictEqual(Difficulty.Advanced);
            expect(unit.score).toStrictEqual(1010000);
            expect(unit.rank).toStrictEqual(Rank.SSS);
            expect(unit.isClear).toStrictEqual(true);
            expect(unit.comboStatus).toStrictEqual(ComboStatus.AllJustice);
            expect(unit.chainStatus).toStrictEqual(ChainStatus.None);
            expect(unit.playDate).toEqual(new Date(2018, 9 - 1, 27, 22, 1));
            expect(unit.playCount).toStrictEqual(4);
        }
        {
            var unit = data.getExpert();
            expect(unit).not.toBeNull();
            expect(unit.difficulty).toStrictEqual(Difficulty.Expert);
            expect(unit.score).toStrictEqual(1006294);
            expect(unit.rank).toStrictEqual(Rank.SS);
            expect(unit.isClear).toStrictEqual(true);
            expect(unit.comboStatus).toStrictEqual(ComboStatus.None);
            expect(unit.chainStatus).toStrictEqual(ChainStatus.None);
            expect(unit.playDate).toEqual(new Date(2018, 10 - 1, 1, 21, 53));
            expect(unit.playCount).toStrictEqual(3);
        }
        {
            var unit = data.getMaster();
            expect(unit).not.toBeNull();
            expect(unit.difficulty).toStrictEqual(Difficulty.Master);
            expect(unit.score).toStrictEqual(991731);
            expect(unit.rank).toStrictEqual(Rank.S);
            expect(unit.isClear).toStrictEqual(true);
            expect(unit.comboStatus).toStrictEqual(ComboStatus.None);
            expect(unit.chainStatus).toStrictEqual(ChainStatus.None);
            expect(unit.playDate).toEqual(new Date(2018, 10 - 1, 7, 15, 21));
            expect(unit.playCount).toStrictEqual(7);
        }
    });
});
