import { Configuration } from "./Configuration";

export class ScriptPropertiesConfiguration implements Configuration {
    private _properties: { [key: string]: any } = null;
    public constructor(configJson: string) {
        this._properties = JSON.parse(configJson);
    }

    public hasProperty(key: string): boolean {
        return key in this._properties;
    }

    public getProperty<T>(key: string, defaultValue: T): T {
        if (!this.hasProperty(key)) {
            return defaultValue;
        }
        return this._properties[key] as T;
    }

}