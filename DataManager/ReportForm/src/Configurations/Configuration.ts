import { Role } from "../ReportForm/Role";

export interface Configuration {
    hasProperty(key: string): boolean;
    getProperty<T>(key: string, defaultValue: T): T;
}

export type VersionConfigurationTable = Record<string, VersionConfigurationFormat>;

export interface ReportFormConfigurationFormat extends Record<string, any> {
    readonly global: GlobalConfigurationFormat;
    readonly versions: VersionConfigurationTable;
}

export interface GlobalConfigurationFormat {
    readonly logSpreadSheetId: string;
    readonly logWorkSheetName: string;
    readonly errorLogSpreadSheetId: string;
    readonly errorLogWorkSheetName: string;
    readonly lineChannelAccessToken: string;
    readonly lineNoticeTargetIdList: string[];
    readonly lineErrorNoticeTargetIdList: string[];
    readonly twitterApiToken: string;
    readonly twitterSecretKey: string;
    readonly rootUrl: string;
    readonly defaultVersionName: string;
    readonly role: Role;
    readonly reportFormId: string;
    readonly bulkReportFormId: string;
    readonly jenkinsApiToken: string;
    readonly chunirecApiHost: string;
    readonly chunirecApiToken: string;
}

export interface VersionConfigurationFormat {
    readonly displayVersionName: string;
    readonly genres: string[];
    readonly musicDataTableSpreadsheetId: string;
    readonly musicDataTableWorksheetName: string;
    readonly reportSpreadsheetId: string;
    readonly reportWorksheetName: string;
    readonly reportGroupWorksheetName: string;
    readonly bulkReportWorksheetName: string;
    readonly bulkReportSpreadsheetId: string;
    readonly nextVersionBulkReportSpreadsheetId: string;
}
