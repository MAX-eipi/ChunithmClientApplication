import { ReportFormPage, ReportFormPageParameter } from "./@ReportFormPage";
import { TopPage } from "./TopPage";
import { LevelBulkApprovalPage } from "./LevelBulkApprovalPage";
import { Role } from "../Role";
import { ReportStatus } from "../Report/ReportStatus";
import { Utility } from "../Utility";
import { Difficulty } from "../../MusicDataTable/Difficulty";
import { LevelBulkReport } from "../Report/LevelBulkReport/LevelBulkReport";
import { ReportModule } from "../Modules/Report/ReportModule";

export interface BulkReportListPageParameter extends ReportFormPageParameter {
}

export class LevelBulkReportListPage extends ReportFormPage {
    public static readonly PAGE_NAME = 'wip_bulk_report_list';

    private get reportModule(): ReportModule { return this.module.getModule(ReportModule); }

    public get pageName(): string {
        return LevelBulkReportListPage.PAGE_NAME;
    }

    public isAccessable(role: Role): boolean {
        return role === Role.Operator;
    }

    public call(parameter: BulkReportListPageParameter): GoogleAppsScript.HTML.HtmlOutput {
        let listHtml = this.reportModule.getLevelBulkReports(parameter.versionName)
            .filter(r => r.reportStatus == ReportStatus.InProgress)
            .map(report => this.getListItemHtml(this, report))
            .reduce((acc, src) => `${acc}\n${src}`, '');

        var source = this.readMainHtml();

        source = this.bind(TopPage, parameter, source);
        source = this.bind(LevelBulkApprovalPage, parameter, source);

        source = source.replace(/%list%/g, listHtml)
        return this.createHtmlOutput(source);
    }

    private getListItemHtml(self: LevelBulkReportListPage, report: LevelBulkReport): string {
        let bg = report.targetLevel <= 3
            ? Utility.toDifficultyTextLowerCase(Difficulty.Basic)
            : Utility.toDifficultyTextLowerCase(Difficulty.Advanced);
        let date = report.reportDate;
        let dateText = self.getDateText(date);
        return `<div class="music_list bg_${bg}" onclick="transition('${report.reportId}')">Lv.${report.targetLevel}/${report.musicCount}曲/${dateText}</div>`;
    }

    private getDateText(date: Date): string {
        return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日(${this.getDayOfWeekText(date.getDay())})`;
    }

    private getDayOfWeekText(day: number): string {
        switch (day) {
            case 0:
                return '日';
            case 1:
                return '月';
            case 2:
                return '火';
            case 3:
                return '水';
            case 4:
                return '木';
            case 5:
                return '金';
            case 6:
                return '土';
        }
    }
}
