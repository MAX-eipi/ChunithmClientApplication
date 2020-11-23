import { Report } from "../../Report/Report";
import { LevelBulkReport } from "../../Report/LevelBulkReport/LevelBulkReport";
import { CacheProvider } from "../../../Cache/CacheProvider";
import { IReport } from "../../Report/IReport";

export class NoticeQueue {
    public constructor(private readonly _cacheProvider: CacheProvider) { }

    public enqueueCreateUnitReport(report: IReport): void {
        this.enqueue<number>('notice_create_unit_reports', report.reportId);
    }
    public dequeueCreateUnitReport(count: number): number[] {
        return this.dequeue<number>('notice_create_unit_reports', count);
    }

    public enqueueApproveUnitReport(report: IReport): void {
        this.enqueue<number>('notice_approve_unit_reports', report.reportId);
    }
    public dequeueApproveUnitReport(count: number): number[] {
        return this.dequeue<number>('notice_approve_unit_reports', count);
    }

    public enqueueRejectUnitReport(report: IReport): void {
        this.enqueue<number>('notice_reject_unit_reports', report.reportId);
    }
    public dequeueRejectUnitReport(count: number): number[] {
        return this.dequeue<number>('notice_reject_unit_reports', count);
    }

    public enqueueCreateLevelReport(report: LevelBulkReport): void {
        this.enqueue<number>('notice_create_level_reports', report.reportId);
    }
    public dequeueCreateLevelReprot(count: number): number[] {
        return this.dequeue<number>('notice_create_level_reports', count);
    }

    public enqueueApproveLevelReport(report: LevelBulkReport): void {
        this.enqueue<number>('notice_approve_level_reports', report.reportId);
    }
    public dequeueApproveLevelReport(count: number): number[] {
        return this.dequeue<number>('notice_approve_level_reports', count);
    }

    public enqueueRejectLevelReport(report: LevelBulkReport): void {
        this.enqueue<number>('notice_reject_level_reports', report.reportId);
    }
    public dequeueRejectLevelReport(count: number): number[] {
        return this.dequeue<number>('notice_reject_level_reports', count);
    }

    private enqueue<T>(key: string, value: T): void {
        const collection = this._cacheProvider.get<T[]>(key);
        collection.push(value);
        this._cacheProvider.put(key, collection);
    }

    private dequeue<T>(key: string, count: number): T[] {
        let collection = this._cacheProvider.get<T[]>(key);
        const ret = collection.slice(0, count);
        collection = collection.slice(count);
        this._cacheProvider.put(key, collection);
        return ret;
    }

    public save(): void {
        this._cacheProvider.syncServer();
    }
}
