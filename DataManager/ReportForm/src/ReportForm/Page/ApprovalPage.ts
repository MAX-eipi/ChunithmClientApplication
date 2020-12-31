import { Difficulty } from "../../MusicDataTable/Difficulty";
import { ReportStatus } from "../Report/ReportStatus";
import { Role } from "../Role";
import { Utility } from "../Utility";
import { ReportFormPage, ReportFormPageParameter } from "./@ReportFormPage";
import { InProgressListPage } from "./InProgressListPage";
import { ReportModule } from "../Modules/Report/ReportModule";
import { Router } from "../Modules/Router";

interface ApprovalPageParameter extends ReportFormPageParameter {
    reportId: string;
}

export class ApprovalPage extends ReportFormPage {
    public static readonly PAGE_NAME = "approval";

    private get reportModule(): ReportModule { return this.module.getModule(ReportModule); }
    private get router(): Router { return this.module.getModule(Router); }

    public get pageName(): string {
        return ApprovalPage.PAGE_NAME;
    }

    public isAccessable(role: Role): boolean {
        return role == Role.Operator;
    }

    public getReportPageUrl(versionName: string, reportId: number) {
        let url = `${this.getPageUrl(versionName)}&reportId=${reportId}`;
        return url;
    }

    private bindSelf(source: string, parameter: ApprovalPageParameter): string {
        let reportId = parseInt(parameter.reportId);
        let url = this.getReportPageUrl(parameter.versionName, reportId);
        return source ? source.replace(/%link:self%/g, url) : "";
    }

    public call(parameter: ApprovalPageParameter): GoogleAppsScript.HTML.HtmlOutput {
        let reportId = parseInt(parameter.reportId);
        const report = this.reportModule.getReport(parameter.versionName, reportId);
        if (!report) {
            return this.router.callErrorPage("該当する検証報告が存在しません");
        }

        let beforeOp = report.beforeOp;
        let afterOp = report.afterOp;
        let diffOp = Math.round((afterOp - beforeOp) * 100) / 100;
        let score = report.score;
        let comboStatus = report.comboStatus;
        let baseRating = report.calcBaseRating();

        var source = this.readMainHtml();

        source = this.resolveVersionName(source, parameter.versionName);
        source = this.bindSelf(source, parameter);
        source = this.bind(InProgressListPage, parameter, source);

        source = source.replace(/%reportId%/g, reportId.toString());
        source = source.replace(/%musicName%/g, report.musicName);
        source = source.replace(/%difficulty%/g, Utility.toDifficultyTextLowerCase(report.difficulty));
        source = source.replace(/%difficultyImagePath%/g, Utility.getDifficultyImagePath(report.difficulty));
        source = source.replace(/%beforeOp%/g, beforeOp.toString());
        source = source.replace(/%afterOp%/g, afterOp.toString());
        source = source.replace(/%diffOp%/g, diffOp.toString());
        source = source.replace(/%score%/g, score.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,'));
        source = source.replace(/%comboStatus%/g, Utility.toComboStatusText(comboStatus));
        source = source.replace(/%baseRating%/g, baseRating.toFixed(1));

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
                source = source.replace(/%approveFormContainer%/g, this.getResovedFormContainerHtml(report.musicName, report.difficulty, baseRating));
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

    private getResovedFormContainerHtml(musicName: string, difficulty: Difficulty, baseRating: number): string {
        let container = this.readCurrentPageHtml("resoved_form_container");
        let message = `[#譜面定数 検証結果]
楽曲名: ${musicName}
難易度: ${Utility.toDifficultyText(difficulty)}
譜面定数: ${baseRating.toFixed(1)}
配信Bot->@uni_mc_bot`;
        return container.replace(/%message%/g, message);
    }

    private getRejectedFormContainerHtml(): string {
        let container = this.readCurrentPageHtml("rejected_form_container");
        return container;
    }
}
