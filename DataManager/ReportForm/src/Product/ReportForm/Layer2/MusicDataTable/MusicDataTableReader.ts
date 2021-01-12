import { MusicDataTable } from "./MusicDataTable";

export class MusicDataTableReader {
    public readFromTable(sheet: GoogleAppsScript.Spreadsheet.Sheet): MusicDataTable {
        return MusicDataTable.createBySheet(sheet);
    }
}