import { BulkReportTableContainer } from "./BulkReportTableContainer";
import { BulkReportTableHeader } from "./BulkReportTableHeader";
import { BulkReportTable } from "./BulkReportTable";
import { BulkReportTableRow } from "./BulkReportTableRow";
import { Difficulty } from "../../../MusicDataTable/Difficulty";

export class BulkReportTableReader {
    public read(
        spreadsheetId: string,
        headerSheetName: string = 'header',
        basicSheetName: string = 'basic',
        advancedSheetName: string = 'advanced',
        expertSheetName: string = 'expert',
        masterSheetName: string = 'master'
    ): BulkReportTableContainer {
        let spreadsheet = SpreadsheetApp.openById(spreadsheetId);
        if (!spreadsheet) {
            throw new Error(`Spreadsheet not found. (${spreadsheetId})`);
        }

        const header = this.createHeader(spreadsheet.getSheetByName(headerSheetName));
        const basicTable = this.createTable(header, spreadsheet, basicSheetName, Difficulty.Basic);
        const advancedTable = this.createTable(header, spreadsheet, advancedSheetName, Difficulty.Advanced);
        const exportTable = this.createTable(header, spreadsheet, expertSheetName, Difficulty.Expert);
        const masterTable = this.createTable(header, spreadsheet, masterSheetName, Difficulty.Master);

        const container = new BulkReportTableContainer();
        container.push(basicTable);
        container.push(advancedTable);
        container.push(exportTable);
        container.push(masterTable);
        return container;
    }

    private createHeader(sheet: GoogleAppsScript.Spreadsheet.Sheet): BulkReportTableHeader {
        const header = new BulkReportTableHeader();
        const values = sheet.getDataRange().getValues();
        for (var i = 1; i < values.length; i++) {
            header.push(values[i][0], values[i][1], values[i][2]);
        }
        return header;
    }

    private createTable(header: BulkReportTableHeader, spreadsheet: GoogleAppsScript.Spreadsheet.Spreadsheet, sheetName: string, difficulty: Difficulty): BulkReportTable {
        const sheet = spreadsheet.getSheetByName(sheetName);
        const table = new BulkReportTable(header, sheetName, difficulty);
        const values = sheet.getDataRange().getValues();
        const columnLength = header.columns.length;
        const oldColumnMap: { [key: string]: number } = {};
        for (var i = 0; i < columnLength; i++) {
            const column = header.columns[i];
            for (var j = 0; j < values[0].length; j++) {
                if (column.name == values[0][j]) {
                    oldColumnMap[column.name] = j;
                    break;
                }
            }
        }
        for (var i = 1; i < values.length; i++) {
            const row = new BulkReportTableRow(header);
            for (var j = 0; j < columnLength; j++) {
                const columnName = header.columns[j].name;
                if (columnName in oldColumnMap) {
                    row.push(values[i][oldColumnMap[columnName]]);
                }
                else {
                    row.push('');
                }
            }
            table.push(row);
        }
        return table;
    }
}