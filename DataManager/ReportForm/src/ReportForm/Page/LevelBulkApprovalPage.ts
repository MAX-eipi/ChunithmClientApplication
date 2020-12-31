import { ReportFormPage, ReportFormPageParameter } from "./@ReportFormPage";
import { Role } from "../Role";
import { ReportStatus } from "../Report/ReportStatus";
import { Utility } from "../Utility";
import { Difficulty } from "../../MusicDataTable/Difficulty";
import { LevelBulkReportListPage } from "./LevelBulkReportListPage";
import { Router } from "../Modules/Router";
import { ReportModule } from "../Modules/Report/ReportModule";

export interface LevelBulkApprovePageParameter extends ReportFormPageParameter {
    reportId: string;
}

export class LevelBulkApprovalPage extends ReportFormPage {
    public static PAGE_NAME: string = 'bulk_approval';

    private get reportModule(): ReportModule { return this.module.getModule(ReportModule); }
    private get router(): Router { return this.module.getModule(Router); }

    public get pageName(): string {
        return LevelBulkApprovalPage.PAGE_NAME;
    }

    public isAccessable(role: Role): boolean {
        return role == Role.Operator;
    }

    public getReportPageUrl(versionName: string, reportId: number) {
        let url = `${this.getPageUrl(versionName)}&reportId=${reportId}`;
        return url;
    }

    private bindSelf(source: string, parameter: LevelBulkApprovePageParameter): string {
        let url = this.getPageUrl(parameter.versionName);
        return source ? source.replace(/%link:self%/g, url) : "";
    }

    public call(parameter: LevelBulkApprovePageParameter): GoogleAppsScript.HTML.HtmlOutput {
        let reportId = parseInt(parameter.reportId);
        let report = this.reportModule.getLevelBulkReportSheet(parameter.versionName).getBulkReport(reportId);
        if (!report) {
            return this.router.callErrorPage("該当する検証報告が存在しません");
        }

        var source = this.readMainHtml();

        source = this.resolveVersionName(source, parameter.versionName);
        source = this.bindSelf(source, parameter);
        source = this.bind(LevelBulkReportListPage, parameter, source);

        let difficulty = report.targetLevel <= 3 ? Difficulty.Basic : Difficulty.Advanced;

        source = source.replace(/%reportId%/g, reportId.toString());
        source = source.replace(/%targetMusicLevel%/g, report.targetLevel.toString());
        source = source.replace(/%difficulty%/g, Utility.toDifficultyTextLowerCase(difficulty));
        source = source.replace(/%difficultyImagePath%/g, Utility.getDifficultyImagePath(difficulty));
        source = source.replace(/%musicCount%/g, report.musicCount.toString());
        source = source.replace(/%op%/g, report.op.toFixed(2));
        source = source.replace(/%opRatio%/g, report.opRatio.toFixed(2));
        source = source.replace(/%reportDate%/g, this.getDateText(report.reportDate));

        let imagePaths = report.imagePaths;
        if (imagePaths.length > 0) {
            let img = imagePaths
                .map(p => `<div class="result_image"><img src="${p}" /></div>`)
                .reduce((acc, src) => acc + src);
            source = source.replace(/%verificationImageContainer%/, `<div class="result_box w400">${img}</div>`);
        }
        else {
            source = source.replace(/%verificationImageContainer%/, "");
        }

        switch (report.reportStatus) {
            case ReportStatus.InProgress:
                source = source.replace(/%approveFormContainer%/g, this.getInProgressFormContainerHtml());
                break;
            case ReportStatus.Resolved:
                source = source.replace(/%approveFormContainer%/g, this.getResovedFormContainerHtml());
                break;
            case ReportStatus.Rejected:
                source = source.replace(/%approveFormContainer%/g, this.getRejectedFormContainerHtml());
                break;
        }

        return this.createHtmlOutput(source);
    }

    private getInProgressFormContainerHtml(): string {
        let container = this.readCurrentPageHtml("wip_form_container");
        return container;
    }

    private getResovedFormContainerHtml(): string {
        let container = this.readCurrentPageHtml("resoved_form_container");
        return container;
    }

    private getRejectedFormContainerHtml(): string {
        let container = this.readCurrentPageHtml("rejected_form_container");
        return container;
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
