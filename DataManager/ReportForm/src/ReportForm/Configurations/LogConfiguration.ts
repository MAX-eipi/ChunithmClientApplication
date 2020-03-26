import { ReportFormConfiguration } from "./@ReportFormConfiguration";
import { ConfigurationPropertyName } from "../../Configurations/ConfigurationDefinition";

export class LogConfiguration extends ReportFormConfiguration {
    public get logSheetId(): string {
        return this.getProperty<string>(ConfigurationPropertyName.LOG_SHEET_ID, '');
    }
    public get logSheetName(): string {
        return this.getProperty<string>(ConfigurationPropertyName.LOG_SHEET_NAME, '');
    }

    public get errorLogSheetId(): string {
        return this.getProperty<string>(ConfigurationPropertyName.ERROR_LOG_SHEET_ID, '');
    }
    public get errorLogSheetName(): string {
        return this.getProperty<string>(ConfigurationPropertyName.ERROR_LOG_SHEET_NAME, '');
    }
}