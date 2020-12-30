import { Difficulty } from "../../MusicDataTable/Difficulty";
import { MusicData } from "../../MusicDataTable/MusicData";
import { Debug } from "../Debug";
import { WebhookEventName } from "../Dependencies/WebhookEventDefinition";
import { Environment } from "../Environment";
import { IReport } from "../Report/IReport";
import { ReportStatus } from "../Report/ReportStatus";
import { Utility } from "../Utility";
import { ReportFormModule } from "./@ReportFormModule";
import { ChunirecModule } from "./ChunirecModule";
import { TwitterModule } from "./TwitterModule";
import { NoticeModule } from "./Notice/NoticeModule";

export class ApprovalError implements Error {
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

        this.requestChunirecUpdateMusics([report]);
        this.webhook.invoke(WebhookEventName.ON_APPROVE);

        const difficulty = Utility.toDifficultyText(report.difficulty);
        Debug.log(JSON.stringify({
            'header': '検証報告承認',
            'reportId': report.reportId,
            'musicName': report.musicName,
            'difficulty': difficulty,
            'baseRating': baseRating.toFixed(1),
        }));

        const noticeQueue = this.getModule(NoticeModule).getQueue();
        noticeQueue.enqueueApproveUnitReport(report);
        noticeQueue.save();
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

        const noticeQueue = this.getModule(NoticeModule).getQueue();
        noticeQueue.enqueueRejectUnitReport(report);
        noticeQueue.save();
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
            if (!rep.mainReport || rep.mainReport.reportStatus !== ReportStatus.InProgress) {
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

            this.getModule(NoticeModule).getQueue().enqueueApproveUnitReport(report);
        }

        this.requestChunirecUpdateMusics(approvedReports);
        this.getModule(NoticeModule).getQueue().save();
        this.webhook.invoke(WebhookEventName.ON_APPROVE);

        this.report.noticeReportPost(`検証報告グループが一括承認されました
グループID: ${reportGroupId}`);
    }

    private requestChunirecUpdateMusics(reports: IReport[]): boolean {
        if (this.config.common.environment !== Environment.Release) {
            return true;
        }
        const params: { musicId: number; difficulty: Difficulty; baseRating: number; }[] = [];
        for (const report of reports) {
            params.push({
                musicId: report.musicId,
                difficulty: report.difficulty,
                baseRating: report.calcBaseRating(),
            });
        }
        return this.getModule(ChunirecModule).requestUpdateMusics(params);
    }

    // Lv.1-6用
    public bulkApprove(versionName: string, bulkReportId: number): void {
        const bulkReport = this.report.getLevelBulkReportSheet(versionName).getBulkReport(bulkReportId);
        if (!bulkReport) {
            throw new ApprovalError(`一括検証報告取得の失敗. ID:${bulkReportId}`);
        }

        const targetLevelList = [bulkReport.targetLevel];

        const musicDataTable = this.musicData.getTable(versionName);
        const targetMusicDatas: MusicData[] = [];
        for (const data of musicDataTable.datas) {
            let update: MusicData = null;
            if (targetLevelList.indexOf(data.BasicLevel) !== -1 && !data.BasicVerified) {
                update = update || data.clone();
                update.BasicVerified = true;
            }
            if (targetLevelList.indexOf(data.AdvancedLevel) !== -1 && !data.AdvancedVerified) {
                update = update || data.clone();
                update.AdvancedVerified = true;
            }

            if (update) {
                targetMusicDatas.push(update);
            }
        }

        this.musicData.updateMusicData(versionName, targetMusicDatas);
        this.report.approveLevelBulkReport(versionName, bulkReportId);

        Debug.log(JSON.stringify({
            header: '一括承認',
            targetLevel: bulkReport.targetLevel,
        }));

        this.getModule(NoticeModule).getQueue().enqueueApproveLevelReport(bulkReport);
        this.getModule(NoticeModule).getQueue().save();

        this.webhook.invoke(WebhookEventName.ON_APPROVE);
    }

    public bulkReject(versionName: string, bulkReportId: number): void {
        const bulkReport = this.report.getLevelBulkReportSheet(versionName).getBulkReport(bulkReportId);
        if (!bulkReport) {
            throw new ApprovalError(`一括検証報告取得の失敗. ID:${bulkReportId}`);
        }

        this.report.rejectLevelBulkReport(versionName, bulkReportId);

        Debug.log(JSON.stringify({
            header: '一括却下',
            targetLevel: bulkReport.targetLevel,
        }));

        this.getModule(NoticeModule).getQueue().enqueueRejectLevelReport(bulkReport);
        this.getModule(NoticeModule).getQueue().save();
    }
}
