import { ReportFormPage, ReportFormPageParameter } from "./@ReportFormPage";
import { TopPage } from "./TopPage";

interface ErrorPageParameter extends ReportFormPageParameter {
    message: string;
}

export class ErrorPage extends ReportFormPage {
    public static readonly PAGE_NAME: string = "error";

    public get pageName(): string {
        return ErrorPage.PAGE_NAME;
    }

    public call(parameter: ErrorPageParameter): GoogleAppsScript.HTML.HtmlOutput {
        var source = this.readMainHtml();

        source = this.bind(TopPage, parameter, source);
        source = source.replace(/%message%/g, parameter.message);

        return this.createHtmlOutput(source);
    }
}