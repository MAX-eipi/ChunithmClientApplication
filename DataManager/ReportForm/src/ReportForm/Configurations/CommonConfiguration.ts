import { ConfigurationPropertyName, ConfigurationScriptProperty } from "../../Configurations/ConfigurationDefinition";
import { Environment } from "../Environment";
import { Role } from "../Role";
import { ReportFormConfiguration } from "./@ReportFormConfiguration";

export class CommonConfiguration extends ReportFormConfiguration {
    public get rootUrl(): string { return this.getProperty(ConfigurationPropertyName.ROOT_URL, ""); }
    public get environment(): Environment { return this.getProperty(ConfigurationPropertyName.ENVIRONMENT, Environment.Release); }
    public get role(): Role { return this.getProperty(ConfigurationPropertyName.ROLE, Role.Reader); }

    public get defaultVersionName(): string {
        let versionName = this.getProperty(ConfigurationPropertyName.DEFAULT_VERSION_NAME, '');
        if (!versionName) {
            return this.latestVersionName;
        }
        return versionName;
    }

    public get latestVersionName(): string {
        return this.versionNames[this.versionNames.length - 1];
    }

    private _versionNames: string[];
    public get versionNames(): string[] {
        if (!this._versionNames) {
            this._versionNames = JSON.parse(this.getScriptProperty(ConfigurationScriptProperty.VERSION_NAME_LIST));
        }
        return this._versionNames;
    }
}