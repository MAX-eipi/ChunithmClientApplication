import { Difficulty } from "../../MusicDataTable/Difficulty";
import { MusicData } from "../../MusicDataTable/MusicData";
import { MusicDataTable } from "../../MusicDataTable/MusicDataTable";

export class BulkReportInputSheet {
    private _headerSheet: GoogleAppsScript.Spreadsheet.Sheet = null;
    private _sheets: { [key: number]: GoogleAppsScript.Spreadsheet.Sheet } = {};
    private _previousMusicDataTable: MusicDataTable = null;
    private _currentMusicDataTable: MusicDataTable = null;

    private _nameValuePairs: { name: string, value: string, protected: boolean }[] = [];
    private _idColumnName: string = null;

    public constructor(
        spreadsheetId: string,
        headerSheetName: string = "header",
        basicSheetName: string = "BASIC",
        advancedSheetName: string = "ADVANCED",
        expertSheetName: string = "EXPERT",
        masterSheetName: string = "MASTER",
        previousMusicDataTable: MusicDataTable = null,
        currentMusicDataTable: MusicDataTable = null
    ) {
        let spreadsheet = SpreadsheetApp.openById(spreadsheetId);
        if (!spreadsheet) {
            throw new Error(`Spreadsheet not found. (${spreadsheetId})`);
        }

        this._headerSheet = spreadsheet.getSheetByName(headerSheetName);

        this._sheets[Difficulty.Basic] = spreadsheet.getSheetByName(basicSheetName);
        this._sheets[Difficulty.Advanced] = spreadsheet.getSheetByName(advancedSheetName);
        this._sheets[Difficulty.Expert] = spreadsheet.getSheetByName(expertSheetName);
        this._sheets[Difficulty.Master] = spreadsheet.getSheetByName(masterSheetName);

        this._previousMusicDataTable = previousMusicDataTable;
        this._currentMusicDataTable = currentMusicDataTable;

        this.buildNameValuePairs();
    }

    private buildNameValuePairs(): void {
        this._nameValuePairs.length = 0;
        const values = this._headerSheet.getDataRange().getValues();
        for (var i = 1; i < values.length; i++) {
            this._nameValuePairs.push({
                name: values[i][0],
                value: values[i][1],
                protected: values[i][2],
            });
            if (values[i][1] == '@id') {
                this._idColumnName = values[i][0];
            }
        }
    }

    public updateSheet(): void {
        this.updateSheetByDifficulty(Difficulty.Basic);
        this.updateSheetByDifficulty(Difficulty.Advanced);
        this.updateSheetByDifficulty(Difficulty.Expert);
        this.updateSheetByDifficulty(Difficulty.Master);
    }

    private updateSheetByDifficulty(difficulty: Difficulty): void {
        const previousDatas: { [key: number]: { [key: string]: Object } } = {};
        {
            const values = this._sheets[difficulty].getDataRange().getValues();
            for (var i = 1; i < values.length; i++) {
                const row = {};
                for (var j = 0; j < values[i].length; j++) {
                    row[values[0][j]] = values[i][j];
                }
                previousDatas[row[this._idColumnName]] = row;
            }
        }

        var datas = [];
        datas.push(this._nameValuePairs.map(p => p.name));
        const table = this._currentMusicDataTable.getTable();
        for (var i = 0; i < table.length; i++) {
            const musicData = table[i];
            const row = this._nameValuePairs.map(p => this.getValue(i + 1, p.name, musicData, difficulty, p.value, previousDatas[musicData.Id]));
            Logger.log(row.length);
            datas.push(row);
        }

        this._sheets[difficulty].clear();
        this._sheets[difficulty].getFilter().remove();

        const sheetRange = this._sheets[difficulty].getRange(1, 1, datas.length, this._nameValuePairs.length);
        sheetRange.setValues(datas);
        sheetRange.createFilter();

        for (var i = 0; i < this._nameValuePairs.length; i++) {
            if (this._nameValuePairs[i].protected) {
                const range = this._sheets[difficulty].getRange(1, i + 1, datas.length, 1);
                range.protect();
                range.setBackground('#d9d9d9');
            }
        }

        const headerRange = this._sheets[difficulty].getRange(1, 1, 1, this._nameValuePairs.length);
        headerRange.protect();
        headerRange.setBackground('#cfe2f3');
    }

    private getValue(
        index: number,
        columnName: string,
        musicData: MusicData,
        difficulty: Difficulty,
        value: string,
        previousData: { [key: string]: Object }
    ): any {
        if (value.indexOf('@') != 0) {
            return value;
        }
        switch (value) {
            case '@index':
                return index;
            case '@id':
                return musicData.Id;
            case '@name':
                return `'${musicData.Name}`;
            case '@previousBaseRating': {
                if (this._previousMusicDataTable == null) {
                    return '';
                }
                const md = this._previousMusicDataTable.getMusicDataById(musicData.Id);
                if (!md) {
                    return '';
                }
                return md.getLevel(difficulty);
            }
            case '@score':
                return previousData != null ? previousData[columnName] : '';
            case '@opBefore':
                return previousData != null ? previousData[columnName] || 0 : 0;
            case '@opAfter':
                return previousData != null ? previousData[columnName] : '';
            case '@comboStatus':
                return previousData != null ? previousData[columnName] || 'None' : 'None';
        }
        if (value.indexOf('@input:') == 0) {
            if (previousData != null) {
                const ret = previousData[columnName];
                return ret ? ret : value.replace('@input:', '');
            }
            else {
                return value.replace('@input:', '');
            }
        }
        return value;
    }
}