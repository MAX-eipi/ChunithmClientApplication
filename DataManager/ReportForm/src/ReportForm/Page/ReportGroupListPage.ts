import { MusicDataReportGroup } from "../Report/MusicDataReportGroup";
import { Role } from "../Role";
import { ReportFormPage, ReportFormPageParameter } from "./@ReportFormPage";
import { GroupApprovalPage } from "./GroupApprovalPage";
import { TopPage } from "./TopPage";

interface ReportGroupListPageParameter extends ReportFormPageParameter { }

export class ReportGroupListPage extends ReportFormPage {
    public static readonly PAGE_NAME = "report_group_list";

    public get pageName(): string {
        return ReportGroupListPage.PAGE_NAME;
    }

    public isAccessable(role: Role): boolean {
        return role == Role.Operator;
    }

    public call(parameter: ReportGroupListPageParameter): GoogleAppsScript.HTML.HtmlOutput {
        const reportGroups = this.module.report.getMusicDataReportGroupContainer(parameter.versionName).musicDataReportGroups;
        const listHtml = this.getListHtml(reportGroups);

        let source = this.readMainHtml();

        source = this.resolveVersionName(source, parameter.versionName);
        source = this.bind(TopPage, parameter, source);
        source = this.bind(GroupApprovalPage, parameter, source);

        source = source.replace(/%list%/g, listHtml);

        return this.createHtmlOutput(source);
    }

    private getListHtml(reportGroups: MusicDataReportGroup[]): string {
        let source = '';
        for (const reportGroup of reportGroups) {
            source += this.getListItemHtml(reportGroup) + '\n';
        }
        return source;
    }

    private getListItemHtml(reportGroup: MusicDataReportGroup): string {
        let title = `ID: ${reportGroup.groupId}`;
        if (reportGroup.verified) {
            title = `<span style="color:#02d507;">【済】</span>` + title;
        }
        const template = `<div class="music_list bg_master" onclick="transition('${encodeURI(reportGroup.groupId)}')">${title}</div>`;
        return template;
    }
}