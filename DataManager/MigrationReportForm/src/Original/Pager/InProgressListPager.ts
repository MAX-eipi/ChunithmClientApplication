import { Operator } from "../Operators/Operator";
import { ReportOperator } from "../Operators/ReportOperator";
import { Report, ReportStatus } from "../Report";
import { ApprovalPager } from "./ApprovalPager";
import { createHtmlOutput, getPageUrl, Pager, readHtml } from "./Pager";
import { TopPager } from "./TopPager";
import { Role } from "../Role";

interface InProgressListPageParameter {
}

export class InProgressListPager implements Pager {
    public static readonly PAGE_NAME = "in_progress_list";

    public static resolvePageUrl(source: string, rootUrl: string, versionName: string): string {
        return source ? source.replace(/%inProgressListPageUrl%/g, this.getUrl(rootUrl, versionName)) : "";
    }

    public static getUrl(rootUrl: string, versionName: string): string {
        return getPageUrl(rootUrl, this.PAGE_NAME, versionName);
    }

    public getPageName(): string {
        return InProgressListPager.PAGE_NAME;
    }

    public isAccessable(role: Role): boolean {
        return true;
    }

    public call(parameter: InProgressListPageParameter): GoogleAppsScript.HTML.HtmlOutput {
        let reports = ReportOperator.getReports().filter(function (r) { return r.getReportStatus() == ReportStatus.InProgress; });
        let listHtml = reports.map(this.getListItemHtml).reduce(function (acc, src) { return `${acc}\n${src}`; }, "");

        var source = readHtml(this.getPageName());

        source = TopPager.resolvePageUrl(source, Operator.getRootUrl(), Operator.getTargetVersionName());
        source = ApprovalPager.resolvePageUrl(source, Operator.getRootUrl(), Operator.getTargetVersionName());

        source = source.replace(/%list%/g, listHtml);
        return createHtmlOutput(source);
    }

    private getListItemHtml(report: Report): string {
        return `<div class="music_list bg_${report.getDifficulty().toLowerCase()}" onclick="transition('${report.getReportId()}')">${report.getMusicName()}</div>`;
    }
}