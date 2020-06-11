import { ReportForm } from "./ReportForm/ReportForm";

const VERSION: string = "0.3.2-hotfix-0.1";
export function getAppVersion(): string {
    return VERSION;
}

function doGet(e: any): any {
    return ReportForm.doGet(e);
}

function doPost(e: any): any {
    return ReportForm.doPost(e);
}

function onPost(e: any, versionName: string) {
    ReportForm.onPost(e, versionName);
}

function onPostBulkReport(e: any, versionName: string) {
    ReportForm.onPostBulkReport(e, versionName);
}