import { ConfigurationScriptProperty } from "../Configurations/ConfigurationDefinition";
import { Debug } from "./Debug";
import { Instance } from "./Instance";
import { storeConfig } from "./operations";
import { ApprovalPage } from "./Page/ApprovalPage";
import { LevelBulkApprovalPage } from "./Page/LevelBulkApprovalPage";
import { GoogleFormReport } from "./Report/GoogleFormReport";
import { Utility } from "./Utility";
import { GoogleFormLevelBulkReport } from "./Report/LevelBulkReport/GoogleFormLevelBulkReport";
import { PostLocation } from "./Report/ReportStorage";
import { ReportStatus } from "./Report/ReportStatus";
import { version } from "punycode";

export class ReportForm {
    public static doGet(e: any): any {
        try {
            Instance.initialize();
            if (!e.parameter.versionName) {
                e.parameter.versionName = Instance.instance.module.config.common.defaultVersionName;
            }
            return Instance.instance.module.router.call(e.parameter.page, e.parameter);
        }
        catch (error) {
            let message = this.toExceptionMessage(error);
            Debug.logError(message);
            return Instance.instance.module.router.callErrorPage(message, e.parameter.versionName);
        }
    }

    private static getStoreConfigRequest(postData: any): any {
        if (!postData.events) {
            return null;
        }
        for (var i = 0; i < postData.events.length; i++) {
            let event = postData.events[i];
            if (event.type == "message" && event.message.type == "text" && event.message.text == ":store-config") {
                return event;
            }
        }
        return null;
    }

    private static storeConfig(request: { replyToken: string }): void {
        let ret = storeConfig();
        Instance.initialize();

        let properties = ret.getProperties();
        Debug.log(JSON.stringify(properties));

        let versionConfigText = null;
        for (const versionName of Instance.instance.module.config.common.versionNames) {
            if (versionConfigText) {
                versionConfigText += '\n';
            }
            versionConfigText += properties[ConfigurationScriptProperty.getVersionConfigName(versionName)];
        }

        Instance.instance.module.line.notice.replyTextMessage(
            request.replyToken,
            [
                properties[ConfigurationScriptProperty.GLOBAL_CONFIG],
                properties[ConfigurationScriptProperty.VERSION_NAME_LIST],
                versionConfigText,
            ]);
    }


    public static doPost(e: any): any {
        try {
            let postData = JSON.parse(e.postData.getDataAsString());

            let storeConfigRequest = this.getStoreConfigRequest(postData);
            if (storeConfigRequest) {
                this.storeConfig(storeConfigRequest);
                return this.getSuccessResponseContent();
            }

            Instance.initialize();

            if (!postData.versionName) {
                postData.versionName = Instance.instance.module.config.common.defaultVersionName;
            }

            let lineCommand = Instance.instance.module.line.findCommand(postData);
            if (lineCommand) {
                lineCommand.invoke();
                return this.getSuccessResponseContent();
            }

            let postCommand = Instance.instance.module.postCommand.findCommand(postData);
            if (postCommand) {
                let response = postCommand.invoke();
                return this.getSuccessResponseContent(response);
            }

            return this.getSuccessResponseContent();
        }
        catch (error) {
            let message = this.toExceptionMessage(error);
            Debug.logError(message);
            return this.getSuccessResponseContent();
        }
    }

    private static getSuccessResponseContent(response: any = null): GoogleAppsScript.Content.TextOutput {
        if (!response) {
            response = {};
        }
        response.Success = true;
        return this.getResponseContent(response);
    }

    private static getResponseContent(response: any): GoogleAppsScript.Content.TextOutput {
        return ContentService.createTextOutput(JSON.stringify(response)).setMimeType(ContentService.MimeType.JSON);
    }

    public static onPost(e: { response: GoogleAppsScript.Forms.FormResponse }, versionName: string = ""): void {
        try {
            Instance.initialize();
            if (!versionName) {
                versionName = Instance.instance.module.config.common.defaultVersionName;
            }

            let report = Instance.instance.module.report.insertReport(versionName, new GoogleFormReport(e.response));
            if (report) {
                Debug.log(`${JSON.stringify({
                    header: `検証報告`,
                    reportId: report.reportId,
                    musicName: report.musicName,
                    difficulty: Utility.toDifficultyText(report.difficulty),
                    baseRating: report.calcBaseRating().toFixed(1),
                })}`);
                Instance.instance.module.report.noticeReportPost(`[検証報告]
楽曲名:${report.musicName}
難易度:${Utility.toDifficultyText(report.difficulty)}
譜面定数:${report.calcBaseRating().toFixed(1)}
URL:${Instance.instance.module.router.getPage(ApprovalPage).getReportPageUrl(versionName, report.reportId)}`);
            }
        }
        catch (error) {
            let message = this.toExceptionMessage(error);
            Debug.logError(message);
        }
    }

    public static onPostLevelBulkReport(e: { response: GoogleAppsScript.Forms.FormResponse }, versionName: string = ""): void {
        try {
            Instance.initialize();
            if (!versionName) {
                versionName = Instance.instance.module.config.common.defaultVersionName;
            }
            let bulkReport = Instance.instance.module.report.insertLevelBulkReport(versionName, new GoogleFormLevelBulkReport(e.response));
            if (bulkReport) {
                Debug.log(JSON.stringify({
                    header: `一括検証報告`,
                    reportId: bulkReport.reportId,
                    targetLevel: bulkReport.targetLevel,
                    musicCount: bulkReport.musicCount,
                    op: bulkReport.op,
                    opRatio: bulkReport.opRatio,
                }));
                Instance.instance.module.report.noticeReportPost(`[一括検証報告]
対象レベル:${bulkReport.targetLevel}
URL:${Instance.instance.module.router.getPage(LevelBulkApprovalPage).getReportPageUrl(versionName, bulkReport.reportId)}`);
            }
        }
        catch (error) {
            let message = this.toExceptionMessage(error);
            Debug.logError(message);
        }
    }

    public static onPostBulkReportImagePaths(e: { response: GoogleAppsScript.Forms.FormResponse }, versionName = ""): void {
        try {
            Instance.initialize();
            if (!versionName) {
                versionName = Instance.instance.module.config.common.defaultVersionName;
            }
            const items = e.response.getItemResponses();
            const musicId = parseInt(items[0].getResponse() as string);
            //const musicName = items[1].getResponse() as string;
            const difficulty = Utility.toDifficulty(items[2].getResponse() as string);
            const imagePaths = items[3].getResponse().toString()
                .split(',')
                .map(p => `https://drive.google.com/uc?id=${p}`);

            const targetReport = Instance.instance.module.report
                .getReportStorage(versionName)
                .getMusicDataReport(musicId, difficulty)
                .find(r => r.postLocation === PostLocation.BulkSheet && r.reportStatus === ReportStatus.InProgress);
            if (targetReport) {
                targetReport.setImagePaths(imagePaths);
                Instance.instance.module.report.getReportStorage(versionName).write();
            }
            else {
                const tableContainer = Instance.instance.module.report.getBulkReportTableContainer(versionName);
                const row = tableContainer.getTableByDifficulty(difficulty).getRowByMusicId(musicId);
                if (row && row.isValid()) {
                    Instance.instance.module.report
                        .getReportStorage(versionName)
                        .push(row, PostLocation.BulkSheet, imagePaths);
                    Instance.instance.module.report.getReportStorage(versionName).write();
                }
                else {
                    // 入力前に画像が投稿された
                    Debug.logError(`データが未入力のまま検証画像が投稿されました
楽曲ID: ${musicId}
難易度: ${items[2].getResponse()}
画像URL:
${imagePaths.reduce((acc, src) => acc + '\n' + src)}`);
                }
            }
        }
        catch (error) {
            const message = this.toExceptionMessage(error);
            Debug.logError(message);
        }
    }

    private static toExceptionMessage(error: Error): string {
        return `[Message]
${error.message}

[Stack Trace]
${error.stack}`;
    }
}
