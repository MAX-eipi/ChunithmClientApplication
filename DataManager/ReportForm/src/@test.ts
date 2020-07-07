import { Instance } from "./ReportForm/Instance";
import { BulkReportTableReader } from "./ReportForm/Report/BulkReportInput/BulkReportTableReader";
import { BulkReportTableWriter } from "./ReportForm/Report/BulkReportInput/BulkReportTableWriter";

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