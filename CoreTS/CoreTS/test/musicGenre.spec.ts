import { MusicGenre } from "../src/MusicGenre";
import { ChainStatus, ComboStatus, Difficulty, Genre, Rank } from "../src/Utility";
import { loadDocument } from "./TestUtility";

describe("MusicGenre", () => {
    var parser = new MusicGenre.Parser();
    it("Parser Test 1", () => {
        var data = parser.parse(loadDocument("MusicGenre/html_test_case_1.html"));
        expect(data).not.toBeNull();

        expect(data.musicCount).toStrictEqual(535);
        expect(data.clearCount).toStrictEqual(524);
        expect(data.sCount).toStrictEqual(524);
        expect(data.ssCount).toStrictEqual(516);
        expect(data.sssCount).toStrictEqual(476);
        expect(data.fullComboCount).toStrictEqual(441);
        expect(data.allJusticeCount).toStrictEqual(372);
        expect(data.fullChainGoldCount).toStrictEqual(7);
        expect(data.fullChainPlatinumCount).toStrictEqual(7);

        var units = data.units;
        expect(units.length).toStrictEqual(7);
        {
            var unit = units[0];
            expect(unit).not.toBeNull();
            expect(unit.id).toStrictEqual(639);
            expect(unit.name).toStrictEqual("sister's noise");
            expect(unit.genre).toStrictEqual(Genre.POPS_AND_ANIME);
            expect(unit.difficulty).toStrictEqual(Difficulty.Master);
            expect(unit.score).toStrictEqual(1009974);
            expect(unit.rank).toStrictEqual(Rank.SSS);
            expect(unit.isClear).toStrictEqual(true);
            expect(unit.comboStatus).toStrictEqual(ComboStatus.AllJustice);
            expect(unit.chainStatus).toStrictEqual(ChainStatus.None);
        }
        {
            var unit = units[1];
            expect(unit).not.toBeNull();
            expect(unit.id).toStrictEqual(583);
            expect(unit.name).toStrictEqual("碧き孤島のアングゥィス");
            expect(unit.genre).toStrictEqual(Genre.POPS_AND_ANIME);
            expect(unit.difficulty).toStrictEqual(Difficulty.Master);
            expect(unit.score).toStrictEqual(1008683);
            expect(unit.rank).toStrictEqual(Rank.SSS);
            expect(unit.isClear).toStrictEqual(true);
            expect(unit.comboStatus).toStrictEqual(ComboStatus.None);
            expect(unit.chainStatus).toStrictEqual(ChainStatus.None);
        }
        {
            var unit = units[2];
            expect(unit).not.toBeNull();
            expect(unit.id).toStrictEqual(363);
            expect(unit.name).toStrictEqual("true my heart -Lovable mix-");
            expect(unit.genre).toStrictEqual(Genre.POPS_AND_ANIME);
            expect(unit.difficulty).toStrictEqual(Difficulty.Master);
            expect(unit.score).toStrictEqual(1009942);
            expect(unit.rank).toStrictEqual(Rank.SSS);
            expect(unit.isClear).toStrictEqual(true);
            expect(unit.comboStatus).toStrictEqual(ComboStatus.AllJustice);
            expect(unit.chainStatus).toStrictEqual(ChainStatus.FullChainPlatinum);
        }
        {
            var unit = units[3];
            expect(unit).not.toBeNull();
            expect(unit.id).toStrictEqual(159);
            expect(unit.name).toStrictEqual("ジングルベル");
            expect(unit.genre).toStrictEqual(Genre.POPS_AND_ANIME);
            expect(unit.difficulty).toStrictEqual(Difficulty.Master);
            expect(unit.score).toStrictEqual(1008382);
            expect(unit.rank).toStrictEqual(Rank.SSS);
            expect(unit.isClear).toStrictEqual(true);
            expect(unit.comboStatus).toStrictEqual(ComboStatus.FullCombo);
            expect(unit.chainStatus).toStrictEqual(ChainStatus.None);
        }
        {
            var unit = units[4];
            expect(unit).not.toBeNull();
            expect(unit.id).toStrictEqual(631);
            expect(unit.name).toStrictEqual("初音ミクの激唱");
            expect(unit.genre).toStrictEqual(Genre.niconico);
            expect(unit.difficulty).toStrictEqual(Difficulty.Master);
            expect(unit.score).toStrictEqual(1003448);
            expect(unit.rank).toStrictEqual(Rank.SS);
            expect(unit.isClear).toStrictEqual(true);
            expect(unit.comboStatus).toStrictEqual(ComboStatus.None);
            expect(unit.chainStatus).toStrictEqual(ChainStatus.None);
        }
        {
            var unit = units[5];
            expect(unit).not.toBeNull();
            expect(unit.id).toStrictEqual(713);
            expect(unit.name).toStrictEqual("larva");
            expect(unit.genre).toStrictEqual(Genre.ORIGINAL);
            expect(unit.difficulty).toStrictEqual(Difficulty.Master);
            expect(unit.score).toStrictEqual(0);
            expect(unit.rank).toStrictEqual(Rank.None);
            expect(unit.isClear).toStrictEqual(false);
            expect(unit.comboStatus).toStrictEqual(ComboStatus.None);
            expect(unit.chainStatus).toStrictEqual(ChainStatus.None);
        }
        {
            var unit = units[6];
            expect(unit).not.toBeNull();
            expect(unit.id).toStrictEqual(180);
            expect(unit.name).toStrictEqual("怒槌");
            expect(unit.genre).toStrictEqual(Genre.ORIGINAL);
            expect(unit.difficulty).toStrictEqual(Difficulty.Master);
            expect(unit.score).toStrictEqual(996370);
            expect(unit.rank).toStrictEqual(Rank.S);
            expect(unit.isClear).toStrictEqual(true);
            expect(unit.comboStatus).toStrictEqual(ComboStatus.None);
            expect(unit.chainStatus).toStrictEqual(ChainStatus.None);
        }
    });

    it("Parser Test Error", () => {
        var data = parser.parse(loadDocument("Common/error_page.html"));
        expect(data).toBeNull();
    });
});
