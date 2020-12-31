import { notifyUnverified, noticeCreatedUnitReports, noticeApprovedUnitReports, noticeRejectedUnitReports, noticeCreatedLevelReports, noticeApprovedLevelReports, noticeRejectedLevelReports } from "./operations";

function onNotifyUnverified() {
    const now = new Date();
    const hours = now.getHours();
    if (hours === 9 || hours === 17) {
        notifyUnverified();
    }
}

function onNoticeCreatedUnitReports() {
    noticeCreatedUnitReports();
}

function onNoticeApprovedUnitReports() {
    noticeApprovedUnitReports();
}

function onNoticeRejectedUnitReports() {
    noticeRejectedUnitReports();
}

function onNoticeCreatedLevelReports() {
    noticeCreatedLevelReports();
}

function onNoticeApprovedLevelReports() {
    noticeApprovedLevelReports();
}

function onNoticeRejectedLevelReports() {
    noticeRejectedLevelReports();
}
