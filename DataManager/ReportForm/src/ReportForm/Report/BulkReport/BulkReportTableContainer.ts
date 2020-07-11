import { MusicDataTable } from "../../../MusicDataTable/MusicDataTable";
import { BulkReportTable } from "./BulkReportTable";

export class BulkReportTableContainer {
    private _tables: BulkReportTable[] = [];
    private _nameMap: { [key: string]: number } = {};

    public push(table: BulkReportTable): void {
        const length = this._tables.push(table);
        this._nameMap[table.tableName] = length - 1;
    }

    public getTable(tableName: string): BulkReportTable {
        const index = this._nameMap[tableName];
        return this._tables[index];
    }

    public getTables(): BulkReportTable[] {
        return this._tables.slice();
    }

    public update(newMusicDataTable: MusicDataTable, oldMusicDataTable: MusicDataTable): void {
        for (const table of this._tables) {
            table.updateMusicDataTable(newMusicDataTable, oldMusicDataTable);
        }
    }
}