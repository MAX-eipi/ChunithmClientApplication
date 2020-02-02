import { ConfigurationEditor } from "./Configuration";
import { storeConfig } from "./operations";
import { CommandOperator } from "./Operators/CommandOperator";
import { DataManagerOperator } from "./Operators/DataManagerOperator";
import { LineConnectorOperator } from "./Operators/LineConnectorOperator";
import { Operator } from "./Operators/Operator";
import { ReportOperator } from "./Operators/ReportOperator";
import { SpreadSheetLoggerOperator } from "./Operators/SpreadSheetLoggerOperator";
import { ApprovalPager } from "./Pager/ApprovalPager";

export class VerificationReportForm {
    public static doGet(e: any): any {
        this.init();
        var versionName = e.parameter.versionName;
        if (!versionName) {
            versionName = Operator.getDefaultVersionName();
        }
        Operator.setVersion(versionName);
        return Operator.routing(e.parameter.page, e.parameter);
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

    private static storeConfig(request): void {
        storeConfig();
        let messages = [ConfigurationEditor.getGlobalConfigurationJson(), ConfigurationEditor.getVersionConfigurationJson()];
        SpreadSheetLoggerOperator.log(messages);
        LineConnectorOperator.replyMessage(request.replyToken, messages);
    }

    public static doPost(e: any): any {
        this.init();
        let postData = JSON.parse(e.postData.getDataAsString());

        let storeConfigRequest = this.getStoreConfigRequest(postData);
        if (storeConfigRequest) {
            this.storeConfig(storeConfigRequest);
            return ContentService.createTextOutput(JSON.stringify({ "Success": true })).setMimeType(ContentService.MimeType.JSON);
        }

        var response = {};
        if (postData.events) {
            response = this.doPostLineCommand(e, postData);
        } else if (postData.API) {
            var versionName = postData.versionName;
            if (!versionName) {
                versionName = Operator.getDefaultVersionName();
            }
            Operator.setVersion(versionName);
            response = this.doPostAPICommand(e, postData);
        }
        response["Success"] = true;
        return ContentService.createTextOutput(JSON.stringify(response)).setMimeType(ContentService.MimeType.JSON);
    }

    private static doPostLineCommand(e: any, postData: any): any {
        SpreadSheetLoggerOperator.log([e.postData.getDataAsString()]);
        CommandOperator.invokeLineCommand(postData);
        return { 'content': 'post ok' };
    }

    private static doPostAPICommand(e: any, postData: any): any {
        SpreadSheetLoggerOperator.log([postData.API]);
        return CommandOperator.invokePostAPI(postData);
    }

    public static onPost(e: any, versionName: string = ""): void {
        this.init();
        if (!versionName) {
            versionName = Operator.getDefaultVersionName();
        }
        Operator.setVersion(versionName);
        let result = ReportOperator.insertReport(e.response);
        let report = result.report;
        if (result.report == null) {
            SpreadSheetLoggerOperator.logError([
                "[検証報告]",
                result.errorMessage,
            ]);
            LineConnectorOperator.pushMessage
            return;
        }

        let musicName = report.getMusicName();
        let difficulty = report.getDifficulty();
        let beforeOp = report.getBeforeOp();
        let afterOp = report.getAfterOp();
        let score = report.getScore();
        let comboStatus = report.getComboStatus();
        let baseRating = report.calcBaseRating().toFixed(1);

        if (result.errorMessage != "") {
            SpreadSheetLoggerOperator.logError([
                "[検証結果報告]",
                result.errorMessage,
                `楽曲名:${musicName}`,
                `難易度:${difficulty}`,
                `OP:${beforeOp}→${afterOp}(${Math.round((afterOp - beforeOp) * 100) / 100})`,
                `スコア:${score}`,
                `コンボ:${comboStatus}`,
                `譜面定数:${baseRating}`,
            ]);
            LineConnectorOperator.pushMessage([`報告を受け取りましたが、エラーのため却下しました。\nエラー内容は管理者にご確認ください。`]);
            return;
        }

        SpreadSheetLoggerOperator.log([
            "[検証結果報告]",
            `報告ID:${report.getReportId()}`,
            `楽曲名:${musicName}`,
            `難易度:${difficulty}`,
            `OP:${beforeOp}→${afterOp}(${Math.round((afterOp - beforeOp) * 100) / 100})`,
            `スコア:${score}`,
            `コンボ:${comboStatus}`,
            `譜面定数:${baseRating}`,
        ]);
        LineConnectorOperator.noticeReportPost([`[検証結果 報告]
楽曲名:${report.getMusicName()}
難易度:${difficulty}
譜面定数:${baseRating}
URL:${ApprovalPager.getUrl(Operator.getRootUrl(), Operator.getTargetVersionName(), report.getReportId())}`]);
    }

    private static init() {
        Operator.addOnChangeTargetVersionEventHandler(DataManagerOperator.reset);
        Operator.addOnChangeTargetVersionEventHandler(ReportOperator.reset);
    }
}
