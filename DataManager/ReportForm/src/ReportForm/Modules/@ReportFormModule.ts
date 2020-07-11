import { ReportFormConfiguration } from "../Configurations/@ReportFormConfiguration";
import { LINEModule } from "./LINEModule";
import { MusicDataModule } from "./MusicDataModule";
import { PostCommandModule } from "./PostCommandModule";
import { ReportModule } from "./Report/ReportModule";
import { Router } from "./Router";
import { TwitterModule } from "./TwitterModule";
import { VersionModule } from "./VersionModule";
import { ApprovalModule } from "./ApprovalModule";
import { WebhookModule } from "./WebhookModule";

export class ReportFormModule {
    public static instantiate(config: ReportFormConfiguration): ReportFormModule {
        let module = new ReportFormModule();
        module._root = module;
        module._config = config;
        return module;
    }

    private _root: ReportFormModule = null;
    private _config: ReportFormConfiguration = null;

    private _modules: { [key: string]: ReportFormModule } = {};
    private getModuleInternal<TModule extends ReportFormModule>(key: string, factory: { new(): TModule }): TModule {
        if (!(key in this._root._modules)) {
            let module = new factory();
            module._root = this._root;
            module._config = this._config;
            module.initialize();
            this._root._modules[key] = module;
        }
        return this._root._modules[key] as TModule;
    }

    public getModule<TModule extends ReportFormModule>(factory: { moduleName: string; new(): TModule }): TModule {
        if (factory.moduleName in this._root._modules) {
            return this._root.module[factory.moduleName] as TModule;
        }
        const module = new factory();
        module._root = this._root;
        module._config = this._config;
        module.initialize();
        this._root._modules[factory.moduleName] = module;
        return module;
    }

    protected initialize(): void { }

    protected get module(): ReportFormModule { return this._root; }

    public get config(): ReportFormConfiguration { return this._config; }

    public get line(): LINEModule { return this.getModuleInternal('line', LINEModule); }
    public get postCommand(): PostCommandModule { return this.getModuleInternal('postCommand', PostCommandModule); }
    public get router(): Router { return this.getModuleInternal('router', Router); }
    public get report(): ReportModule { return this.getModuleInternal(ReportModule.moduleName, ReportModule); }
    public get twitter(): TwitterModule { return this.getModuleInternal('twitter', TwitterModule); }
    public get musicData(): MusicDataModule { return this.getModuleInternal(MusicDataModule.moduleName, MusicDataModule); }
    public get approval(): ApprovalModule { return this.getModuleInternal('approval', ApprovalModule); }
    public get version(): VersionModule { return this.getModuleInternal(VersionModule.moduleName, VersionModule); }
    public get webhook(): WebhookModule { return this.getModuleInternal('webhook', WebhookModule); }
}