import { ReportFormModule } from "../Modules/@ReportFormModule";

export interface PostCommandParameter {
    versionName?: string;
    API: string;
}

export abstract class PostCommand {
    private _module: ReportFormModule;
    protected get module(): ReportFormModule {
        return this._module;
    }

    public constructor(module: ReportFormModule) {
        this._module = module;
    }

    public abstract called(api: string): boolean;
    public abstract invoke(api: string, postData: PostCommandParameter): any;
}