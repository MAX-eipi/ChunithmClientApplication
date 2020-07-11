import { BulkReportTableContainer } from "./BulkReportTableContainer";
import { BulkReportTable } from "./BulkReportTable";

export class BulkReportTableWriter {
    public write(spreadsheetId: string, bulkReportTableContainer: BulkReportTableContainer): void {
        const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
        if (!spreadsheet) {
            throw new Error(`Spreadsheet not found. (${spreadsheetId})`);
        }

        const tables = bulkReportTableContainer.getTables();
        for (const table of tables) {
            this.writeByTable(spreadsheet, table);
        }
    }

    private writeByTable(spreadsheet: GoogleAppsScript.Spreadsheet.Spreadsheet, table: BulkReportTable): void {
        const sheet = spreadsheet.getSheetByName(table.tableName);
        const header = table.header;
        const rows = table.rows;
        const values = [];
        values.push(header.columns.map(c => c.name));
        for (const row of rows) {
            values.push(row.getRawValues());
        }

        sheet.clear();
        sheet.getFilter().remove();

        const sheetRange = sheet.getRange(1, 1, values.length, header.columns.length);
        sheetRange.setValues(values);
        sheetRange.createFilter();

        for (let i = 0; i < header.columns.length; i++) {
            if (header.columns[i].protect) {
                const range = sheet.getRange(1, i + 1, values.length, 1);
                range.protect();
                range.setBackground('#d9d9d9');
            }
        }

        const headerRange = sheet.getRange(1, 1, 1, header.columns.length);
        headerRange.protect();
        headerRange.setBackground('#cfe2f3');
    }
}