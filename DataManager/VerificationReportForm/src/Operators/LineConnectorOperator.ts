import { Operator } from "./Operator";
import { LineConnector } from "../LineConnector";

export class LineConnectorOperator {
    private static readonly CHANNEL_ACCESS_TOKEN = "line_channel_access_token";
    private static readonly NOTICE_TARGET_ID_LIST = "line_notice_target_id_list";
    private static readonly ERROR_NOTICE_TARGET_ID_LIST = "line_error_notice_target_id_list";
    private static readonly REPORT_POST_NOTICE_ENABLED = "line_report_post_notice_enabled";

    private static noticeInstance: LineConnector = null;
    private static initializedNotice: boolean = false;

    private static errorNoticeInstance: LineConnector = null;
    private static initializedErrorNotice: boolean = false;

    private static reportPostNoticeEnabled: boolean = null;

    private static getNoticeInstance(): LineConnector {
        if (this.noticeInstance || this.initializedNotice) {
            return this.noticeInstance;
        }

        let config = Operator.getConfiguration();
        let channelAccessToken = config.getGlobalConfigurationProperty<string>(this.CHANNEL_ACCESS_TOKEN, "");
        let noticeTargetIds = config.getGlobalConfigurationProperty<string>(this.NOTICE_TARGET_ID_LIST, "").split(',');
        if (!channelAccessToken || noticeTargetIds.length == 0) {
            Logger.log(`[LineConnectOperator]Notice instantiation failed. ${JSON.stringify({
                channelAccessToken: channelAccessToken,
                noticeTargetIds: noticeTargetIds
            })}`);
            this.initializedNotice = true;
            return null;
        }

        this.noticeInstance = new LineConnector(channelAccessToken, noticeTargetIds);
        this.initializedNotice = true;
        return this.noticeInstance;
    }

    private static getErrorNoticeInstance(): LineConnector {
        if (this.errorNoticeInstance || this.initializedErrorNotice) {
            return this.errorNoticeInstance;
        }

        let config = Operator.getConfiguration();
        let channelAccessToken = config.getGlobalConfigurationProperty<string>(this.CHANNEL_ACCESS_TOKEN, "");
        let errorNoticeTargetIds = config.getGlobalConfigurationProperty<string>(this.ERROR_NOTICE_TARGET_ID_LIST, "").split(',');
        if (!channelAccessToken || errorNoticeTargetIds.length == 0) {
            Logger.log(`[LineConnectOperator]Error-Notice instantiation failed. ${JSON.stringify({
                channelAccessToken: channelAccessToken,
                noticeTargetIds: errorNoticeTargetIds
            })}`);
            this.initializedErrorNotice = true;
            return null;
        }

        this.errorNoticeInstance = new LineConnector(channelAccessToken, errorNoticeTargetIds);
        this.initializedErrorNotice = true;
        return this.errorNoticeInstance;
    }

    public static pushMessage(messages: string[]): void {
        let instance = this.getNoticeInstance();
        if (!instance) {
            return;
        }
        instance.pushTextMessage(messages);
    }

    public static pushErrorMessage(messages: string[]): void {
        let instance = this.getErrorNoticeInstance();
        if (!instance) {
            return;
        }
        instance.pushTextMessage(messages);
    }

    public static replyMessage(replyToken: string, messages: string[]): void {
        let instance = this.getNoticeInstance();
        if (!instance) {
            return;
        }
        instance.replyTextMessage(replyToken, messages);
    }

    public static setReportPostNoticeEnabled(enabled: boolean): void {
        PropertiesService.getScriptProperties().setProperty(this.REPORT_POST_NOTICE_ENABLED, enabled ? "1" : "0");
        this.reportPostNoticeEnabled = enabled;
    }

    public static getReportPostNoticeEnabled(): boolean {
        if (this.reportPostNoticeEnabled === null) {
            this.reportPostNoticeEnabled = PropertiesService.getScriptProperties().getProperty(this.REPORT_POST_NOTICE_ENABLED) == "1";
        }
        return this.reportPostNoticeEnabled;
    }

    public static noticeReportPost(messages: string[]): void {
        if (this.getReportPostNoticeEnabled()) {
            this.pushMessage(messages);
        }
    }
}