import { Role } from "../Role";
import { InProgressListPage } from "./InProgressListPage";
import { ReportGroupListPage } from "./ReportGroupListPage";
import { UnverifiedListByGenrePage } from "./UnverifiedListByGenrePage";
import { UnverifiedListByLevelPage } from "./UnverifiedListByLevelPage";
import { ReportFormPageParameter, ReportFormPage } from "./@ReportFormPage";
import { getAppVersion } from "../../@app";

interface TopPageParameter extends ReportFormPageParameter { }

export class TopPage extends ReportFormPage {
    public static readonly PAGE_NAME: string = "top";

    public getPageName(): string {
        return TopPage.PAGE_NAME;
    }

    public call(parameter: TopPageParameter): GoogleAppsScript.HTML.HtmlOutput {
        let versionText = this.module.version.getVersionConfig(parameter.versionName).displayVersionName;

        var source = this.readMainHtml();

        source = source.replace(/%version%/g, getAppVersion());
        source = source.replace(/%versionText%/g, versionText);

        source = this.replaceWipContainer(source, this.module.config.common.role);

        source = this.bind(InProgressListPage, parameter, source);
        source = this.bind(ReportGroupListPage, parameter, source);
        source = this.bind(UnverifiedListByGenrePage, parameter, source);
        source = this.bind(UnverifiedListByLevelPage, parameter, source);

        return this.createHtmlOutput(source);
    }

    private replaceWipContainer(source: string, role: Role): string {
        if (role == Role.Operator) {
            let container = this.readCurrentPageHtml("wip_list_container");
            source = source.replace(/%wip_list_container%/g, container);
        }
        else {
            source = source.replace(/%wip_list_container%/g, "");
        }
        return source;
    }
}