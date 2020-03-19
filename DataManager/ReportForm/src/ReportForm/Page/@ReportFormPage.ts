import { Role } from "../Role";
import { ReportFormModule } from "../Modules/@ReportFormModule";

export interface ReportFormPageParameter {
    versionName?: string;
}

interface ReportFormPageFactory<TPage extends ReportFormPage> {
    new(module: ReportFormModule): TPage;
    PAGE_NAME: string;
}

export abstract class ReportFormPage {
    private _module: ReportFormModule;
    protected get module(): ReportFormModule {
        return this._module;
    }

    public constructor(module: ReportFormModule) {
        this._module = module;
    }

    public abstract get pageName(): string;
    public getPageName(): string { return this.pageName; }

    public isAccessable(role: Role): boolean {
        return true;
    }

    public abstract call(parameter: ReportFormPageParameter): GoogleAppsScript.HTML.HtmlOutput;

    protected getPage<TPage extends ReportFormPage>(page: ReportFormPageFactory<TPage>): TPage {
        return this.module.router.getPage(page);
    }

    public getPageUrl(versionName?: string): string {
        if (!versionName) {
            versionName = "";
        }
        return `${this.module.router.getRootUrl()}?versionName=${versionName}&page=${this.pageName}`;
    }

    protected bind<TPage extends ReportFormPage>(targetPage: ReportFormPageFactory<TPage>, parameter: ReportFormPageParameter, source: string): string {
        let pageEntity = this.getPage(targetPage);
        let url = pageEntity.getPageUrl(parameter.versionName);
        let linkTarget = new RegExp(`%link:${pageEntity.pageName}%`, 'g');
        return source ? source.replace(linkTarget, url) : "";
    }

    protected readMainHtml(): string {
        return this.readCurrentPageHtml("main");
    }

    protected readCurrentPageHtml(fileName: string): string {
        return this.readHtml(this.pageName, fileName);
    }

    protected readHtml(pageName: string, fileName: string): string {
        let source = HtmlService
            .createTemplateFromFile(`Resources/Page/${pageName}/${fileName}`)
            .evaluate()
            .getContent();
        return source;
    }

    protected createHtmlOutput(source: string): GoogleAppsScript.HTML.HtmlOutput {
        let htmlOutput = HtmlService.createHtmlOutput(source).setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
        htmlOutput.setTitle('譜面定数 検証報告 管理ツール');
        return htmlOutput;
    }

    protected resolveVersionName(source: string, versionName: string): string {
        return source ? source.replace(/%versionName%/g, versionName) : "";
    }

    public static includeStylesheet(fileName: string): string {
        return HtmlService.createHtmlOutputFromFile(`Resources/Page/${fileName}`).getContent();
    }
}