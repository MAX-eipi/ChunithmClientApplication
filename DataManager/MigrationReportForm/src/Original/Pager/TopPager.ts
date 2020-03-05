import { getAppVersion } from "../../app";
import { Operator } from "../Operators/Operator";
import { InProgressListPager } from "./InProgressListPager";
import { createHtmlOutput, getPageUrl, Pager, readHtml } from "./Pager";
import { ReportGroupListPager } from "./ReportGroupListPager";
import { UnverifiedListByGenrePager } from "./UnverifiedListByGenrePager";
import { UnverifiedListByLevelPager } from "./UnverifiedListByLevelPager";
import { Role } from "../Role";

interface TopPageParameter {
}

export class TopPager implements Pager {
    public static readonly PAGE_NAME = "top";

    public static resolvePageUrl(source: string, rootUrl: string, versionName: string): string {
        return source ? source.replace(/%topPageUrl%/g, getPageUrl(rootUrl, this.PAGE_NAME, versionName)) : "";
    }

    public getPageName(): string {
        return TopPager.PAGE_NAME;
    }

    public isAccessable(role: Role): boolean {
        return true;
    }

    public call(parameter: TopPageParameter): GoogleAppsScript.HTML.HtmlOutput {
        let rootUrl = Operator.getRootUrl();
        let config = Operator.getTargetVersionConfiguration();
        let role = Operator.getRole();
        let versionName = config.getVersionName();
        let versionText = config.getProperty<string>("version_text", "");

        var source = readHtml(this.getPageName());
        source = source.replace(/%version%/g, getAppVersion());
        source = source.replace(/%versionText%/g, versionText);

        source = this.settingInProgressListPageLink(source, role);
        source = this.settingreportGroupListPageLink(source, role);
        source = this.settingUnverifiedListByGenrePageLink(source, role);
        source = this.settingUnverifiedListByLevelPageLink(source, role);

        source = InProgressListPager.resolvePageUrl(source, rootUrl, versionName);
        source = ReportGroupListPager.resolvePageUrl(source, rootUrl, versionName);
        source = UnverifiedListByGenrePager.resolvePageUrl(source, rootUrl, versionName);
        source = UnverifiedListByLevelPager.resolvePageUrl(source, rootUrl, versionName);
        return createHtmlOutput(source);
    }

    private settingInProgressListPageLink(source: string, role: Role): string {
        if (role == Role.Operator) {
            let template = `
<div class="top_menu_list">
    <a href="%inProgressListPageUrl%">承認待ち検証報告リスト</a>
</div>`;
            source = source.replace(/%inProgressListPageLink%/, template);
        } else {
            source = source.replace(/%inProgressListPageLink%/, "");
        }
        return source;
    }

    private settingreportGroupListPageLink(source: string, role: Role): string {
        if (role == Role.Operator) {
            let template = `
<div class="top_menu_list">
    <a href="%reportGroupListPageUrl%">検証報告グループリスト</a>
</div>`;
            source = source.replace(/%reportGroupListPageLink%/, template);
        } else {
            source = source.replace(/%reportGroupListPageLink%/, "");
        }
        return source;
    }

    private settingUnverifiedListByGenrePageLink(source: string, role: Role): string {
        let template = `
<div class="top_menu_list">
    <a href="%unverifiedListByGenrePageUrl%">未検証楽曲リスト(ジャンル別)</a>
</div>`;
        source = source.replace(/%unverifiedListByGenrePageLink%/, template);
        return source;
    }

    private settingUnverifiedListByLevelPageLink(source: string, role: Role): string {
        let template = `
<div class="top_menu_list">
    <a href="%unverifiedListByLevelPageUrl%">未検証楽曲リスト(レベル別)</a>
</div>`;
        source = source.replace(/%unverifiedListByLevelPageLink%/, template);
        return source;
    }
} 