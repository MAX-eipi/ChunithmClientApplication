import { Operator } from "../Operators/Operator";
import { createHtmlOutput, Pager, readHtml } from "./Pager";
import { TopPager } from "./TopPager";
import { Role } from "../Role";

interface ErrorPageParameter {
    message: string;
}

export class ErrorPager implements Pager {
    public static readonly PAGE_NAME = "error";

    public getPageName(): string {
        return ErrorPager.PAGE_NAME;
    }

    public isAccessable(role: Role): boolean {
        return true;
    }

    public call(parameter: ErrorPageParameter): GoogleAppsScript.HTML.HtmlOutput {
        var source = readHtml(this.getPageName());

        source = TopPager.resolvePageUrl(source, Operator.getRootUrl(), Operator.getTargetVersionName());

        source = source.replace(/%message%/g, parameter.message);
        return createHtmlOutput(source);
    }
}