import { ReportFormConfiguration } from "../Configurations/@ReportFormConfiguration";
import { LINEModule } from "./LINEModule";
import { MusicDataModule } from "./MusicDataModule";
import { PostCommandModule } from "./PostCommandModule";
import { ReportModule } from "./ReportModule";
import { Router } from "./Router";
import { TwitterModule } from "./TwitterModule";
import { VersionModule } from "./VersionModule";
import { ApprovalModule } from "./ApprovalModule";

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
    private getModule<TModule extends ReportFormModule>(key: string, factory: { new(): TModule }): TModule {
        if (!(key in this._root._modules)) {
            let module = new factory();
            module._root = this._root;
            module._config = this._config;
            module.initialize();
            this._root._modules[key] = module;
        }
        return this._root._modules[key] as TModule;
    }

    protected initialize(): void { }

    protected get module(): ReportFormModule { return this._root; }

    public get config(): ReportFormConfiguration { return this._config; }

    public get line(): LINEModule { return this.getModule('line', LINEModule); }
    public get postCommand(): PostCommandModule { return this.getModule('postCommand', PostCommandModule); }
    public get router(): Router { return this.getModule('router', Router); }
    public get report(): ReportModule { return this.getModule('report', ReportModule); }
    public get twitter(): TwitterModule { return this.getModule('twitter', TwitterModule); }
    public get musicData(): MusicDataModule { return this.getModule('musicData', MusicDataModule); }
    public get approval(): ApprovalModule { return this.getModule('approval', ApprovalModule); }
    public get version(): VersionModule { return this.getModule('version', VersionModule); }
}