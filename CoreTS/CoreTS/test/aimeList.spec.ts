import { AimeList } from "../src/AimeList";
import { loadDocument } from "./TestUtility";

describe("AimeList", () => {
    var parser = new AimeList.Parser();
    it("Parser Test 1", () => {
        var aimeList = parser.parse(loadDocument("AimeList/html_test_case_1.html"));
        expect(aimeList).not.toBeNull();

        var units = aimeList.units;
        expect(units.length).toBe(1);
        {
            var unit = units[0];
            expect(unit.rebornCount).toBe(0);
            expect(unit.level).toBe(9);
            expect(unit.name).toBe("＊＊＊＊＊＊＊＊");
            expect(unit.nowRating).toBe(15.37);
            expect(unit.maxRating).toBe(15.49);
        }
    });

    it("Parser Test Error", () => {
        var data = parser.parse(loadDocument("AimeList/html_test_case_error_1.html"));
        expect(data).toBeNull();
    });
});