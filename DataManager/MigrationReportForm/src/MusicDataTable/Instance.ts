import { MusicData } from "./MusicData";
import { MusicDataTable } from "./MusicDataTable";
import { MusicDataTableWriter } from "./MusicDataTableWriter";
import { Configuration } from "./Configuration";

export class Instance {
    private config: Configuration;

    public constructor(config: Configuration) {
        this.config = config;
    }

    public updateTable(parameters: any[]): MusicDataTable {
        let sheet = this.config.musicDataSheet;
        let oldMusicDataTable = MusicDataTable.createBySheet(sheet);
        let newMusicDataTable = MusicDataTable.createByParameters(parameters);
        let musicDataTable = MusicDataTable.mergeMusicDataTable(oldMusicDataTable, newMusicDataTable);
        let writer = new MusicDataTableWriter(musicDataTable);
        writer.writeTable(sheet);
        return musicDataTable;
    }

    public getTable(): MusicDataTable {
        let sheet = this.config.musicDataSheet;
        let musicDataTable = MusicDataTable.createBySheet(sheet);
        return musicDataTable;
    }

    public updateMusicData(parameters: any[]): MusicData[] {
        let sheet = this.config.musicDataSheet;
        let musicDataTable = MusicDataTable.createBySheet(sheet);
        let musicDatas = parameters.map(function (p) { return MusicData.createByParameter(p); });
        let updated = musicDataTable.updateMusicDatas(musicDatas);
        let writer = new MusicDataTableWriter(musicDataTable);
        writer.writeTable(sheet);
        return updated;
    }
}