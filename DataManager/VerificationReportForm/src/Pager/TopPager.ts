import { getAppVersion } from "../app";
import { Operator } from "../Operators/Operator";
import { InProgressListPager } from "./InProgressListPager";
import { createHtmlOutput, getPageUrl, Pager, readHtml } from "./Pager";
import { ReportGroupListPager } from "./ReportGroupListPager";
import { UnverifiedListByGenrePager } from "./UnverifiedListByGenrePager";
import { UnverifiedListByLevelPager } from "./UnverifiedListByLevelPager";

interface TopPageParameter {
}

export class TopPager implements Pager {
    public static readonly PAGE_NAME = "top";

    public static resolvePageUrl(source: string, rootUrl: string, versionName: string): string {
        return source ? source.replace(/%topPageUrl%/g, getPageUrl(rootUrl, this.PAGE_NAME, versionName)) : "";
    }

    public getPageName(): string {
        return TopPager.PAGE_NAME;
    }

    public call(parameter: TopPageParameter): GoogleAppsScript.HTML.HtmlOutput {
        let rootUrl = Operator.getRootUrl();
        let config = Operator.getTargetVersionConfiguration();
        let versionName = config.getVersionName();
        let versionText = config.getProperty<string>("version_text", "");

        var source = readHtml(this.getPageName());
        source = source.replace(/%version%/g, getAppVersion());
        source = source.replace(/%versionText%/g, versionText);
        source = InProgressListPager.resolvePageUrl(source, rootUrl, versionName);
        source = ReportGroupListPager.resolvePageUrl(source, rootUrl, versionName);
        source = UnverifiedListByGenrePager.resolvePageUrl(source, rootUrl, versionName);
        source = UnverifiedListByLevelPager.resolvePageUrl(source, rootUrl, versionName);
        return createHtmlOutput(source);
    }
} 