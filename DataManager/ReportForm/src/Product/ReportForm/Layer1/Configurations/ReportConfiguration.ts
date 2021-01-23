import { ReportFormConfiguration } from "./@ReportFormConfiguration";

export class ReportConfiguration extends ReportFormConfiguration {
    public get reportFormId(): string { return this.global.reportFormId; }
    public get bulkReportFormId(): string { return this.global.bulkReportFormId; }
}
