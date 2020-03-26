import { Report, ReportStatus } from "../Report/Report";
import { Role } from "../Role";
import { Utility } from "../Utility";
import { ReportFormPage, ReportFormPageParameter } from "./@ReportFormPage";
import { ApprovalPage } from "./ApprovalPage";
import { TopPage } from "./TopPage";

interface InProgressListPageParameter extends ReportFormPageParameter { }

export class InProgressListPage extends ReportFormPage {
    public static readonly PAGE_NAME = "wip_list";

    public get pageName(): string {
        return InProgressListPage.PAGE_NAME;
    }

    public isAccessable(role: Role): boolean {
        return role == Role.Operator;
    }

    public call(parameter: InProgressListPageParameter): GoogleAppsScript.HTML.HtmlOutput {
        let listHtml = this.module.report.getReports(parameter.versionName)
            .filter(r => r.reportStatus == ReportStatus.InProgress)
            .map(this.getListItemHtml)
            .reduce((acc, src) => `${acc}\n${src}`, '');

        var source = this.readMainHtml();

        source = this.bind(TopPage, parameter, source);
        source = this.bind(ApprovalPage, parameter, source);

        source = source.replace(/%list%/g, listHtml);
        return this.createHtmlOutput(source);
    }

    private getListItemHtml(report: Report): string {
        return `<div class="music_list bg_${Utility.toDifficultyText(report.difficulty).toLowerCase()}" onclick="transition('${report.reportId}')">${report.musicName}</div>`;
    }
}