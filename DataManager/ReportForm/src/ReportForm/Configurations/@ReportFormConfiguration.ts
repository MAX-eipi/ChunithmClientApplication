import { Configuration } from "../../Configurations/Configuration";
import { CommonConfiguration } from "./CommonConfiguration";
import { LINEConfiguration } from "./LineConfiguration";
import { LogConfiguration } from "./LogConfiguration";
import { TwitterConfiguration } from "./TwitterConfiguration";
import { ReportConfiguration } from "./ReportConfiguration";

export class ReportFormConfiguration implements Configuration {
    public static instantiate(config: Configuration, properties: { [key: string]: string }): ReportFormConfiguration {
        let instance = new ReportFormConfiguration();
        instance._root = instance;
        instance._config = config;
        instance._properties = properties;
        return instance;
    }

    private _root: ReportFormConfiguration = null;
    private _config: Configuration = null;
    private _properties: { [key: string]: string } = null;

    public hasProperty(key: string): boolean {
        return this._root._config.hasProperty(key);
    }
    public getProperty<T>(key: string, defaultValue: T): T {
        return this._root._config.getProperty<T>(key, defaultValue);
    }

    public hasScriptProperty(key: string): boolean {
        return key in this._root._properties;
    }
    public getScriptProperty(key: string): string {
        return this._root._properties[key];
    }

    protected setScriptProperty(key: string, value: string) {
        this._root._properties[key] = value;
        PropertiesService.getScriptProperties().setProperty(key, value);
    }

    private _configList: { [key: string]: ReportFormConfiguration } = {};
    private getConfigInternal<TConfig extends ReportFormConfiguration>(key: string, factory: { new(): TConfig }): TConfig {
        if (!(key in this._root._configList)) {
            let config = new factory();
            config._root = this._root;
            this._root._configList[key] = config;
        }
        return this._root._configList[key] as TConfig;
    }

    public getConfig<TConfig extends ReportFormConfiguration>(factory: { configName: string; new(): TConfig }): TConfig {
        if (factory.configName in this._root._configList) {
            return this._root._configList[factory.configName] as TConfig;
        }
        const config = new factory();
        config._root = this._root;
        this._root._configList[factory.configName] = config;
        return config;
    }

    public get common(): CommonConfiguration { return this.getConfigInternal(CommonConfiguration.configName, CommonConfiguration); }
    public get line(): LINEConfiguration { return this.getConfigInternal('line', LINEConfiguration); }
    public get log(): LogConfiguration { return this.getConfigInternal('log', LogConfiguration); }
    public get twitter(): TwitterConfiguration { return this.getConfigInternal('twitter', TwitterConfiguration); }
    public get report(): ReportConfiguration { return this.getConfigInternal('report', ReportConfiguration); }
}