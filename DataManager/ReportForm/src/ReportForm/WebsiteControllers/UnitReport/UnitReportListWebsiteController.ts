import { RoutingNode } from "../../../Router/RoutingNode";
import { ReportModule } from "../../Modules/Report/ReportModule";
import { IReport } from "../../Report/IReport";
import { ReportStatus } from "../../Report/ReportStatus";
import { Role } from "../../Role";
import { Utility } from "../../Utility";
import { ReportFormWebsiteController, ReportFormWebsiteParameter } from "../@ReportFormController";
import { TopWebsiteController } from "../TopWebsiteController";
import { UnitReportWebsiteController, UnitReportWebsiteParameter } from "./UnitReportWebsiteController";

export interface UnitReportListWebsiteParameter extends ReportFormWebsiteParameter {
}

export class UnitReportListWebsiteController extends ReportFormWebsiteController<UnitReportListWebsiteParameter> {

    private get reportModule(): ReportModule { return this.getModule(ReportModule); }

    protected isAccessale(role: Role): boolean {
        return role === Role.Operator;
    }

    protected callInternal(parameter: UnitReportListWebsiteParameter, node: RoutingNode): GoogleAppsScript.HTML.HtmlOutput {
        const listHtml = this.reportModule.getReports(parameter.version)
            .filter(r => r.reportStatus === ReportStatus.InProgress)
            .map(r => this.getListItemHtml(parameter.version, r))
            .reduce((acc, src) => `${acc}\n${src}`, '');

        let source = this.readHtml("Resources/Page/wip_list/main");

        source = this.replacePageLink(source, parameter, TopWebsiteController);

        source = source.replace(/%list%/g, listHtml);

        return this.createHtmlOutput(source);
    }

    private getListItemHtml(version: string, report: IReport): string {
        const parameter: UnitReportWebsiteParameter = {
            version: version,
            reportId: report.reportId.toString(),
        };
        const path = this.getFullPath(parameter, UnitReportWebsiteController);
        return `<div class="music_list bg_${Utility.toDifficultyText(report.difficulty).toLowerCase()}" onclick="window.open('${path}', '_top')">${report.musicName}</div>`;
    }
}
