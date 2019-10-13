import { Operator } from "../Operators/Operator";
import { ReportOperator } from "../Operators/ReportOperator";
import { ReportGroup } from "../ReportGroup";
import { GroupApprovalPager } from "./GroupApprovalPager";
import { createHtmlOutput, getPageUrl, Pager, readHtml, resolveVersionName } from "./Pager";
import { TopPager } from "./TopPager";

interface ReportGroupListPageParameter {
}

export class ReportGroupListPager implements Pager {
    public static readonly PAGE_NAME = "report_group_list";

    public static resolvePageUrl(source: string, rootUrl: string, versionName: string): string {
        return source ? source.replace(/%reportGroupListPageUrl%/g, getPageUrl(rootUrl, this.PAGE_NAME, versionName)) : "";
    }

    public getPageName(): string {
        return ReportGroupListPager.PAGE_NAME;
    }

    public call(parameter: ReportGroupListPageParameter): GoogleAppsScript.HTML.HtmlOutput {
        let reportGroups = ReportOperator.getReportGroups();
        let listHtml = this.getListHtml(reportGroups);

        var source = readHtml(this.getPageName());

        source = resolveVersionName(source, Operator.getTargetVersionName());
        source = TopPager.resolvePageUrl(source, Operator.getRootUrl(), Operator.getTargetVersionName());
        source = GroupApprovalPager.resolvePageUrl(source, Operator.getRootUrl(), Operator.getTargetVersionName());

        source = source.replace(/%list%/g, listHtml);
        return createHtmlOutput(source);
    }

    private getListHtml(reportGroupList: ReportGroup[]): string {
        let source = '';
        for (var i = 0; i < reportGroupList.length; i++) {
            source += this.getListItemHtml(reportGroupList[i]) + '\n';
        }
        return source;
    }

    private getListItemHtml(reportGroup: ReportGroup): string {
        let title = `ID: ${reportGroup.getGroupId()}`;
        if (reportGroup.getVerified()) {
            title = `<span style="color:#02d507;">【済】</span>` + title;
        }
        let template = `<div class="music_list bg_master" onclick="transition('${reportGroup.getGroupId()}')">${title}</div>`;
        return template;
    }
}