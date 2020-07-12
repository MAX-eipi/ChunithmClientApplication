import { ConfigurationScriptProperty, ConfigurationSpreadsheet } from "../Configurations/ConfigurationDefinition";
import { ConfigurationEditor } from "./Configurations/ConfigurationEditor";
import { Debug } from "./Debug";
import { InProgressListPage } from "./Page/InProgressListPage";
import { ReportStatus } from "./Report/ReportStatus";
import { Instance } from "./Instance";
import { CommonConfiguration } from "./Configurations/CommonConfiguration";
import { ReportModule } from "./Modules/Report/ReportModule";
import { MusicDataModule } from "./Modules/MusicDataModule";
import { VersionModule } from "./Modules/VersionModule";
import { BulkReportTableReader } from "./Report/BulkReport/BulkReportTableReader";
import { BulkReportTableWriter } from "./Report/BulkReport/BulkReportTableWriter";

export function storeConfig(): GoogleAppsScript.Properties.Properties {
    let properties = PropertiesService.getScriptProperties().getProperties();
    let ret = ConfigurationEditor.store(
        properties[ConfigurationScriptProperty.CONFIG_SHEET_ID],
        ConfigurationSpreadsheet.GLOBAL_CONFIG_SHEET_NAME,
        ConfigurationSpreadsheet.VERSION_LIST_SHEET_NAME);
    let json = JSON.stringify(ret.getProperties());
    Debug.log(json);
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

        let versionName = Instance.instance.module.config.common.defaultVersionName;
        let reports = Instance.instance.module.report.getReports(versionName);
        var unverifiedCount = 0;
        for (var i = 0; i < reports.length; i++) {
            if (reports[i].reportStatus == ReportStatus.InProgress) {
                unverifiedCount++;
            }
        }

        if (unverifiedCount > 0) {
            let unverifiedListUrl = Instance.instance.module.router.getPage(InProgressListPage).getPageUrl(versionName);
            let message = `未承認の報告が${unverifiedCount}件あります
[報告リストURL]
${unverifiedListUrl}`;
            Instance.instance.module.line.notice.pushTextMessage([message]);
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