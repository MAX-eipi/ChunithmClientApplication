import { ChunithmNetConnector } from "../../CoreTS/src/ChunithmNetConnector";
import { MusicGenre } from "../../CoreTS/src/musicGenre";
import { MusicLevel } from "../../CoreTS/src/musicLevel";
import { Difficulty, toDocument } from "../../CoreTS/src/Utility";
import { Connector } from "./Connector";

(async function () {
    let token = ChunithmNetConnector.getToken(document);
    if (!token) {
        alert("トークンが取得できません。取得可能なページで再度実行してください。");
        return;
    }

    var musicDataTable = new Array();
    var musicListIndex: string[] = new Array();
    {
        let musicGenreResult = await ChunithmNetConnector.post("record/musicGenre/sendBasic", { genre: "99", token: token }) as string;
        if (!musicGenreResult) {
            alert("楽曲リストの取得に失敗しました");
            return;
        }

        let parser = new MusicGenre.Parser();
        var musicGenre = parser.parse(toDocument(musicGenreResult));
        for (let unit of musicGenre.units) {
            let musicId = unit.id.toString();
            musicListIndex.push(musicId);
            musicDataTable[musicId] = {
                Id: unit.id,
                Name: unit.name,
                Genre: unit.genre,
                BasicLevel: 0,
                AdvancedLevel: 0,
                ExpertLevel: 0,
                MasterLevel: 0,
                BasicVerified: false,
                AdvancedVerified: false,
                ExpertVerified: false,
                MasterVerified: false,
            };
        }
    }
    {
        const MAX_LEVEL = 20;
        let musicLevelResult: string[] = new Array();
        for (var i = 0; i <= MAX_LEVEL; i++) {
            let level = i;
            musicLevelResult[i] = await ChunithmNetConnector.post("record/musicLevel/sendSearch", { level: level.toString(), token: token }) as string;
            if (!musicLevelResult[i]) {
                alert("楽曲リストの取得に失敗しました");
                return;
            }
        }

        let parser = new MusicLevel.Parser();
        for (var i = 0; i < musicLevelResult.length; i++) {
            let musicLevel = parser.parse(toDocument(musicLevelResult[i]));
            for (let unit of musicLevel.units) {
                let musicId = unit.id.toString();
                switch (unit.difficulty) {
                    case Difficulty.Basic:
                        musicDataTable[musicId].BasicLevel = unit.level;
                        break;
                    case Difficulty.Advanced:
                        musicDataTable[musicId].AdvancedLevel = unit.level;
                        break;
                    case Difficulty.Expert:
                        musicDataTable[musicId].ExpertLevel = unit.level;
                        break;
                    case Difficulty.Master:
                        musicDataTable[musicId].MasterLevel = unit.level;
                        break;
                }
            }
        }
    }

    var musicList = new Array();
    for (let musicId of musicListIndex) {
        let unit = musicDataTable[musicId];
        musicList.push(unit);
    }

    let connector = new Connector(Connector.RELEASE_URL);
    var updateResult = await connector.post({ API: "table/update", MusicDatas: musicList });
    if (updateResult) {
        alert("楽曲リストの更新に成功しました");
    }
    else {
        alert("楽曲リストの更新に失敗しました");
    }
})();