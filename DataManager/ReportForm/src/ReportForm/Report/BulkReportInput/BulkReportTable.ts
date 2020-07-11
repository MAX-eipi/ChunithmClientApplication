import { BulkReportTableHeader } from "./BulkReportTableHeader";
import { BulkReportTableRow } from "./BulkReportTableRow";
import { MusicDataTable } from "../../../MusicDataTable/MusicDataTable";
import { Difficulty } from "../../../MusicDataTable/Difficulty";

export class BulkReportTable {
    private _rows: BulkReportTableRow[] = [];
    private _idMap: { [key: number]: number } = {};

    public constructor(private readonly _header: BulkReportTableHeader, private readonly _tableName: string, private readonly _difficulty: Difficulty) {
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
        for (let i = 0; i < newMusicDataTable.datas.length; i++) {
            const musicId = newMusicDataTable.datas[i].Id;
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