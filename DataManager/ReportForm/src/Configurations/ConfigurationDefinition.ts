
export class ConfigurationScriptProperty {
    public static readonly CONFIG_TYPE = 'config_type';

    public static readonly CONFIG_SHEET_ID = 'config_sheet_id';

    public static readonly GLOBAL_CONFIG = 'config';
    public static readonly VERSION_NAME_LIST = 'version_name_list';

    public static readonly VERSION_CONFIG_TYPE = 'version_config_type';
    public static readonly VERSION_CONFIG_PREFX = 'version_config_';

    public static getVersionConfigName(versionName: string): string {
        return this.VERSION_CONFIG_PREFX + versionName;
    }

    // LINE
    public static readonly REPORT_POST_NOTICE_ENABLED = 'line_report_post_notice_enabled';

    // Twitter
    public static readonly POST_TWEET_ENABLED = 'twitter_post_tweet_enabled';
}

export class ConfigurationPropertyName {
    // Common
    public static readonly ROOT_URL = 'root_url';
    public static readonly ENVIRONMENT = 'environment';
    public static readonly ROLE = 'role';

    public static readonly DEFAULT_VERSION_NAME = 'default_version_name';

    // Log
    public static readonly LOG_SHEET_ID = 'log_sheet_id';
    public static readonly LOG_SHEET_NAME = 'log_sheet_name';
    public static readonly ERROR_LOG_SHEET_ID = 'error_log_sheet_id';
    public static readonly ERROR_LOG_SHEET_NAME = 'error_log_sheet_name';

    // Version
    public static readonly DISPLAY_NAME = 'version_text'
    public static readonly MUSIC_DATA_TABLE_SHEET_ID = 'music_data_spreadsheet_id';
    public static readonly MUSIC_DATA_TABLE_SHEET_NAME = 'music_data_worksheet_name';
    public static readonly REPORT_SHEET_ID = 'report_spreadsheet_id';
    public static readonly REPORT_SHEET_NAME = 'report_worksheet_name';
    public static readonly REPORT_GROUP_SHEET_NAME = 'report_group_worksheet_name';
    public static readonly BULK_REPORT_SHEET_NAME = 'bulk_report_worksheet_name';
    public static readonly GENRE_LIST = 'genre_list';
    public static readonly BULK_REPORT_SPREADSHEET_ID = 'bulk_report_spreadsheet_id';
    public static readonly NEXT_VERSION_BULK_REPORT_SPREADSHEET_ID = 'next_version_bulk_report_spreadsheet_id';

    // LINE
    public static readonly LINE_CHANNEL_ACCESS_TOKEN = 'line_channel_access_token';
    public static readonly LINE_NOTICE_TARGET_ID_LIST = 'line_notice_target_id_list';
    public static readonly LINE_ERROR_NOTICE_TARGET_ID_LIST = 'line_error_notice_target_id_list';

    // Twitter
    public static readonly TWITTER_API_TOKEN = 'twitter_api_token';
    public static readonly TWITTER_API_SECRET_KEY = 'twitter_api_secret_key';

    // Report
    public static readonly REPORT_GOOGLE_FORM_ID = 'report_form_id';
    public static readonly BULK_REPORT_GOOGLE_FORM_ID = 'bulk_report_form_id';
};

export class ConfigurationSpreadsheet {
    public static readonly GLOBAL_CONFIG_SHEET_NAME = 'Global';
    public static readonly VERSION_LIST_SHEET_NAME = 'Version';
    public static readonly WEBHOOK_SETTINGS_SHEET_NAME = 'Webhook';
}
