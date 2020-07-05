import { Role } from "../Role";
import { InProgressListPage } from "./InProgressListPage";
import { ReportGroupListPage } from "./ReportGroupListPage";
import { UnverifiedListByGenrePage } from "./UnverifiedListByGenrePage";
import { UnverifiedListByLevelPage } from "./UnverifiedListByLevelPage";
import { ReportFormPageParameter, ReportFormPage } from "./@ReportFormPage";
import { getAppVersion } from "../../@app";
import { LevelBulkApprovalPage } from "./LevelBulkApprovalPage";
import { LevelBulkReportListPage } from "./LevelBulkReportListPage";

interface TopPageParameter extends ReportFormPageParameter { }

export class TopPage extends ReportFormPage {
    public static readonly PAGE_NAME: string = "top";

    public get pageName(): string {
        return TopPage.PAGE_NAME;
    }

    public call(parameter: TopPageParameter): GoogleAppsScript.HTML.HtmlOutput {
        let versionText = this.module.version.getVersionConfig(parameter.versionName).displayVersionName;

        var source = this.readMainHtml();

        source = source.replace(/%version%/g, getAppVersion());
        source = source.replace(/%versionText%/g, versionText);

        source = this.replaceWipContainer(source, this.module.config.common.role);

        source = this.binds(
            source,
            parameter,
            [
                InProgressListPage,
                ReportGroupListPage,
                LevelBulkApprovalPage,
                LevelBulkReportListPage,
                UnverifiedListByGenrePage,
                UnverifiedListByLevelPage,
            ]);


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