import { BulkReportTableHeader } from "./BulkReportTableHeader";
import { BulkReportTableRow } from "./BulkReportTableRow";
import { MusicDataTable } from "../../../MusicDataTable/MusicDataTable";
import { Difficulty } from "../../../MusicDataTable/Difficulty";

export class BulkReportTable {
    private _header: BulkReportTableHeader = null;
    private _tableName: string = null;
    private _difficulty: Difficulty;
    private _rows: BulkReportTableRow[] = [];
    private _idMap: { [key: number]: number } = {};

    public constructor(header: BulkReportTableHeader, tableName: string, difficulty: Difficulty) {
        this._header = header;
        this._tableName = tableName;
        this._difficulty = difficulty;
    }

    public push(row: BulkReportTableRow): number {
        const length = this._rows.push(row);
        this._idMap[row.id] = length - 1;
        return length;
    }

    public get tableName(): string {
        return this._tableName;
    }
    public get difficluty(): Difficulty {
        return this._difficulty;
    }
    public get header(): BulkReportTableHeader {
        return this._header;
    }
    public get rows(): BulkReportTableRow[] {
        return this._rows.slice();
    }

    public updateMusicDataTable(newMusicDataTable: MusicDataTable, oldMusicDataTable: MusicDataTable = null): void {
        const oldRows = this._rows;
        const oldIdMap = this._idMap;
        this._rows = [];
        this._idMap = {};
        for (var i = 0; i < newMusicDataTable.datas.length; i++) {
            var musicId = newMusicDataTable.datas[i].Id;
            if (musicId in oldIdMap) {
                const row = oldRows[oldIdMap[musicId]];
                row.update(i, this._difficulty, newMusicDataTable, oldMusicDataTable);
                this.push(row);
            }
            else {
                const row = BulkReportTableRow.create(i, musicId, this._difficulty, this._header, newMusicDataTable, oldMusicDataTable);
                this.push(row);
            }
        }
    }
}