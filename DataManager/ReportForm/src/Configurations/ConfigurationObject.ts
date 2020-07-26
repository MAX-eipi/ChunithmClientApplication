import { Configuration, GlobalConfigurationFormat, ReportFormConfigurationFormat, VersionConfigurationFormat } from "./Configuration";

export enum ConfigurationSourceType {
    ScriptProperties,
    Json,
}

export class ConfigurationObject implements Configuration, ReportFormConfigurationFormat {
    public get global(): GlobalConfigurationFormat {
        return this._configurationObject.global;
    }

    public get versions(): Record<string, VersionConfigurationFormat> {
        return this._configurationObject.versions;
    }

    public constructor(protected readonly _configurationObject: ReportFormConfigurationFormat) {
    }

    public hasProperty(key: string): boolean {
        return key in this._configurationObject;
    }

    public getProperty<T>(key: string, defaultValue: T): T {
        if (!this.hasProperty(key)) {
            return defaultValue;
        }
        return this._configurationObject[key] as T;
    }
}
