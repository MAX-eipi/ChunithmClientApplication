import { getConstValues } from "../@const";
import { Configuration } from "../Configuration/Configuration";
import { JsonConfigurationFactory } from "../Configuration/JsonConfigurationFactory";
import { JsonFileRuntimeConfiguration } from "../Configuration/JsonFileRuntimeConfiguration";
import { RuntimeConfiguration } from "../Configuration/RuntimeConfiguration";
import { ScriptPropertyRuntimeConfiguration } from "../Configuration/ScriptPropertyRuntimeConfiguration";
import { ScriptCacheProvider } from "../CustomCacheProvider/ScriptCacheProvider";
import { CustomLogManager } from "../CustomLogger/CustomLogManager";
import { DIProperty } from "../DIProperty/DIProperty";
import { Router } from "../Router/Router";
import { RoutingParameterType } from "../Router/RoutingParameterType";
import { ReportFormConfiguration } from "./Configurations/@ReportFormConfiguration";
import { ReportFormConfigurationSchema } from "./Configurations/ConfigurationSchema";
import { ConfigurationSourceType } from "./Configurations/ConfigurationSourceType";
import { RuntimeConfigurationSchema } from "./Configurations/RuntimeConfigurationSchema";
import { LINECommandDI } from "./Dependencies/LINECommand";
import { LoggerDI } from "./Dependencies/Logger";
import { PageDI } from "./Dependencies/Page";
import { PostCommandDI } from "./Dependencies/PostCommand";
import { ReportFormModule } from "./Modules/@ReportFormModule";
import { WebhookModule, WebhookSettingsManager } from "./Modules/WebhookModule";
import { InProgressListWebsiteController, InProgressListWebsiteParameter } from "./WebsiteControllers/InProgressListWebsiteController";
import { TopWebsiteController, TopWebsiteParameter } from "./WebsiteControllers/TopWebsiteController";

export class Instance {
    private static _instance: Instance = null;
    public static get instance(): Instance {
        if (!this._instance) {
            const props = PropertiesService.getScriptProperties();
            const propTable = props.getProperties();
            const config = this.createReportFormConfiguration(propTable, props);
            const module = ReportFormModule.instantiate(config);
            this._instance = new Instance(module);
        }
        return this._instance;
    }

    public static initialize(): void {
        this.instance;
    }

    // TODO: ここが気になる. DI-Containerを実装する
    private _module: ReportFormModule = null;
    public get module(): ReportFormModule { return this._module; }

    public get config(): ReportFormConfiguration {
        return DIProperty.resolve(ReportFormConfiguration);
    }

    private constructor(module: ReportFormModule) {
        this._module = module;

        this.setupDIContainer(module);
        LoggerDI.initialize(module.configuration);
        PageDI.setPageFactories(this._module);
        LINECommandDI.setCommandFactories(this._module);
        PostCommandDI.setCommandFactories(this._module);

        const webhookConfig = this.config.webhook;
        this.module.getModule(WebhookModule).settingsManager = WebhookSettingsManager.readBySheet(
            webhookConfig.settingsSpreadsheetId,
            webhookConfig.settingsWorksheetName);
    }

    public static exception(error: Error): void {
        CustomLogManager.exception(error);
    }

    private setupDIContainer(module: ReportFormModule): void {
        DIProperty.register(ReportFormModule, module);
        DIProperty.register(ReportFormConfiguration, module.configuration);

        const cacheProvider = new ScriptCacheProvider();
        cacheProvider.expirationInSeconds = 3600;
        DIProperty.register('CacheProvider', cacheProvider);
    }

    public setupWebsiteControllers(e: GoogleAppsScript.Events.DoGet & { pathInfo: string }): void {
        const router = new Router();
        const topNode = router.getOrCreateNodeWithType<TopWebsiteParameter>(`version:${RoutingParameterType.TEXT}`, TopWebsiteController);
        topNode.bindController(() => new TopWebsiteController(e));
        topNode.getOrCreateNodeWithType<InProgressListWebsiteParameter>("inProgress", InProgressListWebsiteController)
            .bindController(() => new InProgressListWebsiteController(e));
        DIProperty.register(Router, router);
    }

    private static createReportFormConfiguration(propTable: { [key: string]: string }, props: GoogleAppsScript.Properties.Properties) {
        let config: Configuration<ReportFormConfigurationSchema> = null;
        switch (getConstValues().configurationSourceType) {
            case ConfigurationSourceType.ScriptProperties:
                config = JsonConfigurationFactory.create(propTable['config']);
                break;
            case ConfigurationSourceType.Json:
                config = JsonConfigurationFactory.createByFile(getConstValues().configurationJsonFileId);
                break;
        }
        let runtimeConfig: RuntimeConfiguration<RuntimeConfigurationSchema> = null;
        switch (getConstValues().runtimeConfigurationSourceType) {
            case ConfigurationSourceType.ScriptProperties:
                runtimeConfig = new ScriptPropertyRuntimeConfiguration(props, 'runtime_config');
                break;
            case ConfigurationSourceType.Json:
                runtimeConfig = JsonFileRuntimeConfiguration.createByFileId(getConstValues().runtimeConfigurationJsonFileId);
                break;
        }
        const reportFormConfig = new ReportFormConfiguration(config, runtimeConfig);
        return reportFormConfig;
    }
}
