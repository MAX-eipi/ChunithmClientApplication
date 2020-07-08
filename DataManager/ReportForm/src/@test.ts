import { Instance } from "./ReportForm/Instance";
import { BulkReportTableReader } from "./ReportForm/Report/BulkReportInput/BulkReportTableReader";
import { BulkReportTableWriter } from "./ReportForm/Report/BulkReportInput/BulkReportTableWriter";
import { ReportStorage, PostLocation } from "./ReportForm/Report/ReportStorage";
import { ReportInputFormat } from "./ReportForm/Report/ReportInputFormat";
import { Difficulty } from "./MusicDataTable/Difficulty";
import { ComboStatus } from "./ReportForm/Rating";

function testUpdateBulkSheet(): void {
    Instance.initialize();
    const spreadsheetId = '1xXuS7ZJFuVdw0czMgsN1ymDo1v6XYUAiLMNUtpShSUg';
    const table = Instance.instance.module.musicData.getTable("Dev3");
    const reader = new BulkReportTableReader();
    const container = reader.read(spreadsheetId, 'Header', 'BASIC', 'ADVANCED', 'EXPERT', 'MASTER');
    container.update(table, table);
    const writer = new BulkReportTableWriter();
    writer.write(spreadsheetId, container);
}

function testInsertReport(): void {
    Instance.initialize();
    const spreadsheetId = '1HILuSsNTgJAp1dH57JJlt_0TjFugOt5GhnvwEdsrAg0';
    const table = Instance.instance.module.musicData.getTable("Dev3");
    const storage = new ReportStorage(table, spreadsheetId, 'Report');
    const reportInput: ReportInputFormat = {
        musicId: 892,
        difficulty: Difficulty.Basic,
        score: 1010000,
        beforeOp: 0,
        afterOp: 30,
        comboStatus: ComboStatus.AllJustice,
    };
    storage.push(reportInput, PostLocation.GoogleForm);
    storage.write();
}