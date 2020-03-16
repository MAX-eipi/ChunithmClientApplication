import { Configuration } from "../../04_Configurations/Configuration";
import { ConfigurationPropertyName } from "../../Configurations/ConfigurationDefinition";

export class VersionConfiguration implements Configuration {
    private _versionName: string;
    private _config: Configuration;

    public constructor(versionName: string, config: Configuration) {
        this._versionName = versionName;
        this._config = config;
    }

    public hasProperty(key: string): boolean {
        return this._config.hasProperty(key);
    }

    public getProperty<T>(key: string, defaultValue: T): T {
        return this._config.getProperty<T>(key, defaultValue);
    }

    public get versionName(): string {
        return this._versionName;
    }
    public get displayVersionName(): string {
        return this.getProperty(ConfigurationPropertyName.DISPLAY_NAME, '');
    }

    public get musicDataTableSpreadsheetId(): string {
        return this.getProperty<string>(ConfigurationPropertyName.MUSIC_DATA_TABLE_SHEET_ID, '');
    }
    public get musicDataTableWorksheetName(): string {
        return this.getProperty<string>(ConfigurationPropertyName.MUSIC_DATA_TABLE_SHEET_NAME, '');
    }

    public get reportSpreadsheetId(): string {
        return this.getProperty<string>(ConfigurationPropertyName.REPORT_SHEET_ID, '');
    }
    public get reportWorksheetName(): string {
        return this.getProperty<string>(ConfigurationPropertyName.REPORT_SHEET_NAME, '')
    }
    public get reportGroupWorksheetName(): string {
        return this.getProperty<string>(ConfigurationPropertyName.REPORT_GROUP_SHEET_NAME, '');
    }

    private _genres: string[];
    public get genres(): string[] {
        if (this._genres) {
            return this._genres;
        }
        let genreText = this.getProperty<string>(ConfigurationPropertyName.GENRE_LIST, "[]");
        this._genres = JSON.parse(genreText);
        return this._genres;
    }
}
