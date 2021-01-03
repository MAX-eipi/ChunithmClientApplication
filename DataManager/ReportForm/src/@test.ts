import { execute } from "./@operations";
import { Instance } from "./ReportForm/Instance";
import { NoticeModule } from "./ReportForm/Modules/Notice/NoticeModule";
import { LINEMessagePushStream } from "./UrlFetch.LINE/API/Message/Push/Stream";
import { TextMessage } from "./UrlFetch.LINE/API/MessageObjects";
import { UrlFetchManager } from "./UrlFetch/UrlFetchManager";

// implements test core here
function lineMessagePushStreamTest() {
    Instance.initialize();
    const text: TextMessage = {
        type: 'text',
        text: 'push test',
    };
    const stream = new LINEMessagePushStream({
        channelAccessToken: Instance.instance.module.configuration.line.channelAccessToken,
        to: 'Cf49e3dcf00a5c3dea9b4a3f697cf0968',
        messages: [text]
    });
    UrlFetchManager.execute([stream]);
    console.log(stream.response);
}

function noticeCreateUnitReportsToSlackTest() {
    Instance.initialize();
    const versionName = Instance.instance.module.configuration.common.latestVersionName;
    const reportIds = [1, 2, 3, 11, 12, 13];
    Instance.instance.module.getModule(NoticeModule)
        .noticeCreateUnitReport(versionName, reportIds);
}

function noticeApproveUnitReportsTest() {
    Instance.initialize();
    const versionName = Instance.instance.module.configuration.common.latestVersionName;
    const reportIds = [1, 2, 3, 11, 12, 13];
    Instance.instance.module.getModule(NoticeModule)
        .noticeApproveUnitReport(versionName, reportIds);
}

function noticeRejectUnitReportsTest() {
    execute(instance => {
        const versionName = instance.module.configuration.common.latestVersionName;
        const reportIds = [1, 2, 3, 11, 12, 13];
        instance.module.getModule(NoticeModule).noticeRejectUnitReport(versionName, reportIds);
    });
}

function noticeCreateLevelReportToSlackTest() {
    Instance.initialize();
    const versionName = Instance.instance.module.configuration.common.latestVersionName;
    const reportIds = [1, 2, 10];
    Instance.instance.module.getModule(NoticeModule)
        .noticeCreateLevelReport(versionName, reportIds);
}

function noticeApproveLevelReportsTest() {
    Instance.initialize();
    const versionName = Instance.instance.module.configuration.common.latestVersionName;
    const reportIds = [1, 2, 10];
    Instance.instance.module.getModule(NoticeModule)
        .noticeApproveLevelReport(versionName, reportIds);
}

function noticeRejectLevelReportsTest() {
    Instance.initialize();
    const versionName = Instance.instance.module.configuration.common.latestVersionName;
    const reportIds = [1, 2, 10];
    Instance.instance.module.getModule(NoticeModule)
        .noticeRejectLevelReport(versionName, reportIds);
}

function dumpNoticeQueue() {
    Instance.initialize();
    const queue = Instance.instance.module.getModule(NoticeModule).getQueue();
    queue.dump();
}
