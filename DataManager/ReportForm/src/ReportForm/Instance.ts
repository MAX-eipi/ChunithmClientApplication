import { Configuration } from "../Configurations/Configuration";
import { ScriptPropertiesConfiguration } from "../Configurations/ScriptPropertiesConfiguration";
import { SpreadsheetConfiguration } from "../Configurations/SpreadsheetConfiguration";
import { ReportFormConfiguration } from "./Configurations/@ReportFormConfiguration";
import { LINECommandDI } from "./Dependencies/LINECommand";
import { LoggerDI } from "./Dependencies/Logger";
import { PageDI } from "./Dependencies/Page";
import { PostCommandDI } from "./Dependencies/PostCommand";
import { ReportFormModule } from "./Modules/@ReportFormModule";
import { Debug } from "./Debug";
import { ConfigurationScriptProperty, ConfigurationSpreadsheet } from "../Configurations/ConfigurationDefinition";
import { WebhookSettingsManager } from "./Modules/WebhookModule";

export class Instance {
    private static _instance: Instance = null;
    public static get instance(): Instance {
        if (this._instance == null) {
            let properties = PropertiesService.getScriptProperties().getProperties();
            let config = ReportFormConfiguration.instantiate(this.getConfig(properties), properties);
            let module = ReportFormModule.instantiate(config);
            this._instance = new Instance(module);
        }
        return this._instance;
    }

    public static initialize(): void {
        this.instance;
    }

    private static getConfig(properties: { [key: string]: string }): Configuration {
        switch (properties['config_type']) {
            case 'sheet': {
                let sheet = SpreadsheetApp
                    .openById(properties[ConfigurationScriptProperty.CONFIG_SHEET_ID])
                    .getSheetByName(ConfigurationSpreadsheet.GLOBAL_CONFIG_SHEET_NAME);
                return new SpreadsheetConfiguration(sheet);
            }
            case 'prop': {
                return new ScriptPropertiesConfiguration(properties['config']);
            }
        }
        return null;
    }

    private _module: ReportFormModule = null;
    public get module(): ReportFormModule { return this._module; }

    private constructor(module: ReportFormModule) {
        this._module = module;

        LoggerDI.initialize(this._module);
        PageDI.setPageFactories(this._module);
        LINECommandDI.setCommandFactories(this._module);
        PostCommandDI.setCommandFactories(this._module);

        this.module.webhook.settingsManager = WebhookSettingsManager.readBySheet(
            this.module.config.getScriptProperty(ConfigurationScriptProperty.CONFIG_SHEET_ID),
            ConfigurationSpreadsheet.WEBHOOK_SETTINGS_SHEET_NAME);
    }

    public static exception(error: Error): void {
        let message = `[Message]
${error.message}

[Stack Trace]
${error.stack}`;
        Debug.logError(message);
    }
}