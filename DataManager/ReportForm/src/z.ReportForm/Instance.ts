import { getConstValues, getStaticConfig, getRuntimeConfiguration } from "../@const";
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
import { LevelReportListWebsiteController, LevelReportListWebsiteParameter } from "./WebsiteControllers/LevelReport/LevelReportListWebsiteController";
import { LevelReportWebsiteController, LevelReportWebsiteParameter } from "./WebsiteControllers/LevelReport/LevelReportWebsiteController";
import { TopWebsiteController, TopWebsiteParameter } from "./WebsiteControllers/TopWebsiteController";
import { UnitReportListWebsiteController, UnitReportListWebsiteParameter } from "./WebsiteControllers/UnitReport/UnitReportListWebsiteController";
import { UnitReportWebsiteController, UnitReportWebsiteParameter } from "./WebsiteControllers/UnitReport/UnitReportWebsiteController";
import { UnitReportGroupListWebsiteController, UnitReportGroupListWebsiteParameter } from "./WebsiteControllers/UnitReportGroup/UnitReportGroupListWebsiteController";
import { UnitReportGroupWebsiteController, UnitReportGroupWebsiteParameter } from "./WebsiteControllers/UnitReportGroup/UnitReportGroupWebsiteController";
import { UnverifiedListByGenreWebsiteController, UnverifiedListByGenreWebsiteParameter } from "./WebsiteControllers/UnverifiedList/UnverifiedListByGenreWebsiteController";
import { UnverifiedListByLevelWebsiteController, UnverifiedListByLevelWebsiteParameter } from "./WebsiteControllers/UnverifiedList/UnverifiedListByLevelWebsiteController";

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

        topNode.getOrCreateNodeWithType<UnitReportListWebsiteParameter>("unitReportList", UnitReportListWebsiteController)
            .bindController(() => new UnitReportListWebsiteController(e));
        topNode.getOrCreateNodeWithType<UnitReportWebsiteParameter>(`unitReport/reportId:${RoutingParameterType.TEXT}`, UnitReportWebsiteController)
            .bindController(() => new UnitReportWebsiteController(e));

        topNode.getOrCreateNodeWithType<UnitReportGroupListWebsiteParameter>("unitReportGroupList", UnitReportGroupListWebsiteController)
            .bindController(() => new UnitReportGroupListWebsiteController(e));
        topNode.getOrCreateNodeWithType<UnitReportGroupWebsiteParameter>(`unitReportGroup/groupId:${RoutingParameterType.TEXT}`, UnitReportGroupWebsiteController)
            .bindController(() => new UnitReportGroupWebsiteController(e));

        topNode.getOrCreateNodeWithType<LevelReportListWebsiteParameter>("levelReportList", LevelReportListWebsiteController)
            .bindController(() => new LevelReportListWebsiteController(e));
        topNode.getOrCreateNodeWithType<LevelReportWebsiteParameter>(`levelReport/reportId:${RoutingParameterType.TEXT}`, LevelReportWebsiteController)
            .bindController(() => new LevelReportWebsiteController(e));

        topNode.getOrCreateNodeWithType<UnverifiedListByGenreWebsiteParameter>("unverifiedListByGenre", UnverifiedListByGenreWebsiteController)
            .bindController(() => new UnverifiedListByGenreWebsiteController(e));
        topNode.getOrCreateNodeWithType<UnverifiedListByLevelWebsiteParameter>("unverifiedListByLevel", UnverifiedListByLevelWebsiteController)
            .bindController(() => new UnverifiedListByLevelWebsiteController(e));

        DIProperty.register(Router, router);
    }

    private static createReportFormConfiguration(propTable: { [key: string]: string }, props: GoogleAppsScript.Properties.Properties) {
        const config = this.createStaticConfiguration(propTable);
        const runtimeConfig = this.createRuntimeConfiguration(props);
        const reportFormConfig = new ReportFormConfiguration(config, runtimeConfig);
        return reportFormConfig;
    }

    private static createStaticConfiguration(propTable: { [key: string]: string }): Configuration<ReportFormConfigurationSchema> {

        return JsonConfigurationFactory.create(JSON.stringify(getStaticConfig()));

        switch (getConstValues().configurationSourceType) {
            case ConfigurationSourceType.ScriptProperties:
                return JsonConfigurationFactory.create(propTable['config']);
            case ConfigurationSourceType.Json:
                return JsonConfigurationFactory.createByFile(getConstValues().configurationJsonFileId);
        }
    }

    private static createRuntimeConfiguration(props: GoogleAppsScript.Properties.Properties): RuntimeConfiguration<RuntimeConfigurationSchema> {

        const properties = getRuntimeConfiguration();
        return {
            properties: properties,
            hasProperty: key => key in properties,
            getProperty: (key, dv) => key in properties ? properties[key] : dv,
            setProperty: (key, v) => properties[key] = v,
            apply: () => { }
        };

        switch (getConstValues().runtimeConfigurationSourceType) {
            case ConfigurationSourceType.ScriptProperties:
                return new ScriptPropertyRuntimeConfiguration(props, 'runtime_config');
            case ConfigurationSourceType.Json:
                return JsonFileRuntimeConfiguration.createByFileId(getConstValues().runtimeConfigurationJsonFileId);
        }
    }
}
