import { RoutingControllerWithType } from "../../Router/RoutingController";
import { RoutingNode } from "../../Router/RoutingNode";

export interface ReportFormWebsiteParameter extends Record<string, number | string> {
    version: string;
}

export class ReportFormWebsiteController<TParameter extends ReportFormWebsiteParameter> implements RoutingControllerWithType<TParameter> {
    protected readonly doGetParameter: GoogleAppsScript.Events.DoGet;

    public constructor(doGetParameter: GoogleAppsScript.Events.DoGet) {
        this.doGetParameter = doGetParameter;
    }

    call(parameter: Readonly<TParameter>, node: RoutingNode): GoogleAppsScript.HTML.HtmlOutput {
        throw new Error("Method not implemented.");
    }

    protected readHtml(filePath: string): string {
        return HtmlService
            .createTemplateFromFile(filePath)
            .evaluate()
            .getContent();
    }

    protected createHtmlOutput(source: string): GoogleAppsScript.HTML.HtmlOutput {
        const htmlOutput = HtmlService.createHtmlOutput(source).setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
        htmlOutput.setTitle('譜面定数 検証報告 管理ツール');
        return htmlOutput;
    }
}
