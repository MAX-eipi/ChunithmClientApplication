// TODO: mv /ReportForm

export class ConfigurationScriptProperty {

    public static readonly CONFIG_SHEET_ID = 'config_sheet_id';

    public static readonly GLOBAL_CONFIG = 'config';
    public static readonly VERSION_NAME_LIST = 'version_name_list';

    public static readonly VERSION_CONFIG_PREFX = 'version_config_';

    public static getVersionConfigName(versionName: string): string {
        return this.VERSION_CONFIG_PREFX + versionName;
    }

    // LINE
    public static readonly REPORT_POST_NOTICE_ENABLED = 'line_report_post_notice_enabled';

    // Twitter
    public static readonly POST_TWEET_ENABLED = 'twitter_post_tweet_enabled';
}

export class ConfigurationSpreadsheet {
    public static readonly GLOBAL_CONFIG_SHEET_NAME = 'Global';
    public static readonly VERSION_LIST_SHEET_NAME = 'Version';
    public static readonly WEBHOOK_SETTINGS_SHEET_NAME = 'Webhook';
}
