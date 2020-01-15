import { DataManagerOperator } from "../Operators/DataManagerOperator";
import { Operator } from "../Operators/Operator";
import { ReportOperator } from "../Operators/ReportOperator";
import { Report, ReportStatus } from "../Report";
import { ReportGroup, ReportGroupMusic } from "../ReportGroup";
import { Utility } from "../Utility";
import { createHtmlOutput, getPageUrl, Pager, readHtml, resolveVersionName } from "./Pager";
import { ReportGroupListPager } from "./ReportGroupListPager";

interface GroupApprovalPageParameter {
    groupId: string;
}

export class GroupApprovalPager implements Pager {
    public static readonly PAGE_NAME = "group_approval";

    private static listItemTemplate = `
<div class="result_bg bg_%difficultyLower% w420">
    <div class="result_difficulty">
        <img src="%difficultyImagePath%" />
    </div>
    <div class="result_box w400" style="margin:0px auto 5px auto">
        <!-- <div class="underline" style="text-align:center;">%progress%</div> -->
        <div class="music_info w380">
            <div class="music_name_box">
                <span class="music_name">%musicName%</span>
            </div>
        </div>
        <div class="underline">SCORE：<span class="text_b">%score%</span></div>
        <div class="underline">COMBO：<span class="text_b">%comboStatus%</span></div>
        <div class="underline">OP：<span class="text_b">%diffOp%</span> (%beforeOp% ⇒ %afterOp%)</div>
        <div>譜面定数：<span class="text_b">%baseRating%</span></div>
    </div>
    %verificationImageContainer%
</div>`;

    private static unverifiedListItemTemplate = `
<div class="result_bg bg_%difficultyLower% w420">
    <div class="result_difficulty">
        <img src="%difficultyImagePath%" />
    </div>
    <div class="result_box w400" style="margin:0px auto 5px auto">
        <!-- <div class="underline" style="text-align:center;">%progress%</div> -->
        <div class="music_info w380">
            <div class="music_name_box">
                <span class="music_name">%musicName%</span>
            </div>
        </div>
        <div class="text_b text_center">未検証</div>
    </div>
</div>`;

    private static unkownMusicTemplate = `
<div class="result_bg bg_%difficultyLower% w420">
    不明な楽曲です。 楽曲ID: %musicId%
</div>`;

    public static resolvePageUrl(source: string, rootUrl: string, versionName: string): string {
        return source ? source.replace(/%groupApprovalPageUrl%/g, getPageUrl(rootUrl, this.PAGE_NAME, versionName)) : "";
    }

    public static resolvePageUrlWithParameter(source: string, rootUrl: string, versionName: string, groupId: string): string {
        if (!source) {
            return "";
        }
        let baseUrl = getPageUrl(rootUrl, this.PAGE_NAME, versionName);
        return source.replace(/%groupApprovalPageUrlWithParameter%/g, `${baseUrl}&groupId=${groupId}`);
    }

    public getPageName(): string {
        return GroupApprovalPager.PAGE_NAME;
    }

    public call(parameter: GroupApprovalPageParameter): GoogleAppsScript.HTML.HtmlOutput {
        let groupId = parameter.groupId;
        let reportGroup = ReportOperator.getReportGroup(groupId);
        let listHtml = this.getListHtml(reportGroup);

        var source = readHtml(this.getPageName());

        source = resolveVersionName(source, Operator.getTargetVersionName());
        source = ReportGroupListPager.resolvePageUrl(source, Operator.getRootUrl(), Operator.getTargetVersionName());
        source = GroupApprovalPager.resolvePageUrlWithParameter(source, Operator.getRootUrl(), Operator.getTargetVersionName(), groupId);

        source = source.replace(/%groupId%/g, groupId);
        source = source.replace(/%list%/g, listHtml);

        if (reportGroup.getVerified()) {
            source = source.replace(/%approveFormContainer%/g, this.getResovedFormContainerHtml());
        } else {
            source = source.replace(/%approveFormContainer%/g, this.getInProgressFormContainerHtml());
        }

        return createHtmlOutput(source);
    }

    private getListHtml(reportGroup: ReportGroup): string {
        let source = '';
        let boundReports = reportGroup.getBoundReports();
        for (var i = 0; i < boundReports.length; i++) {
            let boundReport = boundReports[i];
            let music = boundReport.music;
            let report = boundReport.report;
            if (report != null && report.getReportStatus() == ReportStatus.Resolved) {
                continue;
            }
            source += this.getListItemHtml(music, report) + '\n';
        }
        return source;
    }

    private getListItemHtml(music: ReportGroupMusic, report: Report): string {
        let musicDetail = DataManagerOperator.getTable().getMusicDataById(music.musicId);
        let difficultyText = Utility.toDifficultyText(music.difficulty);

        let template = '';
        if (!musicDetail) {
            template = GroupApprovalPager.unkownMusicTemplate;
            template = template.replace(/%musicId%/g, music.musicId.toString());
            template = template.replace(/%difficultyLower%/g, difficultyText.toLowerCase());
            return template;
        }

        if (!report || report.getReportStatus() == ReportStatus.Rejected) {
            template = GroupApprovalPager.unverifiedListItemTemplate;
            template = template.replace(/%musicName%/g, musicDetail.Name);
            template = template.replace(/%difficultyLower%/g, difficultyText.toLowerCase());
            template = template.replace(/%difficulty%/g, difficultyText);
            template = template.replace(/%difficultyImagePath%/g, Utility.getDifficultyImagePath(difficultyText));
            return template;
        }

        template = GroupApprovalPager.listItemTemplate;
        template = template.replace(/%musicName%/g, musicDetail.Name);
        template = template.replace(/%difficultyLower%/g, difficultyText.toLowerCase());
        template = template.replace(/%difficulty%/g, difficultyText);
        template = template.replace(/%difficultyImagePath%/g, Utility.getDifficultyImagePath(difficultyText));
        {
            let progress = "-";
            let status = report ? report.getReportStatus() : null;
            switch (status) {
                case ReportStatus.InProgress:
                    progress = `<span class="text_b" style="font-family:arial,sans-serif;">承認待ち</span>`;
                    break;
                case ReportStatus.Resolved:
                    progress = `<span class="text_b" sytle="font-family:arial,sans-serif;">承認済み</span>`;
                    break;
            }
            template = template.replace(/%progress%/g, progress);
        }

        let beforeOp = report.getBeforeOp();
        let afterOp = report.getAfterOp();
        let diffOp = Math.round((afterOp - beforeOp) * 100) / 100;
        template = template.replace(/%beforeOp%/g, beforeOp.toString());
        template = template.replace(/%afterOp%/g, afterOp.toString());
        template = template.replace(/%diffOp%/g, diffOp.toString());
        template = template.replace(/%score%/g, report.getScore().toString());
        template = template.replace(/%comboStatus%/g, report.getComboStatus());
        template = template.replace(/%baseRating%/g, report.calcBaseRating().toFixed(1));

        let imagePaths = report.getImagePaths();
        if (imagePaths.length > 0) {
            let img = imagePaths
                .map(function (p) { return `<div class="result_image"><img src="${p}" /></div>`; })
                .reduce(function (acc, src) { return acc + src; });
            template = template.replace(/%verificationImageContainer%/, `<div class="result_box w400">${img}</div>`);
        }
        else {
            template = template.replace(/%verificationImageContainer%/, "");
        }

        return template;
    }

    private getInProgressFormContainerHtml(): string {
        return `
<form style="text-align:center;">
    <input type="button" value="承認" style="width: 120px; height: 30px;" onclick="confirmGroupApproval()">
</form>`;
    }

    private getResovedFormContainerHtml(): string {
        return `<div style="text-align:center;">この検証報告リストは既に承認済みです</div>`;
    }
}
