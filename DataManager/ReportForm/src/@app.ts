import { ReportForm } from "./Product/ReportForm/ReportForm";

const VERSION = "0.4.0.0";
export function getAppVersion(): string {
    return VERSION;
}

function doGet(e: GoogleAppsScript.Events.DoGet): any {
    return ReportForm.doGet(e);
}

function doPost(e: GoogleAppsScript.Events.DoPost): any {
    return ReportForm.doPost(e);
}

function onPost(e: any, versionName: string) {
    ReportForm.onPost(e, versionName);
}

function onPostBulkReport(e: any, versionName: string) {
    ReportForm.onPostLevelBulkReport(e, versionName);
}

function onPostBulkReportImagePaths(e: any, versionName: string) {
    ReportForm.onPostBulkReportImagePaths(e, versionName);
}
