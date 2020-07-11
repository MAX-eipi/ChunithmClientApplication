import { ConfigurationPropertyName } from "../../Configurations/ConfigurationDefinition";
import { ReportFormConfiguration } from "./@ReportFormConfiguration";

export class ReportConfiguration extends ReportFormConfiguration {
    public get reportFormId(): string { return this.getProperty(ConfigurationPropertyName.REPORT_GOOGLE_FORM_ID, ''); }
    public get bulkReportFormId(): string { return this.getProperty(ConfigurationPropertyName.BULK_REPORT_GOOGLE_FORM_ID, ''); }
}