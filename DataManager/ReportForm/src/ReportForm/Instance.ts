import { getConstValues } from "../@const";
import { ConfigurationScriptProperty, ConfigurationSpreadsheet } from "../Configurations/ConfigurationDefinition";
import { ConfigurationObject, ConfigurationSourceType } from "../Configurations/ConfigurationObject";
import { JsonConfiguration } from "../Configurations/JsonConfiguration";
import { CustomLogManager } from "../CustomLogger/CustomLogManager";
import { ReportFormConfiguration } from "./Configurations/@ReportFormConfiguration";
import { LINECommandDI } from "./Dependencies/LINECommand";
import { LoggerDI } from "./Dependencies/Logger";
import { PageDI } from "./Dependencies/Page";
import { PostCommandDI } from "./Dependencies/PostCommand";
import { ReportFormModule } from "./Modules/@ReportFormModule";
import { WebhookModule, WebhookSettingsManager } from "./Modules/WebhookModule";

export class Instance {
    private static _instance: Instance = null;
    public static get instance(): Instance {
        if (!this._instance) {
            const properties = PropertiesService.getScriptProperties().getProperties();
            const config = ReportFormConfiguration.instantiate(this.getConfig(properties), properties);
            const module = ReportFormModule.instantiate(config);
            this._instance = new Instance(module);
        }
        return this._instance;
    }

    public static initialize(): void {
        this.instance;
    }

    private static getConfig(properties: Record<string, string>): ConfigurationObject {
        switch (getConstValues().configurationSourceType) {
            case ConfigurationSourceType.ScriptProperties:
                return JsonConfiguration.createByJson(properties[ConfigurationScriptProperty.GLOBAL_CONFIG]);
            case ConfigurationSourceType.Json:
                return JsonConfiguration.createByFileId(getConstValues().configurationJsonFileId);
        }
    }

    // TODO: ここが気になる. DI-Containerを実装する
    private _module: ReportFormModule = null;
    public get module(): ReportFormModule { return this._module; }

    private constructor(module: ReportFormModule) {
        this._module = module;

        LoggerDI.initialize(this._module);
        PageDI.setPageFactories(this._module);
        LINECommandDI.setCommandFactories(this._module);
        PostCommandDI.setCommandFactories(this._module);

        this.module.getModule(WebhookModule).settingsManager = WebhookSettingsManager.readBySheet(
            this.module.config.getScriptProperty(ConfigurationScriptProperty.CONFIG_SHEET_ID),
            ConfigurationSpreadsheet.WEBHOOK_SETTINGS_SHEET_NAME);
    }

    public static exception(error: Error): void {
        CustomLogManager.exception(error);
    }
}
