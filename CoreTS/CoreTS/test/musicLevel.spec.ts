import { MusicLevel } from '../src/MusicLevel';
import { ChainStatus, ComboStatus, Difficulty, Rank } from '../src/Utility';
import { loadDocument } from './TestUtility';

describe("MusicLevel", () => {
    var parser = new MusicLevel.Parser();
    it("Parser Test 1", () => {
        var data = parser.parse(loadDocument("MusicLevel/html_test_case_1.html"));
        expect(data).not.toBeNull();

        expect(data.musicCount).toStrictEqual(41);
        expect(data.clearCount).toStrictEqual(39);
        expect(data.sCount).toStrictEqual(39);
        expect(data.ssCount).toStrictEqual(39);
        expect(data.sssCount).toStrictEqual(39);
        expect(data.fullComboCount).toStrictEqual(39);
        expect(data.allJusticeCount).toStrictEqual(39);
        expect(data.fullChainGoldCount).toStrictEqual(0);
        expect(data.fullChainPlatinumCount).toStrictEqual(0);

        var units = data.units;
        expect(units.length).toStrictEqual(3);
        {
            var unit = units[0];
            expect(unit).not.toBeNull();
            expect(unit.id).toStrictEqual(531);
            expect(unit.name).toStrictEqual("ホーリーナイト");
            expect(unit.difficulty).toStrictEqual(Difficulty.Master);
            expect(unit.level).toStrictEqual(10.7);
            expect(unit.score).toStrictEqual(1009974);
            expect(unit.rank).toStrictEqual(Rank.SSS);
            expect(unit.isClear).toStrictEqual(true);
            expect(unit.comboStatus).toStrictEqual(ComboStatus.AllJustice);
            expect(unit.chainStatus).toStrictEqual(ChainStatus.None);
        }
        {
            var unit = units[1];
            expect(unit).not.toBeNull();
            expect(unit.id).toStrictEqual(138);
            expect(unit.name).toStrictEqual("conflict");
            expect(unit.difficulty).toStrictEqual(Difficulty.Expert);
            expect(unit.level).toStrictEqual(10.7);
            expect(unit.score).toStrictEqual(1010000);
            expect(unit.rank).toStrictEqual(Rank.SSS);
            expect(unit.isClear).toStrictEqual(true);
            expect(unit.comboStatus).toStrictEqual(ComboStatus.AllJustice);
            expect(unit.chainStatus).toStrictEqual(ChainStatus.None);
        }
        {
            var unit = units[2];
            expect(unit).not.toBeNull();
            expect(unit.id).toStrictEqual(692);
            expect(unit.name).toStrictEqual("足立オウフwwww");
            expect(unit.difficulty).toStrictEqual(Difficulty.Expert);
            expect(unit.level).toStrictEqual(10.7);
            expect(unit.score).toStrictEqual(0);
            expect(unit.rank).toStrictEqual(Rank.None);
            expect(unit.isClear).toStrictEqual(false);
            expect(unit.comboStatus).toStrictEqual(ComboStatus.None);
            expect(unit.chainStatus).toStrictEqual(ChainStatus.None);
        }
    });

    it("Parser Test 2", () => {
        var data = parser.parse(loadDocument("MusicLevel/html_test_case_2.html"));
        expect(data).not.toBeNull();

        expect(data.musicCount).toStrictEqual(219);
        expect(data.clearCount).toStrictEqual(215);
        expect(data.sCount).toStrictEqual(215);
        expect(data.ssCount).toStrictEqual(215);
        expect(data.sssCount).toStrictEqual(215);
        expect(data.fullComboCount).toStrictEqual(208);
        expect(data.allJusticeCount).toStrictEqual(192);
        expect(data.fullChainGoldCount).toStrictEqual(2);
        expect(data.fullChainPlatinumCount).toStrictEqual(2);

        var units = data.units;
        expect(units.length).toStrictEqual(2);
        {
            var unit = units[0];
            expect(unit).not.toBeNull();
            expect(unit.id).toStrictEqual(354);
            expect(unit.name).toStrictEqual("ラブリー☆えんじぇる!!");
            expect(unit.difficulty).toStrictEqual(Difficulty.Master);
            expect(unit.level).toStrictEqual(12.0);
            expect(unit.score).toStrictEqual(1009957);
            expect(unit.rank).toStrictEqual(Rank.SSS);
            expect(unit.isClear).toStrictEqual(true);
            expect(unit.comboStatus).toStrictEqual(ComboStatus.AllJustice);
            expect(unit.chainStatus).toStrictEqual(ChainStatus.FullChainPlatinum);
        }
        {
            var unit = units[1];
            expect(unit).not.toBeNull();
            expect(unit.id).toStrictEqual(626);
            expect(unit.name).toStrictEqual("アンノウン・マザーグース");
            expect(unit.difficulty).toStrictEqual(Difficulty.Master);
            expect(unit.level).toStrictEqual(12.0);
            expect(unit.score).toStrictEqual(1009614);
            expect(unit.rank).toStrictEqual(Rank.SSS);
            expect(unit.isClear).toStrictEqual(true);
            expect(unit.comboStatus).toStrictEqual(ComboStatus.FullCombo);
            expect(unit.chainStatus).toStrictEqual(ChainStatus.None);
        }
    });

    it("Parser Test Error", () => {
        var data = parser.parse(loadDocument("Common/error_page.html"));
        expect(data).toBeNull();
    });
});
