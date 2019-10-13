import { Playlog } from "../src/Playlog";
import { ChainStatus, ComboStatus, Difficulty, Rank } from "../src/Utility";
import { loadDocument } from "./TestUtility";

describe("Playlog", () => {
    var parser = new Playlog.Parser();
    it("Parser Test 1", () => {
        var data = parser.parse(loadDocument("Playlog/html_test_case_1.html"));
        expect(data).not.toBeNull();

        var units = data.units;
        expect(units.length).toStrictEqual(50);
        {
            var unit = units[49];
            expect(unit).not.toBeNull();
            expect(unit.name).toStrictEqual("Summer is over");
            expect(unit.imageName).toStrictEqual("https://chunithm-net.com/mobile/img/7f762cd037e10951.jpg");
            expect(unit.difficulty).toStrictEqual(Difficulty.Master);
            expect(unit.score).toStrictEqual(1008965);
            expect(unit.rank).toStrictEqual(Rank.SSS);
            expect(unit.isClear).toStrictEqual(true);
            expect(unit.isNewRecord).toStrictEqual(true);
            expect(unit.comboStatus).toStrictEqual(ComboStatus.None);
            expect(unit.chainStatus).toStrictEqual(ChainStatus.None);
            expect(unit.track).toStrictEqual(3);
            expect(unit.playDate).toEqual(new Date(2018, 11 - 1, 5, 21, 49, 0));
        }
        {
            var unit = units[45];
            expect(unit).not.toBeNull();
            expect(unit.name).toStrictEqual("Kronos");
            expect(unit.imageName).toStrictEqual("https://chunithm-net.com/mobile/img/9c5e71b3588dbc70.jpg");
            expect(unit.difficulty).toStrictEqual(Difficulty.Expert);
            expect(unit.score).toStrictEqual(831635);
            expect(unit.rank).toStrictEqual(Rank.BBB);
            expect(unit.isClear).toStrictEqual(false);
            expect(unit.isNewRecord).toStrictEqual(false);
            expect(unit.comboStatus).toStrictEqual(ComboStatus.None);
            expect(unit.chainStatus).toStrictEqual(ChainStatus.None);
            expect(unit.track).toStrictEqual(2);
            expect(unit.playDate).toEqual(new Date(2018, 11 - 1, 5, 21, 34, 0));
        }
    })

    it("Parser Test Error", () => {
        var data = parser.parse(loadDocument("Common/error_page.html"));
        expect(data).toBeNull();
    });
});
