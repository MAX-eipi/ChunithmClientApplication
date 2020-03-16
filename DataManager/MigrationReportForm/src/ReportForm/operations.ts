import { ConfigurationScriptProperty, ConfigurationSpreadsheet } from "../Configurations/ConfigurationDefinition";
import { ConfigurationEditor } from "./Configurations/ConfigurationEditor";
import { Debug } from "./Debug";
import { InProgressListPage } from "./Page/InProgressListPage";
import { ReportStatus } from "./Report/Report";
import { Instance } from "./Instance";

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