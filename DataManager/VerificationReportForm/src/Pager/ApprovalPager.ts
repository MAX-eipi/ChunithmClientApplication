import { Operator } from "../Operators/Operator";
import { ReportOperator } from "../Operators/ReportOperator";
import { ReportStatus } from "../Report";
import { Utility } from "../Utility";
import { InProgressListPager } from "./InProgressListPager";
import { createHtmlOutput, getPageUrl, Pager, readHtml, resolveVersionName } from "./Pager";

interface ApprovalPageParameter {
    reportId: string;
}

export class ApprovalPager implements Pager {
    public static readonly PAGE_NAME = "approval";

    public static resolvePageUrl(source: string, rootUrl: string, versionName: string): string {
        return source ? source.replace(/%approvalPageUrl%/g, getPageUrl(rootUrl, this.PAGE_NAME, versionName)) : "";
    }

    public static resolvePageUrlWithParameter(source: string, rootUrl: string, versionName: string, reportId: string): string {
        if (!source) {
            return "";
        }
        return source.replace(/%approvalPageUrlWithParameter%/g, this.getUrl(rootUrl, versionName, reportId));
    }
    
    public static getUrl(rootUrl: string, versionName: string, reportId: string): string {
        let baseUrl = getPageUrl(rootUrl, this.PAGE_NAME, versionName);
        return `${baseUrl}&reportId=${reportId}`;
    }

    public getPageName(): string {
        return ApprovalPager.PAGE_NAME;
    }

    public call(parameter: ApprovalPageParameter): GoogleAppsScript.HTML.HtmlOutput {
        let reportId = parameter.reportId;
        let report = ReportOperator.getReport(reportId);
        if (!report) {
            return Operator.routingError("該当する検証報告が存在しません");
        }

        let beforeOp = report.getBeforeOp();
        let afterOp = report.getAfterOp();
        let diffOp = Math.round((afterOp - beforeOp) * 100) / 100;
        let score = report.getScore();
        let comboStatus = report.getComboStatus();
        let baseRating = report.calcBaseRating();

        let jacketImagePath = "https://drive.google.com/uc?id=1r9QWYcPCCAZTo5kbGj3adHVJOF3Kh2gm";

        var source = readHtml(this.getPageName());

        source = resolveVersionName(source, Operator.getTargetVersionName());
        source = ApprovalPager.resolvePageUrlWithParameter(source, Operator.getRootUrl(), Operator.getTargetVersionName(), reportId);
        source = InProgressListPager.resolvePageUrl(source, Operator.getRootUrl(), Operator.getTargetVersionName());

        source = source.replace(/%reportId%/g, reportId);
        source = source.replace(/%jacketImagePath%/g, jacketImagePath);
        source = source.replace(/%musicName%/g, report.getMusicName());
        source = source.replace(/%difficulty%/g, report.getDifficulty().toLowerCase());
        source = source.replace(/%difficultyImagePath%/g, Utility.getDifficultyImagePath(report.getDifficulty()));
        source = source.replace(/%beforeOp%/g, beforeOp.toString());
        source = source.replace(/%afterOp%/g, afterOp.toString());
        source = source.replace(/%diffOp%/g, diffOp.toString());
        source = source.replace(/%score%/g, score.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,'));
        source = source.replace(/%comboStatus%/g, comboStatus);
        source = source.replace(/%baseRating%/g, baseRating.toFixed(1));

        let imagePaths = report.getImagePaths();
        if (imagePaths.length > 0) {
            let img = imagePaths
                .map(function (p) { return `<div class="result_image"><img src="${p}" /></div>`; })
                .reduce(function (acc, src) { return acc + src; });
            source = source.replace(/%verificationImageContainer%/, `<div class="result_box w400">${img}</div>`);
        }
        else {
            source = source.replace(/%verificationImageContainer%/, "");
        }

        switch (report.getReportStatus()) {
            case ReportStatus.InProgress:
                source = source.replace(/%approveFormContainer%/g, this.getInProgressFormContainerHtml());
                break;
            case ReportStatus.Resolved:
                source = source.replace(/%approveFormContainer%/g, this.getResovedFormContainerHtml(report.getMusicName(), report.getDifficulty(), baseRating));
                break;
            case ReportStatus.Rejected:
                source = source.replace(/%approveFormContainer%/g, this.getRejectedFormContinerHtml());
                break;
        }

        return createHtmlOutput(source);
    }

    private getInProgressFormContainerHtml(): string {
        return `<form style="text-align:center;">
    <input type="button" value="承認" style="width: 120px; height: 30px;" onclick="confirmApproval()">
    <input type="button" value="却下" style="width: 120px; height: 30px;" onclick="confirmReject()">
</form>`;
    }

    private getResovedFormContainerHtml(musicName: string, difficulty: string, baseRating: number): string {
        return `<div style="text-align:center;">この検証報告は既に承認済みです</div>
<div style="text-align:center; margin: 10px 0 0 0;">
            <a href="https://twitter.com/intent/tweet?text=" class="twitter-share-button" data-url=" "  data-size="large" data-text=
"[#譜面定数 検証結果]
楽曲名: ${musicName}
難易度: ${difficulty}
譜面定数: ${baseRating.toFixed(1)}

配信Bot->@uni_mc_bot"></a>
</div>`;
    }

    private getRejectedFormContinerHtml(): string {
        return `<div class="text_b" style="color:red; text-align:center;">この検証報告は却下されました</div>`;
    }
}
