import { Instance } from "./Instance";

class ApprovalError implements Error {
    public name: string = "ApprovalError";
    public message: string;
    public constructor(message: string) {
        this.message = message;
    }

    toString(): string {
        return `${this.name}:${this.message};`
    }
}

function approve(reportIdText: string, versionName: string): void {
    try {
        Instance.initialize();
        if (!versionName) {
            throw new ApprovalError(`バージョン名未指定.`);
        }
        let reportId = parseInt(reportIdText);
        Instance.instance.module.approval.approve(versionName, reportId);
    }
    catch (error) {
        Instance.exception(error);
    }
}

function reject(reportIdText: string, versionName: string): void {
    try {
        Instance.initialize();
        if (!versionName) {
            throw new ApprovalError(`バージョン名未指定.`);
        }
        let reportId = parseInt(reportIdText);
        Instance.instance.module.approval.reject(versionName, reportId);
    }
    catch (error) {
        Instance.exception(error);
    }
}

function groupApprove(reportGroupId: string, versionName: string): void {
    try {
        Instance.initialize();
        if (!versionName) {
            throw new ApprovalError(`バージョン名未指定.`);
        }
        Instance.instance.module.approval.approveGroup(versionName, reportGroupId);
    }
    catch (error) {
        Instance.exception(error);
    }
}

function bulkApprove(reportIdText: string, versionName: string): void {
    try {
        Instance.initialize();
        if (!versionName) {
            throw new ApprovalError(`バージョン名未指定.`);
        }
        let reportId = parseInt(reportIdText);
        Instance.instance.module.approval.bulkApprove(versionName, reportId);
    }
    catch (error) {
        Instance.exception(error);
    }
}

function bulkReject(reportIdText: string, versionName: string): void {
    try {
        Instance.initialize();
        if (!versionName) {
            throw new ApprovalError(`バージョン名未指定.`);
        }
        let reportId = parseInt(reportIdText);
        Instance.instance.module.approval.bulkReject(versionName, reportId);
    }
    catch (error) {
        Instance.exception(error);
    }
}