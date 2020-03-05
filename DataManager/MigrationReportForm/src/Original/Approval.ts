import * as DataManager from "../DataManager";
import { DataManagerOperator } from "./Operators/DataManagerOperator";
import { LineConnectorOperator } from "./Operators/LineConnectorOperator";
import { Operator } from "./Operators/Operator";
import { ReportOperator } from "./Operators/ReportOperator";
import { SpreadSheetLoggerOperator } from "./Operators/SpreadSheetLoggerOperator";
import { TwitterConnectorOperator } from "./Operators/TwitterConnectorOperator";
import { ApprovalPager } from "./Pager/ApprovalPager";
import { Report, ReportStatus } from "./Report";
import { Utility } from "./Utility";

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

function approve(reportId: string, versionName: string): void {
    try {
        Operator.setVersion(versionName);
        let report = ReportOperator.getReport(reportId);
        if (!report) {
            throw new ApprovalError(`検証報告取得の失敗. ID:${reportId}`);
        }

        let musicDataTable = DataManagerOperator.getTable();
        let targetMusicData = musicDataTable.getMusicDataById(report.getMusicId());
        if (!targetMusicData) {
            throw new ApprovalError(`楽曲情報取得の失敗. 楽曲名:${report.getMusicName()}`);
        }
        targetMusicData = targetMusicData.clone();

        let difficulty = report.getDifficulty();
        let baseRating = report.calcBaseRating();
        switch (difficulty) {
            case "MASTER":
            case "master":
                targetMusicData.setLevel(DataManager.Difficulty.Master, baseRating);
                targetMusicData.setVerified(DataManager.Difficulty.Master, true);
                break;
            case "EXPERT":
            case "expert":
                targetMusicData.setLevel(DataManager.Difficulty.Expert, baseRating);
                targetMusicData.setVerified(DataManager.Difficulty.Expert, true);
                break;
            case "ADVANCED":
            case "advanced":
                targetMusicData.setLevel(DataManager.Difficulty.Advanced, baseRating);
                targetMusicData.setVerified(DataManager.Difficulty.Advanced, true);
                break;
            case "BASIC":
            case "basic":
                targetMusicData.setLevel(DataManager.Difficulty.Basic, baseRating);
                targetMusicData.setVerified(DataManager.Difficulty.Basic, true);
                break;
        }
        DataManagerOperator.updateMusicData([targetMusicData]);
        ReportOperator.approve(reportId);

        SpreadSheetLoggerOperator.log([
            "[検証報告承認]",
            `報告ID:${report.getReportId()}`,
            `楽曲名:${report.getMusicName()}`,
            `難易度:${difficulty}`,
            `譜面定数:${baseRating.toFixed(1)}`
        ]);

        TwitterConnectorOperator.postTweet(`[譜面定数 検証結果]
楽曲名:${report.getMusicName()}
難易度:${difficulty}
譜面定数:${baseRating.toFixed(1)}

バージョン:${Operator.getTargetVersionConfiguration().getProperty("version_text", "")}`);
        LineConnectorOperator.noticeReportPost([`⭕️[検証結果 承認]⭕️
楽曲名:${report.getMusicName()}
難易度:${difficulty}
譜面定数:${baseRating.toFixed(1)}
URL:${ApprovalPager.getUrl(Operator.getRootUrl(), Operator.getTargetVersionName(), report.getReportId())}`]);
    }
    catch (error) {
        Operator.exception(error);
        throw error;
    }
}

function reject(reportId: string, versionName: string): void {
    try {
        Operator.setVersion(versionName);
        let report = ReportOperator.getReport(reportId);
        if (!report) {
            throw new ApprovalError(`検証報告取得の失敗. ID:${reportId}`);
        }
        ReportOperator.reject(reportId);

        let musicName = report.getMusicName();
        let difficulty = report.getDifficulty();
        let baseRating = report.calcBaseRating();
        SpreadSheetLoggerOperator.log([
            "[検証報告却下]",
            `報告ID:${report.getReportId()}`,
            `楽曲名:${musicName}`,
            `難易度:${difficulty}`,
            `譜面定数:${baseRating.toFixed(1)}`
        ]);
        LineConnectorOperator.noticeReportPost([`✖️[検証結果 却下]✖️
楽曲名:${musicName}
難易度:${difficulty}
URL:${ApprovalPager.getUrl(Operator.getRootUrl(), Operator.getTargetVersionName(), report.getReportId())}`]);
    }
    catch (error) {
        Operator.exception(error);
        throw error;
    }
}

function groupApprove(reportGroupId: string, versionName: string): void {
    try {
        Operator.setVersion(versionName);
        let reportGroup = ReportOperator.getReportGroup(reportGroupId);
        if (!reportGroup) {
            throw new ApprovalError(`検証報告取得の失敗. ID:${reportGroupId}`);
        }

        let reports = ReportOperator.getReports();

        let inprogressReportMap: { [key: string]: Report } = {};
        for (var i = 0; i < reports.length; i++) {
            let report = reports[i];
            if (report.getReportStatus() != ReportStatus.InProgress) {
                continue;
            }
            let key = `${report.getMusicId()}:${report.getDifficulty()}`;
            inprogressReportMap[key] = report;
        }

        let musicDataTable = DataManagerOperator.getTable();
        let targetMusicDatas: DataManager.MusicData[] = [];
        let musics = reportGroup.getMusics();
        for (var i = 0; i < musics.length; i++) {
            let music = musics[i];
            let key = `${music.musicId}:${Utility.toDifficultyText(music.difficulty)}`;
            if (!inprogressReportMap[key]) {
                continue;
            }
            let report = inprogressReportMap[key];
            let targetMusicData = musicDataTable.getMusicDataById(report.getMusicId()).clone();
            let difficulty = report.getDifficulty();
            let baseRating = report.calcBaseRating();
            switch (difficulty) {
                case "MASTER":
                case "master":
                    targetMusicData.setLevel(DataManager.Difficulty.Master, baseRating);
                    targetMusicData.setVerified(DataManager.Difficulty.Master, true);
                    break;
                case "EXPERT":
                case "expert":
                    targetMusicData.setLevel(DataManager.Difficulty.Expert, baseRating);
                    targetMusicData.setVerified(DataManager.Difficulty.Expert, true);
                    break;
                case "ADVANCED":
                case "advanced":
                    targetMusicData.setLevel(DataManager.Difficulty.Advanced, baseRating);
                    targetMusicData.setVerified(DataManager.Difficulty.Advanced, true);
                    break;
                case "BASIC":
                case "basic":
                    targetMusicData.setLevel(DataManager.Difficulty.Basic, baseRating);
                    targetMusicData.setVerified(DataManager.Difficulty.Basic, true);
                    break;
            }
            targetMusicDatas.push(targetMusicData);
        }

        DataManagerOperator.updateMusicData(targetMusicDatas);

        let versionText = Operator.getTargetVersionConfiguration().getProperty("version_text", "");
        for (var i = 0; i < musics.length; i++) {
            let music = musics[i];
            let key = `${music.musicId}:${Utility.toDifficultyText(music.difficulty)}`;
            if (!inprogressReportMap[key]) {
                continue;
            }

            let report = inprogressReportMap[key];
            let difficulty = report.getDifficulty();
            let baseRating = report.calcBaseRating();
            ReportOperator.approve(report.getReportId());

            SpreadSheetLoggerOperator.log([
                "[検証報告承認]",
                `報告ID:${report.getReportId()}`,
                `楽曲名:${report.getMusicName()}`,
                `難易度:${difficulty}`,
                `譜面定数:${baseRating.toFixed(1)}`
            ]);
            TwitterConnectorOperator.postTweet(`[譜面定数 検証結果]
楽曲名:${report.getMusicName()}
難易度:${difficulty}
譜面定数:${baseRating.toFixed(1)}

バージョン:${versionText}`);
        }

        LineConnectorOperator.noticeReportPost([`検証報告グループが一括承認されました
グループID: ${reportGroupId}`]);
    }
    catch (error) {
        Operator.exception(error);
        throw error;
    }
}