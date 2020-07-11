import { Difficulty } from "../../MusicDataTable/Difficulty";
import { MusicData } from "../../MusicDataTable/MusicData";
import { Debug } from "../Debug";
import { WebhookEventName } from "../Dependencies/WebhookEventDefinition";
import { ApprovalPage } from "../Page/ApprovalPage";
import { LevelBulkApprovalPage } from "../Page/LevelBulkApprovalPage";
import { IReport } from "../Report/IReport";
import { ReportStatus } from "../Report/ReportStatus";
import { Utility } from "../Utility";
import { ReportFormModule } from "./@ReportFormModule";

class ApprovalError implements Error {
    public name: string = "ApprovalError";
    public message: string;
    public constructor(message: string) {
        this.message = message;
    }

    toString(): string {
        return `${this.name}:${this.message};`
    }
}

export class ApprovalModule extends ReportFormModule {
    public approve(versionName: string, reportId: number) {
        const report = this.report.getReport(versionName, reportId);
        if (!report) {
            throw new ApprovalError(`検証報告取得の失敗. ID:${reportId}`);
        }

        let musicDataTable = this.musicData.getTable(versionName);
        let targetMusicData = musicDataTable.getMusicDataById(report.musicId);
        if (!targetMusicData) {
            throw new ApprovalError(`楽曲情報取得の失敗. 楽曲名:${report.musicName}`);
        }
        targetMusicData = targetMusicData.clone();

        let baseRating = report.calcBaseRating();
        switch (report.difficulty) {
            case Difficulty.Master:
                targetMusicData.setLevel(Difficulty.Master, baseRating);
                targetMusicData.setVerified(Difficulty.Master, true);
                break;
            case Difficulty.Expert:
                targetMusicData.setLevel(Difficulty.Expert, baseRating);
                targetMusicData.setVerified(Difficulty.Expert, true);
                break;
            case Difficulty.Advanced:
                targetMusicData.setLevel(Difficulty.Advanced, baseRating);
                targetMusicData.setVerified(Difficulty.Advanced, true);
                break;
            case Difficulty.Basic:
                targetMusicData.setLevel(Difficulty.Basic, baseRating);
                targetMusicData.setVerified(Difficulty.Basic, true);
                break;
        }

        this.musicData.updateMusicData(versionName, [targetMusicData]);
        this.report.approve(versionName, reportId);

        let difficulty = Utility.toDifficultyText(report.difficulty);

        Debug.log(JSON.stringify({
            'header': '検証報告承認',
            'reportId': report.reportId,
            'musicName': report.musicName,
            'difficulty': difficulty,
            'baseRating': baseRating.toFixed(1),
        }));
        this.twitter.postTweet(`[譜面定数 検証結果]
楽曲名:${report.musicName}
難易度:${difficulty}
譜面定数:${baseRating.toFixed(1)}

バージョン:${this.version.getVersionConfig(versionName).displayVersionName}`);
        this.report.noticeReportPost(`⭕️[検証結果 承認]⭕️
楽曲名:${report.musicName}
難易度:${difficulty}
譜面定数:${baseRating.toFixed(1)}
URL:${this.router.getPage(ApprovalPage).getReportPageUrl(versionName, reportId)}`);

        this.webhook.invoke(WebhookEventName.ON_APPROVE);
    }

    public reject(versionName: string, reportId: number): void {
        const report = this.report.getReport(versionName, reportId);
        if (!report) {
            throw new ApprovalError(`検証報告取得の失敗. ID:${reportId}`);
        }
        this.report.reject(versionName, reportId);

        let musicName = report.musicName;
        let difficulty = Utility.toDifficultyText(report.difficulty);
        let baseRating = report.calcBaseRating();

        Debug.log(JSON.stringify({
            'header': '検証報告却下',
            'reportId': report.reportId,
            'musicName': report.musicName,
            'difficulty': difficulty,
            'baseRating': baseRating.toFixed(1),
        }));
        this.report.noticeReportPost(`✖️[検証結果 却下]✖️
楽曲名:${musicName}
難易度:${difficulty}
URL:${this.router.getPage(ApprovalPage).getReportPageUrl(versionName, reportId)}`);
    }

    public approveGroup(versionName: string, reportGroupId: string): void {
        const reportGroup = this.report
            .getMusicDataReportGroupContainer(versionName)
            .getMusicDataReportGroup(reportGroupId);
        if (!reportGroup) {
            throw new ApprovalError(`報告グループ取得の失敗. ID:${reportGroupId}`);
        }

        const musicDataTable = this.musicData.getTable(versionName);
        const targetMusicDatas: MusicData[] = [];
        const approvedReports: IReport[] = [];
        for (const rep of reportGroup.getMusicDataReports()) {
            if (!rep || !rep.mainReport || rep.mainReport.reportStatus !== ReportStatus.InProgress) {
                continue;
            }

            const report = rep.mainReport;
            approvedReports.push(report);

            const targetMusicData = musicDataTable.getMusicDataById(report.musicId).clone();
            const difficulty = report.difficulty;
            const baseRating = report.calcBaseRating();
            switch (difficulty) {
                case Difficulty.Master:
                    targetMusicData.setLevel(Difficulty.Master, baseRating);
                    targetMusicData.setVerified(Difficulty.Master, true);
                    break;
                case Difficulty.Expert:
                    targetMusicData.setLevel(Difficulty.Expert, baseRating);
                    targetMusicData.setVerified(Difficulty.Expert, true);
                    break;
                case Difficulty.Advanced:
                    targetMusicData.setLevel(Difficulty.Advanced, baseRating);
                    targetMusicData.setVerified(Difficulty.Advanced, true);
                    break;
                case Difficulty.Basic:
                    targetMusicData.setLevel(Difficulty.Basic, baseRating);
                    targetMusicData.setVerified(Difficulty.Basic, true);
                    break;
            }
            targetMusicDatas.push(targetMusicData);
        }

        this.musicData.updateMusicData(versionName, targetMusicDatas);
        this.report.approveGroup(versionName, approvedReports.map(r => r.reportId));

        const versionText = this.version.getVersionConfig(versionName).displayVersionName;
        for (const report of approvedReports) {
            const difficulty = Utility.toDifficultyText(report.difficulty);
            const baseRating = report.calcBaseRating();

            Debug.log(JSON.stringify({
                'header': '検証報告承認',
                'reportId': report.reportId,
                'musicName': report.musicName,
                'difficulty': difficulty,
                'baseRating': baseRating.toFixed(1),
            }));
            this.twitter.postTweet(`[譜面定数 検証結果]
楽曲名:${report.musicName}
難易度:${difficulty}
譜面定数:${baseRating.toFixed(1)}

バージョン:${versionText}`);
        }

        this.report.noticeReportPost(`検証報告グループが一括承認されました
グループID: ${reportGroupId}`);

        this.webhook.invoke(WebhookEventName.ON_APPROVE);
    }

    // Lv.1-6用
    public bulkApprove(versionName: string, bulkReportId: number): void {
        let bulkReport = this.report.getLevelBulkReportSheet(versionName).getBulkReport(bulkReportId);
        if (!bulkReport) {
            throw new ApprovalError(`一括検証報告取得の失敗. ID:${bulkReportId}`);
        }

        let targetLevelList = [bulkReport.targetLevel];

        let musicDataTable = this.musicData.getTable(versionName);
        let targetMusicDatas: MusicData[] = [];
        for (let data of musicDataTable.datas) {
            var update: MusicData = null;
            if (targetLevelList.indexOf(data.BasicLevel) != -1 && !data.BasicVerified) {
                update = update || data.clone();
                update.BasicVerified = true;
            }
            if (targetLevelList.indexOf(data.AdvancedLevel) != -1 && !data.AdvancedVerified) {
                update = update || data.clone();
                update.AdvancedVerified = true;
            }

            if (update) {
                targetMusicDatas.push(update);
            }
        }

        this.musicData.updateMusicData(versionName, targetMusicDatas);
        this.report.approveLevelBulk(versionName, bulkReportId);

        Debug.log(JSON.stringify({
            header: '一括承認',
            targetLevel: bulkReport.targetLevel,
        }));

        this.report.noticeReportPost(`⭕️[一括検証結果 承認]⭕️
Lv:${bulkReport.targetLevel}
URL:${this.router.getPage(LevelBulkApprovalPage).getReportPageUrl(versionName, bulkReportId)}`);

        this.webhook.invoke(WebhookEventName.ON_APPROVE);
    }

    public bulkReject(versionName: string, bulkReportId: number): void {
        let bulkReport = this.report.getLevelBulkReportSheet(versionName).getBulkReport(bulkReportId);
        if (!bulkReport) {
            throw new ApprovalError(`一括検証報告取得の失敗. ID:${bulkReportId}`);
        }

        this.report.rejectLevelBulk(versionName, bulkReportId);

        Debug.log(JSON.stringify({
            header: '一括承認',
            targetLevel: bulkReport.targetLevel,
        }));

        this.report.noticeReportPost(`✖️[一括検証結果 却下]✖️
Lv:${bulkReport.targetLevel}
URL:${this.router.getPage(LevelBulkApprovalPage).getReportPageUrl(versionName, bulkReportId)}`);
    }
}