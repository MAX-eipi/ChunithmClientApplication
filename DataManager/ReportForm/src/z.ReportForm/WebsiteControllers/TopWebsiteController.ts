import { ReportFormWebsiteController, ReportFormWebsiteParameter } from "./@ReportFormController";
import { RoutingNode } from "../../Router/RoutingNode";
import { DIProperty } from "../../DIProperty/DIProperty";
import { VersionModule } from "../Modules/VersionModule";
import { getAppVersion } from "../../@app";
import { Role } from "../Role";
import { ReportFormConfiguration } from "../Configurations/@ReportFormConfiguration";
import { ReportFormModule } from "../Modules/@ReportFormModule";
import { Router } from "../../Router/Router";
import { InProgressListWebsiteController } from "./InProgressListWebsiteController";
import { RoutingController } from "../../Router/RoutingController";

export interface TopWebsiteParameter extends ReportFormWebsiteParameter {
}

export class TopWebsiteController extends ReportFormWebsiteController<TopWebsiteParameter> {
    @DIProperty.inject(ReportFormConfiguration)
    private readonly configuration: ReportFormConfiguration;

    @DIProperty.inject(ReportFormModule)
    private readonly module: ReportFormModule;

    @DIProperty.inject(Router)
    private readonly router: Router;

    private get versionModule() { return this.module.getModule(VersionModule); }

    call(parameter: Readonly<TopWebsiteParameter>, node: RoutingNode): GoogleAppsScript.HTML.HtmlOutput {
        const versionText = this.versionModule.getVersionConfig(parameter.version).displayVersionName;

        let source = this.readHtml("Resources/Page/top/main");

        source = source.replace(/%version%/s, getAppVersion());
        source = source.replace(/%versionText%/g, versionText);

        source = this.replaceWipContainer(source, this.configuration.role);

        source = this.replacePageLink(source, parameter, InProgressListWebsiteController);

        return this.createHtmlOutput(source);
    }

    private replacePageLink(source: string, parameter: ReportFormWebsiteParameter, targetController: { prototype: RoutingController; name: string }) {
        const node = this.router.findNodeByName(targetController.name);
        const path = node.getFullPath(parameter);
        const url = this.configuration.rootUrl + path;
        const linkTarget = new RegExp(`%link:${targetController.name}%`, 'g');
        return source ? source.replace(linkTarget, url) : "";
    }

    private replaceWipContainer(source: string, role: Role): string {
        if (role === Role.Operator) {
            const container = this.readHtml("Resources/Page/top/wip_list_container");
            source = source.replace(/%wip_list_container%/g, container);
        }
        else {
            source = source.replace(/%wip_list_container%/g, "");
        }
        return source;
    }
}
