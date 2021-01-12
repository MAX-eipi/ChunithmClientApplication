import { LogLevel } from "../../CustomLogger/CustomLogger";
import { CustomLogManager } from "../../CustomLogger/CustomLogManager";
import { DIProperty } from "../../DIProperty/DIProperty";
import { Router } from "../../Router/Router";
import { RoutingControllerWithType } from "../../Router/RoutingController";
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

    protected replacePageLink<TParam extends ReportFormWebsiteParameter>(source: string, parameter: TParam, targetController: { prototype: RoutingControllerWithType<TParam>; name: string }) {
        const url = this.getFullPath(parameter, targetController);
        const linkTarget = new RegExp(`%link:${targetController.name}%`, 'g');
        return source ? source.replace(linkTarget, url) : "";
    }

    protected getFullPath<TParam extends ReportFormWebsiteParameter>(parameter: TParam, targetController: { prototype: RoutingControllerWithType<TParam>; name: string }): string {
        return ReportFormWebsiteController.getFullPath(this.configuration, this.router, targetController, parameter)
    }

    public static getFullPath<TParam extends ReportFormWebsiteParameter>(configuration: ReportFormConfiguration, router: Router, targetController: { prototype: RoutingControllerWithType<TParam>; name: string }, parameter: TParam): string {
        const path = this.getRelativePath(router, targetController, parameter);
        return configuration.rootUrl + path;
    }

    public static getRelativePath<TParam extends ReportFormWebsiteParameter>(router: Router, targetController: { prototype: RoutingControllerWithType<TParam>; name: string }, parameter: TParam): string {
        const node = router.findNodeByName(targetController.name);
        const path = node.getFullPath(parameter);
        return path;
    }

    protected createHtmlOutput(source: string): GoogleAppsScript.HTML.HtmlOutput {
        const htmlOutput = HtmlService.createHtmlOutput(source).setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
        htmlOutput.setTitle('譜面定数 検証報告 管理ツール');
        return htmlOutput;
    }

    public static includeStylesheet(fileName: string): string {
        return HtmlService.createHtmlOutputFromFile(`Resources/Page/${fileName}`).getContent();
    }
}
