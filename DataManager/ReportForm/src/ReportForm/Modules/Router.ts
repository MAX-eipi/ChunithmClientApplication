import { Debug } from "../Debug";
import { ReportFormPage } from "../Page/@ReportFormPage";
import { ReportFormModule } from "./@ReportFormModule";

interface PageFactory {
    PAGE_NAME: string;
    new(module: ReportFormModule): ReportFormPage;
}

export class Router extends ReportFormModule {
    private pages: { [key: string]: ReportFormPage } = {};

    public getPage<TPage extends ReportFormPage>(page: { new(module: ReportFormModule): TPage, PAGE_NAME: string }): TPage {
        if (!this.pages[page.PAGE_NAME]) {
            this.pages[page.PAGE_NAME] = new page(this.module);
        }
        return this.pages[page.PAGE_NAME] as TPage;
    }

    public getRootUrl(): string {
        return this.config.common.rootUrl;
    }

    public bindRoot(source: string): string {
        return source ? source.replace(/%link:root%/g, this.getRootUrl()) : "";
    }

    private _errorPageFactory: PageFactory = null;
    private _pageFactories: PageFactory[] = [];
    public setPageFactories(errorPageFactory: PageFactory, pageFactories: PageFactory[]): void {
        this._errorPageFactory = errorPageFactory;
        this._pageFactories = pageFactories;
    }

    public call(page: string, parameter: any): GoogleAppsScript.HTML.HtmlOutput {
        if (!page) {
            return this.callErrorPage("ページが指定されていません");
        }

        if (this.pages[page]) {
            return this.pages[page].call(parameter);
        }

        let factory = this.getPageFactory(page);
        if (!factory) {
            Debug.logError(`存在しないページにアクセスされました\n指定ページ:${page}`);
            return this.callErrorPage("存在しないページが指定されました");
        }

        this.pages[page] = new factory(this.module);
        if (!this.pages[page].isAccessable(this.config.common.role)) {
            Debug.logError(`権限のないページにアクセスされました\n指定ページ:${page}`);
            return this.callErrorPage("存在しないページが指定されました");
        }

        return this.pages[page].call(parameter);
    }

    private getPageFactory(pageName: string): PageFactory {
        for (var i = 0; i < this._pageFactories.length; i++) {
            if (this._pageFactories[i].PAGE_NAME == pageName) {
                return this._pageFactories[i];
            }
        }
        return null;
    }

    public callErrorPage(message: string, versionName?: string): GoogleAppsScript.HTML.HtmlOutput {
        if (!this._errorPageFactory) {
            return null;
        }

        let parameter: any = { message: message, versionName: versionName };
        if (!this.pages[this._errorPageFactory.PAGE_NAME]) {
            this.pages[this._errorPageFactory.PAGE_NAME] = new this._errorPageFactory(this.module);
        }
        return this.pages[this._errorPageFactory.PAGE_NAME].call(parameter);
    }
}