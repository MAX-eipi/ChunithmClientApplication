import { ConfigurationScriptProperty } from "../../Configurations/ConfigurationDefinition";
import { ScriptPropertiesConfiguration } from "../../Configurations/ScriptPropertiesConfiguration";
import { SpreadsheetConfiguration } from "../../Configurations/SpreadsheetConfiguration";
import { VersionConfiguration } from "../Configurations/VersionConfiguration";
import { ReportFormModule } from "./@ReportFormModule";


export class VersionModule extends ReportFormModule {
    public static readonly moduleName = 'version';

    private _versionConfigMap: { [key: string]: VersionConfiguration } = {};
    public getVersionConfig(versionName: string): VersionConfiguration {
        if (versionName in this._versionConfigMap) {
            return this._versionConfigMap[versionName];
        }
        switch (this.config.getScriptProperty(ConfigurationScriptProperty.VERSION_CONFIG_TYPE)) {
            case 'sheet':
                let sheet = SpreadsheetApp
                    .openById(this.config.getScriptProperty(ConfigurationScriptProperty.CONFIG_SHEET_ID))
                    .getSheetByName(versionName);
                let sheetConfig = new SpreadsheetConfiguration(sheet);
                return this._versionConfigMap[versionName] = new VersionConfiguration(versionName, sheetConfig);
            case 'prop':
                let jsonConfig = new ScriptPropertiesConfiguration(this.config.getScriptProperty(ConfigurationScriptProperty.getVersionConfigName(versionName)));
                return this._versionConfigMap[versionName] = new VersionConfiguration(versionName, jsonConfig);
        }
        return null;
    }

    public getDefaultVersionConfig(): VersionConfiguration {
        let versionName = this.config.common.defaultVersionName;
        return this.getVersionConfig(versionName);
    }

    public getLatestVersionConfig(): VersionConfiguration {
        let versionName = this.config.common.latestVersionName;
        return this.getVersionConfig(versionName);
    }
}