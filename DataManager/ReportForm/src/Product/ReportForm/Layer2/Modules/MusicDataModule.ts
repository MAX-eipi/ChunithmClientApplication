import { MusicData, MusicDataParameter } from "../MusicDataTable/MusicData";
import { MusicDataTable } from "../MusicDataTable/MusicDataTable";
import { MusicDataTableWriter } from "../MusicDataTable/MusicDataTableWriter";
import { ReportFormModule } from "./@ReportFormModule";
import { VersionModule } from "./VersionModule";

export class MusicDataModule extends ReportFormModule {
    private get versionModule(): VersionModule { return this.getModule(VersionModule); }

    private _tables: { [key: string]: MusicDataTable } = {};

    public getTable(versionName: string): MusicDataTable {
        if (this._tables[versionName]) {
            return this._tables[versionName];
        }

        let versionConfig = this.versionModule.getVersionConfig(versionName);
        if (!versionConfig) {
            return null;
        }

        let sheet = SpreadsheetApp
            .openById(versionConfig.musicDataTableSpreadsheetId)
            .getSheetByName(versionConfig.musicDataTableWorksheetName);
        this._tables[versionName] = MusicDataTable.createBySheet(sheet);
        return this._tables[versionName];
    }

    public updateTable(versionName: string, parameters: MusicDataParameter[]): MusicDataTable {
        let oldTable = this.getTable(versionName);
        let newTable = MusicDataTable.createByParameters(parameters);

        let musicDataTable = MusicDataTable.mergeMusicDataTable(oldTable, newTable);
        let writer = new MusicDataTableWriter(musicDataTable);
        let sheet = this.getSheet(versionName);
        writer.writeTable(sheet);

        this._tables[versionName] = musicDataTable;
        return this._tables[versionName];
    }

    public updateMusicData(versionName: string, parameters: MusicDataParameter[]): MusicData[] {
        let table = this.getTable(versionName);
        let musicDatas = parameters.map(p => MusicData.createByParameter(p));
        let updated = table.updateMusicDatas(musicDatas);

        let writer = new MusicDataTableWriter(table);
        let sheet = this.getSheet(versionName);
        writer.writeTable(sheet);

        return updated;
    }

    private getSheet(versionName: string): GoogleAppsScript.Spreadsheet.Sheet {
        let versionConfig = this.versionModule.getVersionConfig(versionName);
        return SpreadsheetApp
            .openById(versionConfig.musicDataTableSpreadsheetId)
            .getSheetByName(versionConfig.musicDataTableWorksheetName);
    }
}
