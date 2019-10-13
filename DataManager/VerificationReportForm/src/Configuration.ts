const GLOBAL_CONFIG_PROPERTY_NAME = "global_config";
const VERSION_NAME_LIST_PROPERTY_NAME = "version_name_list";

export class ConfigurationEditor {
    private static configurationSpreadSheet: GoogleAppsScript.Spreadsheet.Spreadsheet;
    private static globalConfigurationSheet: GoogleAppsScript.Spreadsheet.Sheet;
    private static versionListSheet: GoogleAppsScript.Spreadsheet.Sheet;

    private static globalConfigurationProperties: { [key: string]: Object };
    private static versionConfigurations: { id: string, name: string, properties: { [key: string]: Object } }[];

    public static load(spreadSheetId: string, globalConfigurationSheetName: string, versionListSheetName: string): void {
        this.loadSpreadsheet(spreadSheetId);
        this.loadGlobalConfiguration(globalConfigurationSheetName);
        this.loadVersionConfiguration(versionListSheetName);
    }

    private static loadSpreadsheet(spreadsheetId: string): void {
        this.configurationSpreadSheet = SpreadsheetApp.openById(spreadsheetId);
        if (!this.configurationSpreadSheet) {
            throw new Error(`[ConfigurationEditor.loadSpreadsheet]invalid spread sheet. spreadsheetId: ${spreadsheetId}`);
        }
    }

    private static loadGlobalConfiguration(globalConfigurationSheetName: string): void {
        this.globalConfigurationSheet = this.configurationSpreadSheet.getSheetByName(globalConfigurationSheetName);
        if (!this.globalConfigurationSheet) {
            throw new Error(`[ConfigurationEditor.loadGlobalConfiguration]invalid sheet. globalConfigurationSheetName: ${globalConfigurationSheetName}`);
        }

        this.globalConfigurationProperties = {};
        let table = this.globalConfigurationSheet.getDataRange().getValues();
        for (var i = 1; i < table.length; i++) {
            let row = table[i];
            let key = row[0].toString();
            let value = row[1];
            this.globalConfigurationProperties[key] = value;
        }
    }

    private static loadVersionConfiguration(versionListSheetName: string): void {
        this.versionListSheet = this.configurationSpreadSheet.getSheetByName(versionListSheetName);
        if (!this.versionListSheet) {
            throw new Error(`[ConfigurationEditor.loadVersionConfiguration]invalid sheet. versionListSheetName: ${versionListSheetName}`);
        }

        this.versionConfigurations = [];
        let table = this.versionListSheet.getDataRange().getValues();
        for (var i = 1; i < table.length; i++) {
            let row = table[i];
            let id = row[0].toString();
            let name = row[1].toString();
            this.versionConfigurations.push({ id: id, name: name, properties: {} });
        }

        for (var i = 0; i < this.versionConfigurations.length; i++) {
            let versionConfig = this.versionConfigurations[i];
            let properties = this.getVersionConfigurationProperties(versionConfig);
            versionConfig.properties = properties;
        }
    }

    private static getVersionConfigurationProperties(version: { id: string, name: string }): { [key: string]: Object } {
        let sheet = this.configurationSpreadSheet.getSheetByName(version.name);
        if (!sheet) {
            throw new Error(`[ConfigurationEditor.getVersionConfigurationProperties]invalid sheet. version.name: ${version.name}`);
        }

        var properties: { [key: string]: Object } = {};
        let table = sheet.getDataRange().getValues();
        for (var i = 1; i < table.length; i++) {
            let row = table[i];
            let key = row[0].toString();
            let value = row[1];
            properties[key] = value;
        }
        return properties;
    }

    public static store(): void {
        this.storeGlobalConfiguration();
        this.storeVersionConfiguration();
    }

    private static storeGlobalConfiguration(): void {
        if (!this.globalConfigurationProperties) {
            throw new Error('[ConfigurationEditor.storeGlobalConfiguration]globalConfigurationProperties is invalid.');
        }
        PropertiesService.getScriptProperties().setProperty(GLOBAL_CONFIG_PROPERTY_NAME, JSON.stringify(this.globalConfigurationProperties));
    }

    private static storeVersionConfiguration(): void {

        let properties: { [key: string]: string } = {};
        let versionNames: string[] = [];

        for (var i = 0; i < this.versionConfigurations.length; i++) {
            let config = this.versionConfigurations[i];

            let propertyName = VersionConfiguration.VERSION_CONFIG_PROPERTY_NAME_PREFIX + config.name;
            properties[propertyName] = JSON.stringify(config.properties);

            versionNames.push(config.name);
        }

        properties[VERSION_NAME_LIST_PROPERTY_NAME] = JSON.stringify(versionNames);

        PropertiesService.getScriptProperties().setProperties(properties);
    }

    public static getGlobalConfigurationJson(): string {
        if (!this.globalConfigurationProperties) {
            return "{}";
        }
        return JSON.stringify(this.globalConfigurationProperties);
    }

    public static getVersionConfigurationJson(): string {
        if (!this.versionConfigurations) {
            return "[]";
        }
        return JSON.stringify(this.versionConfigurations);
    }
}

export class Configuration {
    private scriptProperties: { [key: string]: string };
    private globalConfigurationProperties: { [key: string]: Object };

    private getScriptProperty(key: string): string {
        return this.getScriptProperties()[key];
    }

    private getScriptProperties(): { [key: string]: string } {
        if (!this.scriptProperties) {
            this.scriptProperties = PropertiesService.getScriptProperties().getProperties() as { [key: string]: string };
        }
        return this.scriptProperties;
    }

    public getGlobalConfigurationProperties(): { [key: string]: Object } {
        this.loadGlobalConfiguration();
        return this.globalConfigurationProperties;
    }

    private loadGlobalConfiguration(): void {
        if (this.globalConfigurationProperties) {
            return;
        }

        let propertyJson = this.getScriptProperty(GLOBAL_CONFIG_PROPERTY_NAME);
        this.globalConfigurationProperties = JSON.parse(propertyJson);
        if (!this.globalConfigurationProperties) {
            throw new Error('[Configuration.loadGlobalConfiguration]failed to load config.');
        }
    }

    public getGlobalConfigurationProperty<T>(key: string, defaultValue: T = null): T {
        let value = this.getGlobalConfigurationProperties()[key];
        if (!value) {
            return defaultValue;
        }
        return value as T;
    }

    public getVersionConfiguration(versionName: string): VersionConfiguration {
        let targetVersionName = versionName;
        let configuration = VersionConfiguration.instantiate(this.getScriptProperties(), targetVersionName);
        return configuration;
    }

    public getLatestVersionName(): string {
        let versionNames: string[] = JSON.parse(this.getScriptProperty(VERSION_NAME_LIST_PROPERTY_NAME));
        return versionNames[versionNames.length - 1];
    }
}

export class VersionConfiguration {
    public static readonly VERSION_CONFIG_PROPERTY_NAME_PREFIX = "version_config_";

    private versionName: string;
    private properties: { [key: string]: Object };

    public static instantiate(scriptProperties: { [key: string]: string }, versionName: string): VersionConfiguration {
        let key = this.VERSION_CONFIG_PROPERTY_NAME_PREFIX + versionName;
        if (!scriptProperties[key]) {
            return null;
        }
        let properties = JSON.parse(scriptProperties[key]);
        return new VersionConfiguration(versionName, properties);
    }

    private constructor(versionName: string, properties: { [key: string]: Object }) {
        this.versionName = versionName;
        this.properties = properties;
    }

    public getVersionName(): string {
        return this.versionName;
    }

    public getProperty<T>(key: string, defaultValue: T = null): T {
        if (!this.properties[key]) {
            return defaultValue;
        }
        return this.properties[key] as T;
    }
}
