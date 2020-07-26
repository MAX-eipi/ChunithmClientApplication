import { getConstValues } from "../../@const";
import { ConfigurationScriptProperty } from "../../Configurations/ConfigurationDefinition";

export class ConfigurationEditor {
    public static store(): GoogleAppsScript.Properties.Properties {
        const jsonFile = DriveApp.getFileById(getConstValues().configurationJsonFileId);
        const json = jsonFile.getBlob().getDataAsString();
        return PropertiesService.getScriptProperties().setProperty(
            ConfigurationScriptProperty.GLOBAL_CONFIG,
            JSON.stringify(JSON.parse(json)));
    }
}
