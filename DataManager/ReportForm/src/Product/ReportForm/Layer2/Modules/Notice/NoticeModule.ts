import { CustomCacheProvider } from "../../../../../Packages/CustomCacheProvider/CustomCacheProvider";
import { DIProperty } from "../../../../../Packages/DIProperty/DIProperty";
import { NoticeManager } from "../../../Layer3/Managers/NoticeManager";
import { ReportFormModule } from "../@ReportFormModule";
import { NoticeQueue } from "./NoticeQueue";

export class NoticeModule extends ReportFormModule {
    public static readonly moduleName = 'notice';

    @DIProperty.inject('CacheProvider')
    private readonly _cacheProvider: CustomCacheProvider;

    private _queue: NoticeQueue;
    public getQueue(): NoticeQueue {
        if (!this._queue) {
            this._queue = new NoticeQueue(this._cacheProvider);
        }
        return this._queue;
    }

    private _mgr: NoticeManager = null;
    private get manager(): NoticeManager {
        if (!this._mgr) {
            this._mgr = new NoticeManager();
        }
        return this._mgr;
    }

    public noticeCreateUnitReport(versionName: string, reportIds: number[]): void {
        this.manager.noticeCreateUnitReport(versionName, reportIds);
    }

    public noticeApproveUnitReport(versionName: string, reportIds: number[]): void {
        this.manager.noticeApproveUnitReport(versionName, reportIds);
    }

    public noticeRejectUnitReport(versionName: string, reportIds: number[]): void {
        this.manager.noticeRejectUnitReport(versionName, reportIds);
    }

    public noticeCreateLevelReport(versionName: string, reportIds: number[]): void {
        this.manager.noticeCreateLevelReport(versionName, reportIds);
    }

    public noticeApproveLevelReport(versionName: string, reportIds: number[]): void {
        this.manager.noticeApproveLevelReport(versionName, reportIds);
    }

    public noticeRejectLevelReport(versionName: string, reportIds: number[]): void {
        this.manager.noticeRejectLevelReport(versionName, reportIds);
    }
}
