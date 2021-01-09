import { LogLevel } from "./CustomLogger/CustomLogger";
import { CustomLogManager } from "./CustomLogger/CustomLogManager";
import { ConfigurationEditor } from "./ReportForm/Configurations/ConfigurationEditor";
import { Instance } from "./ReportForm/Instance";
import { MusicDataModule } from "./ReportForm/Modules/MusicDataModule";
import { NoticeModule } from "./ReportForm/Modules/Notice/NoticeModule";
import { ReportModule } from "./ReportForm/Modules/Report/ReportModule";
import { RoutingModule } from "./ReportForm/Modules/Router";
import { TwitterModule } from "./ReportForm/Modules/TwitterModule";
import { VersionModule } from "./ReportForm/Modules/VersionModule";
import { InProgressListPage } from "./ReportForm/Page/InProgressListPage";
import { LevelBulkReportListPage } from "./ReportForm/Page/LevelBulkReportListPage";
import { BulkReportTableReader } from "./ReportForm/Report/BulkReport/BulkReportTableReader";
import { BulkReportTableWriter } from "./ReportForm/Report/BulkReport/BulkReportTableWriter";
import { ReportStatus } from "./ReportForm/Report/ReportStatus";
import { Block } from "./UrlFetch.Slack/API/Blocks";
import { SlackChatPostMessageStream } from "./UrlFetch.Slack/API/Chat/PostMessage/Stream";
import { SlackBlockFactory } from "./UrlFetch.Slack/BlockFactory";
import { SlackCompositionObjectFactory } from "./UrlFetch.Slack/CompositionObjectFactory";
import { UrlFetchManager } from "./UrlFetch/UrlFetchManager";

export function storeConfig(): GoogleAppsScript.Properties.Properties {
    const ret = ConfigurationEditor.store();
    CustomLogManager.log(LogLevel.Info, ret.getProperties());
    return ret;
}

export function execute<T>(action: (instance: Instance) => T) {
    try {
        Instance.initialize();
        return action(Instance.instance);
    }
    catch (e) {
        Instance.exception(e);
    }
}

function getDefaultVersionName(instance: Instance): string {
    return instance.module.configuration.defaultVersionName;
}

function setupForm() {
    execute(instance => {
        const versionName = getDefaultVersionName(instance);
        instance.module.getModule(ReportModule).buildForm(versionName);
    });
}

function setupBulkReportForm() {
    execute(instance => {
        const versionName = getDefaultVersionName(instance);
        instance.module.getModule(ReportModule).buildBulkReportForm(versionName);
    });
}

function authorizeTwitter() {
    execute(instance => instance.module.getModule(TwitterModule).connector.authorize());
}

function authCallback(request) {
    execute(instance => instance.module.getModule(TwitterModule).connector.authCallback(request));
}

function getGenres(): string[] {
    return execute(instance => {
        const versionName = getDefaultVersionName(instance);
        const genres: string[] = [];
        const musicDatas = Instance.instance.module.getModule(MusicDataModule).getTable(versionName).datas;
        for (const md of musicDatas) {
            const genre = md.Genre;
            if (genres.indexOf(genre) === -1) {
                genres.push(genre);
            }
        }

        CustomLogManager.log(
            LogLevel.Info,
            {
                versionName: versionName,
                genres: genres,
            });

        return genres;
    });
}

export function noticeCreatedUnitReports() {
    execute(instance => {
        const versionName = getDefaultVersionName(instance);
        const notice = instance.module.getModule(NoticeModule);
        const reportIds = notice.getQueue().dequeueCreateUnitReport(10);
        if (reportIds.length > 0) {
            notice.noticeCreateUnitReport(versionName, reportIds);
        }
    });
}

export function noticeApprovedUnitReports() {
    execute(instance => {
        const versionName = getDefaultVersionName(instance);
        const notice = instance.module.getModule(NoticeModule);
        const reportIds = notice.getQueue().dequeueApproveUnitReport(10);
        if (reportIds.length > 0) {
            notice.noticeApproveUnitReport(versionName, reportIds);
        }
    });
}

export function noticeRejectedUnitReports() {
    execute(instance => {
        const versionName = getDefaultVersionName(instance);
        const notice = instance.module.getModule(NoticeModule);
        const reportIds = notice.getQueue().dequeueRejectUnitReport(10);
        if (reportIds.length > 0) {
            notice.noticeRejectUnitReport(versionName, reportIds);
        }
    });
}

export function noticeCreatedLevelReports() {
    execute(instance => {
        const versionName = getDefaultVersionName(instance);
        const notice = instance.module.getModule(NoticeModule);
        const reportIds = notice.getQueue().dequeueCreateLevelReport(10);
        if (reportIds.length > 0) {
            notice.noticeCreateLevelReport(versionName, reportIds);
        }
    });
}

export function noticeApprovedLevelReports() {
    execute(instance => {
        const versionName = getDefaultVersionName(instance);
        const notice = instance.module.getModule(NoticeModule);
        const reportIds = notice.getQueue().dequeueApproveLevelReport(10);
        if (reportIds.length > 0) {
            notice.noticeApproveLevelReport(versionName, reportIds);
        }
    });
}

export function noticeRejectedLevelReports() {
    execute(instance => {
        const versionName = getDefaultVersionName(instance);
        const notice = instance.module.getModule(NoticeModule);
        const reportIds = notice.getQueue().dequeueRejectLevelReport(10);
        if (reportIds.length > 0) {
            notice.noticeRejectLevelReport(versionName, reportIds);
        }
    })
}

export function notifyUnverified() {
    try {
        Instance.initialize();

        const versionName = Instance.instance.module.configuration.defaultVersionName;
        const reports = Instance.instance.module.getModule(ReportModule).getReports(versionName);
        let wipReportCount = 0;
        for (let i = 0; i < reports.length; i++) {
            if (reports[i].reportStatus === ReportStatus.InProgress) {
                wipReportCount++;
            }
        }

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
                const wipReportsUrl = Instance.instance.module.getModule(RoutingModule).getPage(InProgressListPage).getPageUrl(versionName);
                blocks.push(SlackBlockFactory.section(
                    SlackCompositionObjectFactory.markdownText(`:page_with_curl:未承認の単曲検証報告が${wipReportCount}件あります
<${wipReportsUrl}|検証報告一覧(単曲)ページへ>`)
                ));
                blocks.push(SlackBlockFactory.divider());
            }
            if (wipBulkReportCount > 0) {
                const wipBulkReporturl = Instance.instance.module.getModule(RoutingModule).getPage(LevelBulkReportListPage).getPageUrl(versionName);
                blocks.push(SlackBlockFactory.section(
                    SlackCompositionObjectFactory.markdownText(`:page_with_curl:未承認のレベル別検証報告が${wipBulkReportCount}件あります
<${wipBulkReporturl}|検証報告一覧(レベル別)ページへ>`)
                ))
                blocks.push(SlackBlockFactory.divider());
            }
            UrlFetchManager.execute([new SlackChatPostMessageStream({
                token: Instance.instance.module.configuration.global.slackApiToken,
                channel: Instance.instance.module.configuration.global.slackChannelIdTable['noticeWipReportCount'],
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
        CustomLogManager.log(LogLevel.Info, "開始: importBulkReportSheet");
        const versionName = Instance.instance.module.configuration.defaultVersionName;
        Instance.instance.module.getModule(ReportModule).importBulkReport(versionName);
        CustomLogManager.log(LogLevel.Info, "完了: importBulkReportSheet");
    }
    catch (e) {
        Instance.exception(e);
    }
}

function updateCurrentVersionBulkReportTable() {
    try {
        Instance.initialize();

        CustomLogManager.log(LogLevel.Info, "開始: updateCurrentVersionBulkReportSheet");

        const config = Instance.instance.module.configuration;
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

        CustomLogManager.log(LogLevel.Info, "完了: updateCurrentVersionBulkReportSheet");
    }
    catch (e) {
        Instance.exception(e);
    }
}

function updateNextVersionBulkReportTable() {
    try {
        Instance.initialize();

        CustomLogManager.log(LogLevel.Info, "開始: updateNextVersionBulkReportTable");

        const config = Instance.instance.module.configuration;
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

        CustomLogManager.log(LogLevel.Info, "完了: updateNextVersionBulkReportTable");
    }
    catch (e) {
        Instance.exception(e);
    }
}
