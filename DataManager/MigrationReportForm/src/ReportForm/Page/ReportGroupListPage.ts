import { ReportGroup } from "../Report/ReportGroup";
import { Role } from "../Role";
import { ReportFormPage, ReportFormPageParameter } from "./@ReportFormPage";
import { GroupApprovalPage } from "./GroupApprovalPage";
import { TopPage } from "./TopPage";

interface ReportGroupListPageParameter extends ReportFormPageParameter { }

export class ReportGroupListPage extends ReportFormPage {
    public static readonly PAGE_NAME = "report_group_list";

    public getPageName(): string {
        return ReportGroupListPage.PAGE_NAME;
    }

    public isAccessable(role: Role): boolean {
        return role == Role.Operator;
    }

    public call(parameter: ReportGroupListPageParameter): GoogleAppsScript.HTML.HtmlOutput {
        let reportGroups = this.module.report.getReportGroupContainer(parameter.versionName).reportGroups;
        let listHtml = this.getListHtml(reportGroups);

        var source = this.readMainHtml();

        source = this.resolveVersionName(source, parameter.versionName);
        source = this.bind(TopPage, parameter, source);
        source = this.bind(GroupApprovalPage, parameter, source);

        source = source.replace(/%list%/g, listHtml);

        return this.createHtmlOutput(source);
    }

    private getListHtml(reportGroupList: ReportGroup[]): string {
        let source = '';
        for (var i = 0; i < reportGroupList.length; i++) {
            source += this.getListItemHtml(reportGroupList[i]) + '\n';
        }
        return source;
    }

    private getListItemHtml(reportGroup: ReportGroup): string {
        let title = `ID: ${reportGroup.groupId}`;
        if (reportGroup.verified) {
            title = `<span style="color:#02d507;">【済】</span>` + title;
        }
        let template = `<div class="music_list bg_master" onclick="transition('${encodeURI(reportGroup.groupId)}')">${title}</div>`;
        return template;
    }
}