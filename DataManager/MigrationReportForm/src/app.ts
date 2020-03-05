import { VerificationReportForm } from "./Original/VerificationReportForm";
import { Operator } from "./Original/Operators/Operator";

const VERSION: string = "0.2.6.0";
export function getAppVersion(): string {
    return VERSION;
}

function doGet(e: any): any {
    try {
        return VerificationReportForm.doGet(e);
    }
    catch (error) {
        Operator.exception(error);
        return Operator.routingException(error);
    }
}

function doPost(e: any): any {
    try {
        return VerificationReportForm.doPost(e);
    }
    catch (error) {
        Operator.exception(error);
        return ContentService.createTextOutput(JSON.stringify({ Success: false })).setMimeType(ContentService.MimeType.JSON);
    }
}

function onPost(e: any, versionName: string = "") {
    try {
        VerificationReportForm.onPost(e, versionName);
    }
    catch (error) {
        Operator.exception(error);
    }
}