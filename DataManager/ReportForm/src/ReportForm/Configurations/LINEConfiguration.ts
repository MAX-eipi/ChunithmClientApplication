import { ConfigurationScriptProperty } from "../../Configurations/ConfigurationDefinition";
import { ReportFormConfiguration } from "./@ReportFormConfiguration";

export class LINEConfiguration extends ReportFormConfiguration {
    public get channelAccessToken(): string {
        return this.global.lineChannelAccessToken;
    }
    public get noticeTargetIdList(): string[] {
        return this.global.lineNoticeTargetIdList;
    }
    public get errorNoticeTargetIdList(): string[] {
        return this.global.lineErrorNoticeTargetIdList;
    }

    public get reportPostNoticeEnabled(): boolean {
        return this.getScriptProperty(ConfigurationScriptProperty.REPORT_POST_NOTICE_ENABLED) === '1';
    }
    public set reportPostNoticeEnabled(value: boolean) {
        this.setScriptProperty(ConfigurationScriptProperty.REPORT_POST_NOTICE_ENABLED, value ? '1' : '0');
    }
}
