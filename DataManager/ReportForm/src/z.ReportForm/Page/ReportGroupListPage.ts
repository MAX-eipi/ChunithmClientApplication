import { MusicDataReportGroup } from "../Report/MusicDataReportGroup";
import { Role } from "../Role";
import { ReportFormPage, ReportFormPageParameter } from "./@ReportFormPage";
import { GroupApprovalPage } from "./GroupApprovalPage";
import { TopPage } from "./TopPage";
import { Difficulty } from "../../MusicDataTable/Difficulty";
import { Utility } from "../Utility";
import { ReportModule } from "../Modules/Report/ReportModule";

interface ReportGroupListPageParameter extends ReportFormPageParameter { }

export class ReportGroupListPage extends ReportFormPage {
    public static readonly PAGE_NAME = "report_group_list";

    private get reportModule(): ReportModule { return this.module.getModule(ReportModule); }

    public get pageName(): string {
        return ReportGroupListPage.PAGE_NAME;
    }

    public isAccessable(role: Role): boolean {
        return role == Role.Operator;
    }

    public call(parameter: ReportGroupListPageParameter): GoogleAppsScript.HTML.HtmlOutput {
        const reportGroups = this.reportModule.getMusicDataReportGroupContainer(parameter.versionName).musicDataReportGroups;
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
        let maxDiffuclty = Difficulty.Invalid;
        if (reportGroup.verified) {
            title = `<span style="color:#02d507;">[DONE]</span>` + title;
        }
        else {
            let anyWip = false;
            let allWip = true;
            for (const report of reportGroup.getMusicDataReports()) {
                if (report.difficulty > maxDiffuclty) {
                    maxDiffuclty = report.difficulty;
                }
                if (report.verified) {
                    continue;
                }
                if (report.mainReport) {
                    anyWip = true;
                }
                else {
                    allWip = false;
                }
            }
            if (allWip) {
                title = `<span style="color:#f7dd24;">[FILL]</span>` + title;
            }
            else if (anyWip) {
                title = `<span style="color:#f7dd24;">[WIP]</span>` + title;
            }
        }
        const template = `<div class="music_list bg_${Utility.toDifficultyTextLowerCase(maxDiffuclty)}" onclick="transition('${encodeURI(reportGroup.groupId)}')">${title}</div>`;
        return template;
    }
}
