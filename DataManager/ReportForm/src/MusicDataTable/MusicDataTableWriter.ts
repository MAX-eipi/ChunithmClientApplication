import { MusicDataTable } from "./MusicDataTable";

export class MusicDataTableWriter {
    private musicDataTable: MusicDataTable;

    public constructor(musicDataTable: MusicDataTable) {
        this.setMusicDataTable(musicDataTable);
    }

    public setMusicDataTable(musicDataTable: MusicDataTable): void {
        this.musicDataTable = musicDataTable;
    }

    public writeTable(sheet: GoogleAppsScript.Spreadsheet.Sheet): void {
        let table = this.musicDataTable.getTable();

        let rows = new Array();
        var columnLength = 0;
        for (var i = 0; i < table.length; i++) {
            var row = new Array();
            row.push(i + 1);
            row.push(table[i].Id);
            row.push("'" + table[i].Name);
            row.push(table[i].Genre);
            row.push(table[i].BasicLevel);
            row.push(table[i].AdvancedLevel);
            row.push(table[i].ExpertLevel);
            row.push(table[i].MasterLevel);
            row.push(table[i].BasicVerified);
            row.push(table[i].AdvancedVerified);
            row.push(table[i].ExpertVerified);
            row.push(table[i].MasterVerified);
            columnLength = Math.max(columnLength, row.length);
            rows.push(row);
        }

        let header = [
            "番号",
            "ID",
            "楽曲名",
            "ジャンル",
            "BASIC",
            "ADVANCED",
            "EXPERT",
            "MASTER",
            "BASIC 検証",
            "ADVANCED 検証",
            "EXPERT 検証",
            "MASTER 検証",
        ];
        sheet.clear();
        if (header && header.length > 0) {
            sheet.getRange(1, 1, 1, header.length).setValues([header]);
        }
        sheet.getRange(2, 1, rows.length, columnLength).setValues(rows);
    }
}