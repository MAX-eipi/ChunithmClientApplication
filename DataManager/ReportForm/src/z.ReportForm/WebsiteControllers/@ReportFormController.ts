import { LogLevel } from "../../CustomLogger/CustomLogger";
import { CustomLogManager } from "../../CustomLogger/CustomLogManager";
import { DIProperty } from "../../DIProperty/DIProperty";
import { Router } from "../../Router/Router";
import { RoutingController, RoutingControllerWithType } from "../../Router/RoutingController";
import { RoutingNode } from "../../Router/RoutingNode";
import { ReportFormConfiguration } from "../Configurations/@ReportFormConfiguration";
import { ReportFormModule } from "../Modules/@ReportFormModule";
import { Role } from "../Role";

export interface ReportFormWebsiteParameter extends Record<string, number | string> {
    version: string;
}

export class ReportFormWebsiteController<TParameter extends ReportFormWebsiteParameter> implements RoutingControllerWithType<TParameter> {
    protected readonly doGetParameter: GoogleAppsScript.Events.DoGet;

    @DIProperty.inject(ReportFormConfiguration)
    protected readonly configuration: ReportFormConfiguration;

    @DIProperty.inject(ReportFormModule)
    private readonly module: ReportFormModule;

    @DIProperty.inject(Router)
    private readonly router: Router;

    public constructor(doGetParameter: GoogleAppsScript.Events.DoGet) {
        this.doGetParameter = doGetParameter;
    }

    protected isAccessale(role: Role): boolean {
        return true;
    }

    public call(parameter: Readonly<TParameter>, node: RoutingNode): GoogleAppsScript.HTML.HtmlOutput {
        if (!this.isAccessale(this.configuration.role)) {
            CustomLogManager.log(LogLevel.Error, `権限のないページにアクセスされました\n対象ページ: ${node.getFullPath(parameter)}`);
            throw new Error("存在しないページが指定されました");
        }
        return this.callInternal(parameter, node);
    }

    protected callInternal(parameter: Readonly<TParameter>, node: RoutingNode): GoogleAppsScript.HTML.HtmlOutput {
        throw new Error("Method not implemented.");
    }

    protected getModule<T extends ReportFormModule>(module: { new(): T; moduleName: string }): T {
        return this.module.getModule(module);
    }

    protected readHtml(filePath: string): string {
        return HtmlService
            .createTemplateFromFile(filePath)
            .evaluate()
            .getContent();
    }

    protected replacePageLink(source: string, parameter: ReportFormWebsiteParameter, targetController: { prototype: RoutingController; name: string }) {
        const url = this.getFullPath(parameter, targetController);
        const linkTarget = new RegExp(`%link:${targetController.name}%`, 'g');
        return source ? source.replace(linkTarget, url) : "";
    }

    protected getFullPath(parameter: ReportFormWebsiteParameter, targetController: { prototype: RoutingController; name: string }): string {
        const path = this.getRelativePath(parameter, targetController);
        return this.configuration.rootUrl + path;
    }

    protected getRelativePath(parameter: ReportFormWebsiteParameter, targetController: { prototype: RoutingController; name: string }): string {
        const node = this.router.findNodeByName(targetController.name);
        const path = node.getFullPath(parameter);
        return path;
    }

    protected createHtmlOutput(source: string): GoogleAppsScript.HTML.HtmlOutput {
        const htmlOutput = HtmlService.createHtmlOutput(source).setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
        htmlOutput.setTitle('譜面定数 検証報告 管理ツール');
        return htmlOutput;
    }
}
