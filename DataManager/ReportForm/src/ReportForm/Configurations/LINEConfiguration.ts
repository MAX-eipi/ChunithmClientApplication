import { ReportFormConfiguration } from "./@ReportFormConfiguration";
import { ConfigurationPropertyName, ConfigurationScriptProperty } from "../../Configurations/ConfigurationDefinition";

export class LINEConfiguration extends ReportFormConfiguration {
    public get channelAccessToken(): string {
        return this.getProperty<string>(ConfigurationPropertyName.LINE_CHANNEL_ACCESS_TOKEN, "");
    }
    public get noticeTargetIdList(): string[] {
        return this.getProperty<string>(ConfigurationPropertyName.LINE_NOTICE_TARGET_ID_LIST, "").split(',');
    }
    public get errorNoticeTargetIdList(): string[] {
        return this.getProperty<string>(ConfigurationPropertyName.LINE_ERROR_NOTICE_TARGET_ID_LIST, "").split(',');
    }

    public get reportPostNoticeEnabled(): boolean {
        return this.getScriptProperty(ConfigurationScriptProperty.REPORT_POST_NOTICE_ENABLED) == '1';
    }
    public set reportPostNoticeEnabled(value: boolean) {
        this.setScriptProperty(ConfigurationScriptProperty.REPORT_POST_NOTICE_ENABLED, value ? '1' : '0');
    }
}