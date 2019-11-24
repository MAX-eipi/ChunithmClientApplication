import * as DataManager from "../../DataManager";
import { Operator } from "./Operator";
import { VersionConfiguration } from "../Configuration";

export class DataManagerOperator {
    private static instance: DataManager.Instance = null;
    private static genres: string[] = null;

    public static reset(versionName: string): void {
        this.instance = null;
        this.genres = null;
    }

    private static getInstance(): DataManager.Instance {
        if (!Operator.getTargetVersionName()) {
            return null;
        }

        let versionConfig = Operator.getTargetVersionConfiguration();
        if (!versionConfig) {
            throw new Error("versionConfig is invalid.");
        }

        let dbConfig = this.createDataManagerConfig(versionConfig);
        this.instance = new DataManager.Instance(dbConfig);
        return this.instance;
    }

    private static createDataManagerConfig(versionConfig: VersionConfiguration): DataManager.Configuration {
        let spreadsheetId = versionConfig.getProperty<string>("music_data_spread_sheet_id", "");
        let spreadsheet = SpreadsheetApp.openById(spreadsheetId);
        if (!spreadsheet) {
            throw new Error(`Spreadsheet is invalid. spreadsheetId: ${spreadsheetId}`);
        }

        let sheet = spreadsheet.getSheetByName("MusicData");
        if (!sheet) {
            throw new Error("MusicData sheet is invalid.");
        }

        let dataManagerConfig: DataManager.Configuration = {
            musicDataSheet: sheet
        };
        return dataManagerConfig;
    }

    public static getTable(): DataManager.MusicDataTable {
        let instance = this.getInstance();
        if (!instance) {
            return null;
        }
        return instance.getTable();
    }

    public static getMusicDatas(): DataManager.MusicData[] {
        let instance = this.getInstance();
        if (!instance) {
            return [];
        }
        return instance.getTable().getTable();
    }

    public static updateTable(parameters: any[]): DataManager.MusicDataTable {
        let instance = this.getInstance();
        if (!instance) {
            return null;
        }
        return instance.updateTable(parameters)
    }

    public static updateMusicData(parameters: any[]): DataManager.MusicData[] {
        let instance = this.getInstance();
        if (!instance) {
            return [];
        }
        return instance.updateMusicData(parameters);
    }

    public static getGenres(): string[] {
        if (this.genres) {
            return this.genres;
        }

        let versionConfig = Operator.getTargetVersionConfiguration();
        if (!versionConfig) {
            return [];
        }
        let genreText = versionConfig.getProperty<string>("genre_list", "[]");
        this.genres = JSON.parse(genreText);
        return this.genres;
    }
}