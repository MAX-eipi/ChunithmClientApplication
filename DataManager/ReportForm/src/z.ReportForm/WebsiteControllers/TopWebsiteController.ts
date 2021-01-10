import { getAppVersion } from "../../@app";
import { RoutingNode } from "../../Router/RoutingNode";
import { VersionModule } from "../Modules/VersionModule";
import { Role } from "../Role";
import { ReportFormWebsiteController, ReportFormWebsiteParameter } from "./@ReportFormController";
import { LevelReportListWebsiteController } from "./LevelReport/LevelReportListWebsiteController";
import { UnitReportGroupListWebsiteController } from "./UnitReportGroup/UnitReportGroupListWebsiteController";
import { UnitReportListWebsiteController } from "./UnitReport/UnitReportListWebsiteController";
import { UnverifiedListByLevelWebsiteController } from "./UnverifiedList/UnverifiedListByLevelWebsiteController";
import { UnverifiedListByGenreWebsiteController } from "./UnverifiedList/UnverifiedListByGenreWebsiteController";

export interface TopWebsiteParameter extends ReportFormWebsiteParameter {
}

export class TopWebsiteController extends ReportFormWebsiteController<TopWebsiteParameter> {

    private get versionModule() { return this.getModule(VersionModule); }

    protected callInternal(parameter: Readonly<TopWebsiteParameter>, node: RoutingNode): GoogleAppsScript.HTML.HtmlOutput {
        const versionText = this.versionModule.getVersionConfig(parameter.version).displayVersionName;

        let source = this.readHtml("Resources/Page/top/main");

        source = source.replace(/%version%/s, getAppVersion());
        source = source.replace(/%versionText%/g, versionText);

        source = this.replaceWipContainer(source, this.configuration.role);

        source = this.replacePageLink(source, parameter, UnitReportListWebsiteController);
        source = this.replacePageLink(source, parameter, UnitReportGroupListWebsiteController);
        source = this.replacePageLink(source, parameter, LevelReportListWebsiteController);
        source = this.replacePageLink(source, parameter, UnverifiedListByGenreWebsiteController);
        source = this.replacePageLink(source, parameter, UnverifiedListByLevelWebsiteController);

        return this.createHtmlOutput(source);
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
