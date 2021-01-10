import { MusicData } from "../src/MusicDataTable/MusicData";
import { MusicDataTable } from "../src/MusicDataTable/MusicDataTable";


function createTestMusicDataTable(musicDatas: MusicData[]): MusicDataTable {
    return MusicDataTable.createByParameters(musicDatas);
}

function createMusicData(
    id: number,
    name: string,
    genre: string,
    basicLevel: number,
    advancedLevel: number,
    expertLevel: number,
    masterLevel: number,
    basicVerified: boolean,
    advancedVerified: boolean,
    expertVerified: boolean,
    masterVerified: boolean
): MusicData {
    const musicData = new MusicData();
    musicData.Id = id;
    musicData.Name = name;
    musicData.Genre = genre;
    musicData.BasicLevel = basicLevel;
    musicData.AdvancedLevel = advancedLevel;
    musicData.ExpertLevel = expertLevel;
    musicData.MasterLevel = masterLevel;
    musicData.BasicVerified = basicVerified;
    musicData.AdvancedVerified = advancedVerified;
    musicData.ExpertVerified = expertVerified;
    musicData.MasterVerified = masterVerified;
    return musicData;
}

describe("MusicDataTable", () => {
    const musicDatas = [
        createMusicData(421, "前前前世", "POPS & ANIME", 3, 5, 8.7, 11.7, false, false, false, false),
        createMusicData(525, "Paradisus-Paradoxum", "POPS & ANIME", 3, 6, 9, 12.4, false, false, false, true),
        createMusicData(526, "ようこそジャパリパークへ", "POPS & ANIME", 3, 5, 9, 12.1, false, false, false, true),
    ];
    const testDataTable = createTestMusicDataTable(musicDatas);

    it("Read", () => {
        expect(testDataTable.getTable()).toBeDefined();
        expect(testDataTable.getTable().length).toBe(musicDatas.length);
        {
            const musicData = testDataTable.getMusicDataById(421);
            expect(musicData).toMatchObject(createMusicData(421, "前前前世", "POPS & ANIME", 3, 5, 8.7, 11.7, false, false, false, false));
        }
        {
            const musicData = testDataTable.getMusicDataById(525);
            expect(musicData).toMatchObject(createMusicData(525, "Paradisus-Paradoxum", "POPS & ANIME", 3, 6, 9, 12.4, false, false, false, true));
        }
        {
            const musicData = testDataTable.getMusicDataById(526);
            expect(musicData).toMatchObject(createMusicData(526, "ようこそジャパリパークへ", "POPS & ANIME", 3, 5, 9, 12.1, false, false, false, true));
        }
    });

    it("Read JSON", () => {
        const json = '{"MusicDatas":[{"Id":421,"Name":"前前前世","Genre":"POPS & ANIME","BasicLevel":3,"AdvancedLevel":5,"ExpertLevel":8.7,"MasterLevel":11.7,"BasicVerified":false,"AdvancedVerified":false,"ExpertVerified":false,"MasterVerified":false},{"Id":525,"Name":"Paradisus-Paradoxum","Genre":"POPS & ANIME","BasicLevel":3,"AdvancedLevel":6,"ExpertLevel":9,"MasterLevel":12.4,"BasicVerified":false,"AdvancedVerified":false,"ExpertVerified":false,"MasterVerified":true},{"Id":526,"Name":"ようこそジャパリパークへ","Genre":"POPS & ANIME","BasicLevel":3,"AdvancedLevel":5,"ExpertLevel":9,"MasterLevel":12.1,"BasicVerified":false,"AdvancedVerified":false,"ExpertVerified":false,"MasterVerified":true}]}';
        const jsonDataTable = MusicDataTable.createByJson(json);
        for (const expected of testDataTable.getTable()) {
            const actual = jsonDataTable.getMusicDataById(expected.Id);
            expect(actual).toMatchObject(expected);
        }
    });
});

describe("MusicDataTable", () => {
    const oldMusicDatas = [
        createMusicData(421, "前前前世", "POPS & ANIME", 3, 5, 8.7, 11.7, false, false, false, false),
        createMusicData(525, "Paradisus-Paradoxum", "POPS & ANIME", 3, 6, 9, 12.4, false, false, false, true),
        createMusicData(526, "ようこそジャパリパークへ", "POPS & ANIME", 3, 5, 9, 12.1, false, false, false, true),
    ];
    const oldDataTable = createTestMusicDataTable(oldMusicDatas);

    const newMusicDatas = [
        createMusicData(419, "SAKURAスキップ", "POPS & ANIME", 3, 6, 9, 11.7, false, false, false, false),
        createMusicData(420, "Now Loading!!!!", "POPS & ANIME", 3, 5, 9, 12, false, false, false, false),
        createMusicData(502, "Clover Heart's", "POPS & ANIME", 3, 5, 8.7, 11.7, false, false, false, false),
        createMusicData(454, "ガチャガチャきゅ～と・ふぃぎゅ@メイト", "POPS & ANIME", 3, 6, 9, 12, false, false, false, false),
        createMusicData(455, "Vampire", "POPS & ANIME", 3, 5, 9.7, 12, false, false, false, false),
        createMusicData(421, "前前前世", "POPS & ANIME", 3, 5, 8.7, 11.7, false, false, false, false),
        createMusicData(525, "Paradisus-Paradoxum", "POPS & ANIME", 3, 6, 9, 12, false, false, false, false),
    ];
    const newDataTable = createTestMusicDataTable(newMusicDatas);

    const expectedMusicDatas = [
        createMusicData(419, "SAKURAスキップ", "POPS & ANIME", 3, 6, 9, 11.7, false, false, false, false),
        createMusicData(420, "Now Loading!!!!", "POPS & ANIME", 3, 5, 9, 12, false, false, false, false),
        createMusicData(502, "Clover Heart's", "POPS & ANIME", 3, 5, 8.7, 11.7, false, false, false, false),
        createMusicData(454, "ガチャガチャきゅ～と・ふぃぎゅ@メイト", "POPS & ANIME", 3, 6, 9, 12, false, false, false, false),
        createMusicData(455, "Vampire", "POPS & ANIME", 3, 5, 9.7, 12, false, false, false, false),
        createMusicData(421, "前前前世", "POPS & ANIME", 3, 5, 8.7, 11.7, false, false, false, false),
        createMusicData(525, "Paradisus-Paradoxum", "POPS & ANIME", 3, 6, 9, 12.4, false, false, false, true),
    ];
    const expectedDataTable = createTestMusicDataTable(expectedMusicDatas);

    it("Update", () => {
        const actualDataTable = MusicDataTable.mergeMusicDataTable(oldDataTable, newDataTable);
        for (const expected of expectedDataTable.getTable()) {
            const actual = actualDataTable.getMusicDataById(expected.Id);
            expect(actual).toMatchObject(expected);
        }
    });
});

describe("MusicDataTable", () => {
    const testDataTable = createTestMusicDataTable([
        createMusicData(421, "前前前世", "POPS & ANIME", 3, 5, 8.7, 11.7, false, false, false, false)
    ]);

    it("Update Music", () => {
        expect(testDataTable.updateMusicData(createMusicData(421, "前前前世", "POPS & ANIME", 3, 5, 8.7, 11.9, false, false, false, true))).toBeTruthy();
        expect(testDataTable.updateMusicData(createMusicData(525, "Paradisus-Paradoxum", "POPS & ANIME", 3, 6, 9, 12.4, false, false, false, true))).toBeFalsy();

        expect(testDataTable.getMusicDataById(421)).toMatchObject(createMusicData(421, "前前前世", "POPS & ANIME", 3, 5, 8.7, 11.9, false, false, false, true));
    });
});
