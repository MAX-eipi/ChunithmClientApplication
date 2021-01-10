import { storeConfig } from "../@operations";
import { LogLevel } from "../CustomLogger/CustomLogger";
import { CustomLogManager } from "../CustomLogger/CustomLogManager";
import { DIProperty } from "../DIProperty/DIProperty";
import { Router } from "../Router/Router";
import { Instance } from "./Instance";
import { LINEModule } from "./Modules/LINEModule";
import { NoticeModule } from "./Modules/Notice/NoticeModule";
import { PostCommandModule } from "./Modules/PostCommandModule";
import { ReportModule } from "./Modules/Report/ReportModule";
import { GoogleFormReport } from "./Report/GoogleFormReport";
import { GoogleFormLevelBulkReport } from "./Report/LevelBulkReport/GoogleFormLevelBulkReport";
import { ReportStatus } from "./Report/ReportStatus";
import { PostLocation } from "./Report/ReportStorage";
import { Utility } from "./Utility";
import { ErrorWebsiteController } from "./WebsiteControllers/ErrorWebsiteController";

export class ReportForm {
    public static doGet(e: any): any {
        try {
            Instance.initialize();
            if (!e.parameter.versionName) {
                e.parameter.versionName = Instance.instance.module.configuration.defaultVersionName;
            }
            Instance.instance.setupWebsiteControllers(e);
            return DIProperty.resolve(Router).call(e.pathInfo);
        }
        catch (error) {
            CustomLogManager.exception(error);
            return new ErrorWebsiteController(e).call({ version: Instance.instance.module.configuration.defaultVersionName, message: error.message }, null);
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

    public static doPost(e: any): any {
        try {
            let postData = JSON.parse(e.postData.getDataAsString());

            let storeConfigRequest = this.getStoreConfigRequest(postData);
            if (storeConfigRequest) {
                storeConfig();
                return this.getSuccessResponseContent();
            }

            Instance.initialize();

            if (!postData.versionName) {
                postData.versionName = Instance.instance.module.configuration.defaultVersionName;
            }

            let lineCommand = Instance.instance.module.getModule(LINEModule).findCommand(postData);
            if (lineCommand) {
                lineCommand.invoke();
                return this.getSuccessResponseContent();
            }

            let postCommand = Instance.instance.module.getModule(PostCommandModule).findCommand(postData);
            if (postCommand) {
                let response = postCommand.invoke();
                return this.getSuccessResponseContent(response);
            }

            return this.getSuccessResponseContent();
        }
        catch (error) {
            CustomLogManager.exception(error);
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
                versionName = Instance.instance.module.configuration.defaultVersionName;
            }

            let report = Instance.instance.module.getModule(ReportModule).insertReport(versionName, new GoogleFormReport(e.response));
            if (report) {
                const data = {
                    header: `検証報告`,
                    reportId: report.reportId,
                    musicName: report.musicName,
                    difficulty: Utility.toDifficultyText(report.difficulty),
                    baseRating: report.calcBaseRating().toFixed(1),
                };
                CustomLogManager.log(LogLevel.Info, data);

                Instance.instance.module.getModule(NoticeModule).getQueue().enqueueCreateUnitReport(report);
            }
        }
        catch (error) {
            CustomLogManager.exception(error);
        }
    }

    public static onPostLevelBulkReport(e: { response: GoogleAppsScript.Forms.FormResponse }, versionName: string = ""): void {
        try {
            Instance.initialize();
            if (!versionName) {
                versionName = Instance.instance.module.configuration.defaultVersionName;
            }
            let bulkReport = Instance.instance.module.getModule(ReportModule).insertLevelBulkReport(versionName, new GoogleFormLevelBulkReport(e.response));
            if (bulkReport) {
                const data = {
                    header: `一括検証報告`,
                    reportId: bulkReport.reportId,
                    targetLevel: bulkReport.targetLevel,
                    musicCount: bulkReport.musicCount,
                    op: bulkReport.op,
                    opRatio: bulkReport.opRatio,
                };
                CustomLogManager.log(LogLevel.Info, data);
                Instance.instance.module.getModule(NoticeModule).getQueue().enqueueCreateLevelReport(bulkReport);
            }
        }
        catch (error) {
            CustomLogManager.exception(error);
        }
    }

    public static onPostBulkReportImagePaths(e: { response: GoogleAppsScript.Forms.FormResponse }, versionName = ""): void {
        try {
            Instance.initialize();
            if (!versionName) {
                versionName = Instance.instance.module.configuration.defaultVersionName;
            }
            const items = e.response.getItemResponses();
            const musicId = parseInt(items[0].getResponse() as string);
            //const musicName = items[1].getResponse() as string;
            const difficulty = Utility.toDifficulty(items[2].getResponse() as string);
            const imagePaths = items[3].getResponse().toString()
                .split(',')
                .map(p => `https://drive.google.com/uc?id=${p}`);

            const targetReport = Instance.instance.module.getModule(ReportModule)
                .getReportStorage(versionName)
                .getMusicDataReport(musicId, difficulty)
                .find(r => r.postLocation === PostLocation.BulkSheet && r.reportStatus === ReportStatus.InProgress);
            if (targetReport) {
                targetReport.setImagePaths(imagePaths);
                Instance.instance.module.getModule(ReportModule).getReportStorage(versionName).write();
            }
            else {
                const tableContainer = Instance.instance.module.getModule(ReportModule).getBulkReportTableContainer(versionName);
                const row = tableContainer.getTableByDifficulty(difficulty).getRowByMusicId(musicId);
                if (row && row.isValid()) {
                    Instance.instance.module.getModule(ReportModule)
                        .getReportStorage(versionName)
                        .push(row, PostLocation.BulkSheet, imagePaths);
                    Instance.instance.module.getModule(ReportModule).getReportStorage(versionName).write();
                }
                else {
                    // 入力前に画像が投稿された
                    const message = `データが未入力のまま検証画像が投稿されました
楽曲ID: ${musicId}
難易度: ${items[2].getResponse()}
画像URL:
${imagePaths.reduce((acc, src) => acc + '\n' + src)}`
                    CustomLogManager.log(LogLevel.Error, message);
                }
            }
        }
        catch (error) {
            CustomLogManager.exception(error);
        }
    }
}
