import { getConstValues, getRuntimeConfiguration, getStaticConfig } from "../../@const";
import { Configuration } from "../../Packages/Configuration/Configuration";
import { JsonConfigurationFactory } from "../../Packages/Configuration/JsonConfigurationFactory";
import { JsonFileRuntimeConfiguration } from "../../Packages/Configuration/JsonFileRuntimeConfiguration";
import { RuntimeConfiguration } from "../../Packages/Configuration/RuntimeConfiguration";
import { ScriptPropertyRuntimeConfiguration } from "../../Packages/Configuration/ScriptPropertyRuntimeConfiguration";
import { ScriptCacheProvider } from "../../Packages/CustomCacheProvider/ScriptCacheProvider";
import { CustomLogManager } from "../../Packages/CustomLogger/CustomLogManager";
import { DIProperty } from "../../Packages/DIProperty/DIProperty";
import { Router } from "../../Packages/Router/Router";
import { RoutingControllerWithType } from "../../Packages/Router/RoutingController";
import { RoutingParameterType } from "../../Packages/Router/RoutingParameterType";
import { LINECommandDI } from "./Dependencies/LINECommand";
import { LoggerDI } from "./Dependencies/Logger";
import { PostCommandDI } from "./Dependencies/PostCommand";
import { ReportFormConfiguration } from "./Layer1/Configurations/@ReportFormConfiguration";
import { ReportFormConfigurationSchema } from "./Layer1/Configurations/ConfigurationSchema";
import { ConfigurationSourceType } from "./Layer1/Configurations/ConfigurationSourceType";
import { RuntimeConfigurationSchema } from "./Layer1/Configurations/RuntimeConfigurationSchema";
import { ReportFormModule } from "./Layer2/Modules/@ReportFormModule";
import { WebhookModule, WebhookSettingsManager } from "./Layer2/Modules/WebhookModule";
import { ReportFormWebsiteController, ReportFormWebsiteParameter } from "./Layer3/WebsiteControllers/@ReportFormController";
import { LevelReportListWebsiteController, LevelReportListWebsiteParameter } from "./Layer3/WebsiteControllers/LevelReport/LevelReportListWebsiteController";
import { LevelReportWebsiteController, LevelReportWebsiteParameter } from "./Layer3/WebsiteControllers/LevelReport/LevelReportWebsiteController";
import { TopWebsiteController, TopWebsiteParameter } from "./Layer3/WebsiteControllers/TopWebsiteController";
import { UnitReportListWebsiteController, UnitReportListWebsiteParameter } from "./Layer3/WebsiteControllers/UnitReport/UnitReportListWebsiteController";
import { UnitReportWebsiteController, UnitReportWebsiteParameter } from "./Layer3/WebsiteControllers/UnitReport/UnitReportWebsiteController";
import { UnitReportGroupListWebsiteController, UnitReportGroupListWebsiteParameter } from "./Layer3/WebsiteControllers/UnitReportGroup/UnitReportGroupListWebsiteController";
import { UnitReportGroupWebsiteController, UnitReportGroupWebsiteParameter } from "./Layer3/WebsiteControllers/UnitReportGroup/UnitReportGroupWebsiteController";
import { UnverifiedListByGenreWebsiteController, UnverifiedListByGenreWebsiteParameter } from "./Layer3/WebsiteControllers/UnverifiedList/UnverifiedListByGenreWebsiteController";
import { UnverifiedListByLevelWebsiteController, UnverifiedListByLevelWebsiteParameter } from "./Layer3/WebsiteControllers/UnverifiedList/UnverifiedListByLevelWebsiteController";

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

        const router = new Router();
        const topNode = router.getOrCreateNodeWithType<TopWebsiteParameter>(`version:${RoutingParameterType.TEXT}`, TopWebsiteController);

        topNode.getOrCreateNodeWithType<UnitReportListWebsiteParameter>("unitReportList", UnitReportListWebsiteController)
        topNode.getOrCreateNodeWithType<UnitReportWebsiteParameter>(`unitReport/reportId:${RoutingParameterType.TEXT}`, UnitReportWebsiteController)

        topNode.getOrCreateNodeWithType<UnitReportGroupListWebsiteParameter>("unitReportGroupList", UnitReportGroupListWebsiteController)
        topNode.getOrCreateNodeWithType<UnitReportGroupWebsiteParameter>(`unitReportGroup/groupId:${RoutingParameterType.TEXT}`, UnitReportGroupWebsiteController)

        topNode.getOrCreateNodeWithType<LevelReportListWebsiteParameter>("levelReportList", LevelReportListWebsiteController)
        topNode.getOrCreateNodeWithType<LevelReportWebsiteParameter>(`levelReport/reportId:${RoutingParameterType.TEXT}`, LevelReportWebsiteController)

        topNode.getOrCreateNodeWithType<UnverifiedListByGenreWebsiteParameter>("unverifiedListByGenre", UnverifiedListByGenreWebsiteController)
        topNode.getOrCreateNodeWithType<UnverifiedListByLevelWebsiteParameter>("unverifiedListByLevel", UnverifiedListByLevelWebsiteController)

        DIProperty.register(Router, router);
    }

    public bindWebsiteControllers(e: GoogleAppsScript.Events.DoGet): void {
        const router = DIProperty.resolve(Router);

        router.findNodeByName(TopWebsiteController).bindController(() => new TopWebsiteController(e));
        router.findNodeByName(UnitReportListWebsiteController).bindController(() => new UnitReportListWebsiteController(e));
        router.findNodeByName(UnitReportWebsiteController).bindController(() => new UnitReportWebsiteController(e));
        router.findNodeByName(UnitReportGroupListWebsiteController).bindController(() => new UnitReportGroupListWebsiteController(e));
        router.findNodeByName(UnitReportGroupWebsiteController).bindController(() => new UnitReportGroupWebsiteController(e));
        router.findNodeByName(LevelReportListWebsiteController).bindController(() => new LevelReportListWebsiteController(e));
        router.findNodeByName(LevelReportWebsiteController).bindController(() => new LevelReportWebsiteController(e));
        router.findNodeByName(UnverifiedListByGenreWebsiteController).bindController(() => new UnverifiedListByGenreWebsiteController(e));
        router.findNodeByName(UnverifiedListByLevelWebsiteController).bindController(() => new UnverifiedListByLevelWebsiteController(e));
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

    public getPageUrl<TParam extends ReportFormWebsiteParameter>(targetController: { prototype: RoutingControllerWithType<TParam>; name: string }, parameter: TParam): string {
        const configuration = DIProperty.resolve(ReportFormConfiguration);
        const router = DIProperty.resolve(Router);
        return ReportFormWebsiteController.getFullPath(configuration, router, targetController, parameter);
    }
}
