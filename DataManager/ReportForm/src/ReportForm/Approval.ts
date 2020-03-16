import { Difficulty } from "../MusicDataTable/Difficulty";
import { MusicData } from "../MusicDataTable/MusicData";
import { Debug } from "./Debug";
import { Instance } from "./Instance";
import { ApprovalPage } from "./Page/ApprovalPage";
import { Report, ReportStatus } from "./Report/Report";
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

function approve(reportIdText: string, versionName: string): void {
    try {
        Instance.initialize();
        if (!versionName) {
            let e = new ApprovalError(`バージョン名未指定.`);
            Instance.exception(e);
            throw e;
        }

        let reportId = parseInt(reportIdText);
        let report = Instance.instance.module.report.getReportSheet(versionName).getReport(reportId);
        if (!report) {
            let e = new ApprovalError(`検証報告取得の失敗. ID:${reportId}`);
            Instance.exception(e);
            throw e;
        }

        let musicDataTable = Instance.instance.module.musicData.getTable(versionName);
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

        Instance.instance.module.musicData.updateMusicData(versionName, [targetMusicData]);
        Instance.instance.module.report.approve(versionName, reportId);

        let difficulty = Utility.toDifficultyText(report.difficulty);

        Debug.log(JSON.stringify({
            'header': '検証報告承認',
            'reportId': report.reportId,
            'musicName': report.musicName,
            'difficulty': difficulty,
            'baseRating': baseRating.toFixed(1),
        }));
        Instance.instance.module.twitter.postTweet(`[譜面定数 検証結果]
楽曲名:${report.musicName}
難易度:${difficulty}
譜面定数:${baseRating.toFixed(1)}

バージョン:${Instance.instance.module.version.getVersionConfig(versionName).displayVersionName}`);
        Instance.instance.module.report.noticeReportPost(`⭕️[検証結果 承認]⭕️
楽曲名:${report.musicName}
難易度:${difficulty}
譜面定数:${baseRating.toFixed(1)}
URL:${Instance.instance.module.router.getPage(ApprovalPage).getReportPageUrl(versionName, reportId)}`);
    }
    catch (error) {
        Instance.exception(error);
        throw error;
    }
}

function reject(reportIdText: string, versionName: string): void {
    try {
        Instance.initialize();
        if (!versionName) {
            let e = new ApprovalError(`バージョン名未指定.`);
            Instance.exception(e);
            throw e;
        }

        let reportId = parseInt(reportIdText);
        let report = Instance.instance.module.report.getReportSheet(versionName).getReport(reportId);
        if (!report) {
            let e = new ApprovalError(`検証報告取得の失敗. ID:${reportId}`);
            Instance.exception(e);
            throw e;
        }

        Instance.instance.module.report.reject(versionName, reportId);

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
        Instance.instance.module.report.noticeReportPost(`✖️[検証結果 却下]✖️
楽曲名:${musicName}
難易度:${difficulty}
URL:${Instance.instance.module.router.getPage(ApprovalPage).getReportPageUrl(versionName, reportId)}`);
    }
    catch (error) {
        Instance.exception(error);
        throw error;
    }
}

function groupApprove(reportGroupId: string, versionName: string): void {
    try {
        Instance.initialize();
        if (!versionName) {
            let e = new ApprovalError(`バージョン名未指定.`);
            Instance.exception(e);
            throw e;
        }

        let reportGroup = Instance.instance.module.report
            .getReportGroupContainer(versionName)
            .getReportGroup(reportGroupId);
        if (!reportGroup) {
            let e = new ApprovalError(`報告グループ取得の失敗. ID:${reportGroupId}`);
            Instance.exception(e);
            throw e;
        }

        let musicDataTable = Instance.instance.module.musicData.getTable(versionName);
        let targetMusicDatas: MusicData[] = [];
        let approvedReports: Report[] = [];
        for (let unit of reportGroup.units) {
            if (!unit.report || unit.report.reportStatus != ReportStatus.InProgress) {
                continue;
            }

            let report = unit.report;
            approvedReports.push(report);

            let targetMusicData = musicDataTable.getMusicDataById(report.musicId).clone();
            let difficulty = report.difficulty;
            let baseRating = report.calcBaseRating();
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

        Instance.instance.module.musicData.updateMusicData(versionName, targetMusicDatas);
        Instance.instance.module.report.approveGroup(versionName, approvedReports.map(r => r.reportId));

        let versionText = Instance.instance.module.version.getVersionConfig(versionName).displayVersionName;
        for (let report of approvedReports) {
            let difficulty = Utility.toDifficultyText(report.difficulty);
            let baseRating = report.calcBaseRating();

            Debug.log(JSON.stringify({
                'header': '検証報告承認',
                'reportId': report.reportId,
                'musicName': report.musicName,
                'difficulty': difficulty,
                'baseRating': baseRating.toFixed(1),
            }));
            Instance.instance.module.twitter.postTweet(`[譜面定数 検証結果]
楽曲名:${report.musicName}
難易度:${difficulty}
譜面定数:${baseRating.toFixed(1)}

バージョン:${versionText}`);
        }

        Instance.instance.module.report.noticeReportPost(`検証報告グループが一括承認されました
グループID: ${reportGroupId}`);
    }
    catch (error) {
        Instance.exception(error);
        throw error;
    }
}