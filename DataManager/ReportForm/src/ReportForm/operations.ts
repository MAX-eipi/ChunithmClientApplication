import { CommonConfiguration } from "./Configurations/CommonConfiguration";
import { ConfigurationEditor } from "./Configurations/ConfigurationEditor";
import { Debug } from "./Debug";
import { Instance } from "./Instance";
import { MusicDataModule } from "./Modules/MusicDataModule";
import { ReportModule } from "./Modules/Report/ReportModule";
import { VersionModule } from "./Modules/VersionModule";
import { InProgressListPage } from "./Page/InProgressListPage";
import { BulkReportTableReader } from "./Report/BulkReport/BulkReportTableReader";
import { BulkReportTableWriter } from "./Report/BulkReport/BulkReportTableWriter";
import { ReportStatus } from "./Report/ReportStatus";
import { Report } from "./Report/Report";
import { Block } from "../Slack/API/Blocks";
import { UrlFetchManager } from "../UrlFetch/UrlFetchManager";
import { SlackChatPostMessageStream } from "../Slack/API/Chat/PostMessage/Stream";
import { SlackBlockFactory } from "../Slack/BlockFactory";
import { SlackBlockElementFactory } from "../Slack/BlockElementFactory";
import { SlackCompositionObjectFactory } from "../Slack/CompositionObjectFactory";
import { LevelBulkReportListPage } from "./Page/LevelBulkReportListPage";

export function storeConfig(): GoogleAppsScript.Properties.Properties {
    const ret = ConfigurationEditor.store();
    Debug.log(ret.getProperties());
    return ret;
}

function setupForm() {
    try {
        Instance.initialize();

        let versionName = Instance.instance.module.config.common.defaultVersionName;
        Instance.instance.module.report.buildForm(versionName);
    }
    catch (e) {
        Instance.exception(e);
    }
}

function setupBulkReportForm() {
    try {
        Instance.initialize();

        let versionName = Instance.instance.module.config.common.defaultVersionName;
        Instance.instance.module.report.buildBulkReportForm(versionName);
    }
    catch (e) {
        Instance.exception(e);
    }
}

function authorizeTwitter() {
    try {
        Instance.instance.module.twitter.connector.authorize();
    }
    catch (e) {
        Instance.exception(e);
    }
}

function authCallback(request): any {
    try {
        return Instance.instance.module.twitter.connector.authCallback(request);
    }
    catch (e) {
        Instance.exception(e);
    }
}

function getGenres(): string[] {
    try {
        Instance.initialize();

        let versionName = Instance.instance.module.config.common.defaultVersionName;
        let genres: string[] = [];
        let musicDatas = Instance.instance.module.musicData.getTable(versionName).datas;
        for (var i = 0; i < musicDatas.length; i++) {
            let genre = musicDatas[i].Genre;
            if (genres.indexOf(genre) == -1) {
                genres.push(genre);
            }
        }
        Debug.log(JSON.stringify({
            versionName: versionName,
            genres: genres,
        }));
        return genres;
    }
    catch (e) {
        Instance.exception(e);
    }
}

export function notifyUnverified() {
    try {
        Instance.initialize();

        const versionName = Instance.instance.module.config.common.defaultVersionName;
        const reports = Instance.instance.module.getModule(ReportModule).getReports(versionName);
        let wipReportCount = 0;
        for (let i = 0; i < reports.length; i++) {
            if (reports[i].reportStatus === ReportStatus.InProgress) {
                wipReportCount++;
            }
        }

//        if (wipReportCount > 0) {
//            const wipListUrl = Instance.instance.module.router.getPage(InProgressListPage).getPageUrl(versionName);
//            const message = `未承認の報告が${wipReportCount}件あります
//[報告リストURL]
//${wipListUrl}`;
//            Instance.instance.module.line.notice.pushTextMessage([message]);
//        }

        const bulkReports = Instance.instance.module.getModule(ReportModule).getLevelBulkReports(versionName);
        let wipBulkReportCount = 0;
        for (const bulkReport of bulkReports) {
            if (bulkReport.reportStatus === ReportStatus.InProgress) {
                wipBulkReportCount++;
            }
        }

        if (wipReportCount > 0 || wipBulkReportCount > 0) {
            const blocks: Block[] = [];
            blocks.push(SlackBlockFactory.section(
                SlackCompositionObjectFactory.markdownText('*[定期]未検証 件数報告*')
            ));
            if (wipReportCount > 0) {
                const wipReportsUrl = Instance.instance.module.router.getPage(InProgressListPage).getPageUrl(versionName);
                blocks.push(SlackBlockFactory.section(
                    SlackCompositionObjectFactory.markdownText(`:page_with_curl:未承認の単曲検証報告が${wipReportCount}件あります
<${wipReportsUrl}|検証報告一覧(単曲)ページへ>`)
                ));
                blocks.push(SlackBlockFactory.divider());
            }
            if (wipBulkReportCount > 0) {
                const wipBulkReporturl = Instance.instance.module.router.getPage(LevelBulkReportListPage).getPageUrl(versionName);
                blocks.push(SlackBlockFactory.section(
                    SlackCompositionObjectFactory.markdownText(`:page_with_curl:未承認のレベル別検証報告が${wipBulkReportCount}件あります
<${wipBulkReporturl}|検証報告一覧(レベル別)ページへ>`)
                ))
                blocks.push(SlackBlockFactory.divider());
            }
            UrlFetchManager.execute([new SlackChatPostMessageStream({
                token: Instance.instance.module.config.global.slackApiToken,
                channel: Instance.instance.module.config.global.slackChannelIdTable['noticeWipReportCount'],
                text: '[定期]未承認 件数報告',
                blocks: blocks,
            })]);
        }
    }
    catch (e) {
        Instance.exception(e);
    }
}

function importBulkReportSheet() {
    try {
        Instance.initialize();
        Debug.log("開始: importBulkReportSheet");
        const versionName = Instance.instance.module.config.getConfig(CommonConfiguration).defaultVersionName;
        Instance.instance.module.getModule(ReportModule).importBulkReport(versionName);
        Debug.log("完了: importBulkReportSheet");
    }
    catch (e) {
        Instance.exception(e);
    }
}

function updateCurrentVersionBulkReportTable() {
    try {
        Instance.initialize();

        Debug.log("開始: updateCurrentVersionBulkReportSheet");

        const config = Instance.instance.module.config.getConfig(CommonConfiguration);
        const versionName = config.defaultVersionName;
        const prevVersionName = config.getPreviousVersionName(versionName);

        const spreadsheetId = Instance.instance.module.getModule(VersionModule)
            .getVersionConfig(versionName)
            .bulkReportSpreadsheetId;
        const reader = new BulkReportTableReader();
        const container = reader.read(spreadsheetId, 'Header', 'BASIC', 'ADVANCED', 'EXPERT', 'MASTER');
        container.update(
            Instance.instance.module.getModule(MusicDataModule).getTable(versionName),
            Instance.instance.module.getModule(MusicDataModule).getTable(prevVersionName));
        const writer = new BulkReportTableWriter();
        writer.write(spreadsheetId, container);

        Debug.log("完了: updateCurrentVersionBulkReportSheet");
    }
    catch (e) {
        Instance.exception(e);
    }
}

function updateNextVersionBulkReportTable() {
    try {
        Instance.initialize();

        Debug.log("開始: updateNextVersionBulkReportTable");

        const config = Instance.instance.module.config.getConfig(CommonConfiguration);
        const versionName = config.defaultVersionName;

        const spreadsheetId = Instance.instance.module.getModule(VersionModule)
            .getVersionConfig(versionName)
            .nextVersionBulkReportSpreadsheetId;
        const reader = new BulkReportTableReader();
        const container = reader.read(spreadsheetId, 'Header', 'BASIC', 'ADVANCED', 'EXPERT', 'MASTER');
        const table = Instance.instance.module.getModule(MusicDataModule).getTable(versionName);
        container.update(table, table);
        const writer = new BulkReportTableWriter();
        writer.write(spreadsheetId, container);

        Debug.log("完了: updateNextVersionBulkReportTable");
    }
    catch (e) {
        Instance.exception(e);
    }
}
