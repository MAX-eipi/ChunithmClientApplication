import { MusicDataTable } from "../../MusicDataTable/MusicDataTable";
import { IMusicDataReport } from "../Report/IMusicDataReport";
import { MusicDataReportGroup } from "../Report/MusicDataReportGroup";
import { ReportStatus } from "../Report/ReportStatus";
import { Role } from "../Role";
import { Utility } from "../Utility";
import { ReportFormPage, ReportFormPageParameter } from "./@ReportFormPage";
import { ReportGroupListPage } from "./ReportGroupListPage";

interface GroupApprovalPageParameter extends ReportFormPageParameter {
    groupId: string;
}

export class GroupApprovalPage extends ReportFormPage {
    public static readonly PAGE_NAME = "group_approval";

    private static unkownMusicTemplate = `
<div class="result_bg bg_%difficultyLower% w420">
    不明な楽曲です。 楽曲ID: %musicId%
</div>`;

    public get pageName(): string {
        return GroupApprovalPage.PAGE_NAME;
    }

    public isAccessable(role: Role): boolean {
        return role == Role.Operator;
    }

    public call(parameter: GroupApprovalPageParameter): GoogleAppsScript.HTML.HtmlOutput {
        const table = this.module.musicData.getTable(parameter.versionName);
        const reportGroup = this.module.report
            .getMusicDataReportGroupContainer(parameter.versionName)
            .getMusicDataReportGroup(parameter.groupId);

        const listHtml = this.getListHtml(table, reportGroup);

        let source = this.readMainHtml();

        source = this.resolveVersionName(source, parameter.versionName);
        source = this.bind(ReportGroupListPage, parameter, source);
        source = this.bindSelf(source, parameter.versionName, parameter.groupId);

        source = source.replace(/%groupId%/g, parameter.groupId);
        source = source.replace(/%list%/g, listHtml);

        if (reportGroup.verified) {
            source = source.replace(/%approveFormContainer%/g, this.getResovedFormContainerHtml());
        } else {
            source = source.replace(/%approveFormContainer%/g, this.getInProgressFormContainerHtml());
        }

        return this.createHtmlOutput(source);
    }

    private bindSelf(source: string, versionName: string, groupId: string): string {
        if (!source) {
            return "";
        }
        let url = `${this.getPageUrl(versionName)}&groupId=${groupId}`;
        return source.replace(/%link:self%/g, url);
    }

    private getListHtml(table: MusicDataTable, reportGroup: MusicDataReportGroup): string {
        let source = '';
        for (const musicDataReport of reportGroup.getMusicDataReports()) {
            if (musicDataReport.verified) {
                continue;
            }
            source += this.getListItemHtml(table, musicDataReport) + '\n';
        }
        return source;
    }

    private _listItemTemplate: string;
    private get listItemTemplate(): string {
        if (!this._listItemTemplate) {
            this._listItemTemplate = this.readCurrentPageHtml('list_item');
        }
        return this._listItemTemplate;
    }

    private _unverifiedListItemTemplate: string;
    private get unverifiedListItemTemplate(): string {
        if (!this._unverifiedListItemTemplate) {
            this._unverifiedListItemTemplate = this.readCurrentPageHtml('unverified_list_item');
        }
        return this._unverifiedListItemTemplate;
    }

    private getListItemHtml(table: MusicDataTable, musicDataReport: IMusicDataReport): string {
        const musicDetail = table.getMusicDataById(musicDataReport.musicId);
        const difficultyText = Utility.toDifficultyText(musicDataReport.difficulty);

        let template = '';
        if (!musicDetail) {
            template = GroupApprovalPage.unkownMusicTemplate;
            template = template.replace(/%musicId%/g, musicDataReport.musicId.toString());
            template = template.replace(/%difficultyLower%/g, difficultyText.toLowerCase());
            return template;
        }

        if (!musicDataReport.mainReport) {
            template = this.unverifiedListItemTemplate;
            template = template.replace(/%musicName%/g, musicDetail.Name);
            template = template.replace(/%difficultyLower%/g, difficultyText.toLowerCase());
            template = template.replace(/%difficulty%/g, difficultyText);
            template = template.replace(/%difficultyImagePath%/g, Utility.getDifficultyImagePath(musicDataReport.difficulty));
            return template;
        }

        const report = musicDataReport.mainReport;
        template = this.listItemTemplate;
        template = template.replace(/%musicName%/g, musicDetail.Name);
        template = template.replace(/%difficultyLower%/g, difficultyText.toLowerCase());
        template = template.replace(/%difficulty%/g, difficultyText);
        template = template.replace(/%difficultyImagePath%/g, Utility.getDifficultyImagePath(musicDataReport.difficulty));
        {
            let progress = "-";
            const status = report ? report.reportStatus : null;
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

        const beforeOp = report.beforeOp;
        const afterOp = report.afterOp;
        const diffOp = Math.round((afterOp - beforeOp) * 100) / 100;
        template = template.replace(/%beforeOp%/g, beforeOp.toString());
        template = template.replace(/%afterOp%/g, afterOp.toString());
        template = template.replace(/%diffOp%/g, diffOp.toString());
        template = template.replace(/%score%/g, report.score.toString());
        template = template.replace(/%comboStatus%/g, Utility.toComboStatusText(report.comboStatus));
        template = template.replace(/%baseRating%/g, report.calcBaseRating().toFixed(1));

        const imagePaths = report.imagePaths;
        if (imagePaths.length > 0) {
            const img = imagePaths
                .map(p => `<div class="result_image"><img src="${p}" /></div>`)
                .reduce((acc, src) => acc + src);
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