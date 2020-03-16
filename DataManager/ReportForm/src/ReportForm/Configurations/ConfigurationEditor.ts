import { ConfigurationScriptProperty } from "../../Configurations/ConfigurationDefinition";
import { SpreadsheetConfiguration } from "../../Configurations/SpreadsheetConfiguration";

export class ConfigurationEditor {
    public static store(configSpreadsheetId: string, globalConfigWorksheetName: string, versionNameListWorksheetName: string): GoogleAppsScript.Properties.Properties {
        let configSpreadsheet = SpreadsheetApp.openById(configSpreadsheetId);

        let globalConfigSheet = configSpreadsheet.getSheetByName(globalConfigWorksheetName);
        let globalConfig = new SpreadsheetConfiguration(globalConfigSheet);

        let versionNameListSheet = configSpreadsheet.getSheetByName(versionNameListWorksheetName);
        let versionNameList = this.getVersionNameList(versionNameListSheet);

        let versionConfigMap: { [key: string]: SpreadsheetConfiguration } = {};
        for (let versionName of versionNameList) {
            let sheet = configSpreadsheet.getSheetByName(versionName);
            versionConfigMap[versionName] = new SpreadsheetConfiguration(sheet);
        }

        let properties: { [key: string]: string } = {};
        properties[ConfigurationScriptProperty.GLOBAL_CONFIG] = JSON.stringify(globalConfig.properties);
        properties[ConfigurationScriptProperty.VERSION_NAME_LIST] = JSON.stringify(versionNameList);
        for (let versionName of versionNameList) {
            let versionConfig = versionConfigMap[versionName];
            properties[ConfigurationScriptProperty.getVersionConfigName(versionName)] = JSON.stringify(versionConfig.properties);
        }
        return PropertiesService.getScriptProperties().setProperties(properties);
    }

    private static getVersionNameList(sheet: GoogleAppsScript.Spreadsheet.Sheet): string[] {
        let list: string[] = [];
        let table = sheet.getDataRange().getValues();
        for (var i = 1; i < table.length; i++) {
            let row = table[i];
            let name = row[0].toString();
            list.push(name);
        }
        return list;
    }
}
