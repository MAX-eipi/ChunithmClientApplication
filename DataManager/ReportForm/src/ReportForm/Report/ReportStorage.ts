import { Difficulty } from "../../MusicDataTable/Difficulty";
import { MusicData } from "../../MusicDataTable/MusicData";
import { MusicDataTable } from "../../MusicDataTable/MusicDataTable";
import { ComboStatus } from "../Rating";
import { Utility } from "../Utility";
import { ReportStatus } from "./Report";
import { IReport } from "./IReport";
import { ReportInputFormat } from "./ReportInputFormat";
import { IReportContainer } from "./IReportContainer";

export enum PostLocation {
    GoogleForm,
    BulkSheet,
}

enum ColumnIndex {
    ReportId,
    MusicId,
    MusicName,
    Difficulty,
    BeforeOp,
    AfterOp,
    Score,
    ComboStatus,
    ImagePaths,
    PostLocation,
    ReportStatus,
    Length,
}

export class ReportStorage {
    private readonly m_sheet: GoogleAppsScript.Spreadsheet.Sheet;
    private readonly m_musicDataTable: MusicDataTable;
    private readonly m_reports: ReportEntity[] = [];
    private readonly m_reportContainers: ReportContainer[] = [];
    private readonly m_reportContainerIndexMap: { [key: string]: number } = {}

    private readonly m_rawValueTable: any[][] = [];

    public constructor(musicDataTable: MusicDataTable, spreadsheetId: string, worksheetName: string) {
        let spreadsheet = SpreadsheetApp.openById(spreadsheetId);
        if (!spreadsheet) {
            throw new Error(`Spreadsheet not found. (${spreadsheetId})`);
        }

        this.m_sheet = spreadsheet.getSheetByName(worksheetName);
        if (!this.m_sheet) {
            throw new Error(`Worksheet not found. (${worksheetName})`);
        }

        this.m_musicDataTable = musicDataTable;
        this.m_rawValueTable = this.m_sheet.getDataRange().getValues();
        this.build();
    }

    private build(): void {
        for (var i = 1; i < this.m_rawValueTable.length; i++) {
            const report = new ReportEntity(this.m_rawValueTable[i]);
            this.m_reports.push(report);
            this.getOrCreateReportContainer(report.musicId, report.difficulty).push(report);
        }
    }

    public get reports(): IReport[] {
        return this.m_reports;
    }
    public get reportContainers(): IReportContainer[] {
        return this.m_reportContainers;
    }

    public push(reportInput: ReportInputFormat, postLocation: PostLocation, imagePaths: string[] = []): void {
        const musicData = this.m_musicDataTable.getMusicDataById(reportInput.musicId);
        if (!musicData) {
            throw new Error(`楽曲が存在しません.
楽曲ID: ${reportInput.musicId}`);
        }

        const reportContainer = this.getOrCreateReportContainer(reportInput.musicId, reportInput.difficulty);
        if (reportContainer.mainReport && reportContainer.mainReport.reportStatus == ReportStatus.Resolved) {
            throw new Error(`既に検証済みの楽曲. 
楽曲名: ${reportContainer.mainReport.musicName}
難易度: ${reportContainer.mainReport.difficulty}`);
        }

        const reportId = this.m_reports.length > 0 ? this.m_reports[this.m_reports.length - 1].reportId + 1 : 1;
        const buffer = new Array(ColumnIndex.Length);
        const report = new ReportEntity(buffer);
        report.set(reportId, reportInput, musicData.Name, imagePaths, postLocation, ReportStatus.InProgress);
        reportContainer.push(report);
        this.m_rawValueTable.push(buffer);
        this.m_reports.push(report);
    }

    public write(): void {
        let minIndex: number;
        let maxIndex: number;
        for (minIndex = 0; minIndex < this.m_reports.length; minIndex++) {
            if (this.m_reports[minIndex].isDirty) {
                break;
            }
        }
        for (maxIndex = this.m_reports.length - 1; maxIndex >= minIndex; maxIndex--) {
            if (this.m_reports[maxIndex].isDirty) {
                break;
            }
        }

        Logger.log(minIndex + ':' + maxIndex);

        if (minIndex <= maxIndex) {
            var values = [];
            for (var i = minIndex; i <= maxIndex; i++) {
                values.push(this.m_rawValueTable[i + 1]);
            }
            this.m_sheet.getRange(minIndex + 2, 1, maxIndex - minIndex + 1, ColumnIndex.Length).setValues(values);
        }

        for (var i = 0; i < this.m_reports.length; i++) {
            this.m_reports[i].onUpdateStorage();
        }
    }

    private getOrCreateReportContainer(musicId: number, difficulty: Difficulty): ReportContainer {
        return this.getReportContainer(musicId, difficulty) || this.createReportContainer(musicId, difficulty);
    }

    private getReportContainer(musicId: number, difficulty: Difficulty): ReportContainer {
        const key = this.getIndexMapKey(musicId, difficulty);
        if (!(key in this.m_reportContainerIndexMap)) {
            return null;
        }
        return this.m_reportContainers[this.m_reportContainerIndexMap[key]];
    }

    private createReportContainer(musicId: number, difficulty: Difficulty): ReportContainer {
        const key = this.getIndexMapKey(musicId, difficulty);
        const musicData = this.m_musicDataTable.getMusicDataById(musicId);
        const reportContainer = new ReportContainer(musicData, difficulty);
        const length = this.m_reportContainers.push(reportContainer);
        this.m_reportContainerIndexMap[key] = length - 1;
        return reportContainer;
    }

    private getIndexMapKey(musicId: number, difficulty: Difficulty): string {
        return musicId + '#' + difficulty;
    }
}

class ReportContainer implements IReportContainer {
    private readonly m_musicData: MusicData;
    private readonly m_difficulty: Difficulty;
    private readonly m_reports: ReportEntity[] = [];

    public constructor(musicData: MusicData, difficulty: Difficulty) {
        this.m_musicData = musicData;
        this.m_difficulty = difficulty;
    }

    public push(report: ReportEntity): boolean {
        const add = !this.getReportByReportId(report.reportId);
        if (add) {
            this.m_cachedMainReport = null;
            this.m_reports.push(report);
        }
        return add;
    }

    public get musicId(): number { return this.m_musicData.Id; }
    public get difficulty(): Difficulty { return this.m_difficulty; }
    public get reports(): IReport[] { return this.m_reports; }

    private m_cachedMainReport: ReportEntity = null;
    public get mainReport(): IReport {
        if (this.m_musicData.getVerified(this.m_difficulty)) {
            return null;
        }
        if (this.m_cachedMainReport) {
            return this.m_cachedMainReport;
        }
        this.m_cachedMainReport = this.getMainReport(this.m_reports);
        return this.m_cachedMainReport;
    }

    private getMainReport(reports: ReportEntity[]): ReportEntity {
        var ret: ReportEntity = null;
        for (var i = 0; i < reports.length; i++) {
            const report = reports[i];
            if (report.reportStatus == ReportStatus.Resolved) {
                return report;
            }
            if (report.reportStatus == ReportStatus.Rejected) {
                continue;
            }
            if (!ret) {
                ret = report;
                continue;
            }

            // ここに来る時点でretとreportはともにreportStatusがInProgressである

            // BulkSheetで報告されたものより、GoogleFormで報告されたものを優先する
            if (ret.postLocation == PostLocation.BulkSheet && report.postLocation == PostLocation.GoogleForm) {
                ret = report;
                continue;
            }
            // 日時が古いものより新しいもの=ReportIDが大きいものを優先する
            if (ret.reportId > report.reportId) {
                ret = report;
                continue;
            }
        }
        return ret;
    }

    public getReportByReportId(reportId: number): ReportEntity {
        for (var i = 0; i < this.m_reports.length; i++) {
            if (this.m_reports[i].reportId == reportId) {
                return this.m_reports[i];
            }
        }
        return null;
    }
}

class ReportEntity implements IReport {
    private readonly m_buffer: any[];
    public constructor(buffer: any[]) {
        this.m_buffer = buffer;
    }

    private m_isDirty: boolean = false;
    public get isDirty(): boolean {
        return this.m_isDirty;
    }

    public onUpdateStorage(): void {
        this.m_isDirty = false;
    }

    public set(
        reportId: number,
        reportInput: ReportInputFormat,
        musicName: string,
        imagePaths: string[],
        postLocation: PostLocation,
        reportStatus: ReportStatus
    ): void {
        this.reportId = reportId;
        this.musicId = reportInput.musicId;
        this.musicName = musicName;
        this.difficulty = reportInput.difficulty;
        this.beforeOp = reportInput.beforeOp;
        this.afterOp = reportInput.afterOp;
        this.score = reportInput.score;
        this.comboStatus = reportInput.comboStatus;
        this.imagePaths = imagePaths;
        this.postLocation = postLocation;
        this.reportStatus = reportStatus;
    }

    public get reportId(): number { return this.m_buffer[ColumnIndex.ReportId]; }
    public set reportId(value: number) { this.setValue(ColumnIndex.ReportId, value); }

    public get musicId(): number { return this.m_buffer[ColumnIndex.MusicId]; }
    public set musicId(value: number) { this.setValue(ColumnIndex.MusicId, value); }

    public get musicName(): string { return this.m_buffer[ColumnIndex.MusicName]; }
    public set musicName(value: string) { this.setValue(ColumnIndex.MusicName, value); }

    private m_cachedDifficulty: Difficulty = Difficulty.Invalid;
    public get difficulty(): Difficulty {
        if (this.m_cachedDifficulty == Difficulty.Invalid) {
            this.m_cachedDifficulty = Utility.toDifficulty(this.m_buffer[ColumnIndex.Difficulty]);
        }
        return this.m_cachedDifficulty;
    }
    public set difficulty(value: Difficulty) {
        this.m_cachedDifficulty = value;
        this.setValue(ColumnIndex.Difficulty, Utility.toDifficultyText(value));
    }

    public get beforeOp(): number { return this.m_buffer[ColumnIndex.BeforeOp]; }
    public set beforeOp(value: number) { this.setValue(ColumnIndex.BeforeOp, value); }

    public get afterOp(): number { return this.m_buffer[ColumnIndex.AfterOp]; }
    public set afterOp(value: number) { this.setValue(ColumnIndex.AfterOp, value); }

    public get score(): number { return this.m_buffer[ColumnIndex.Score]; }
    public set score(value: number) { this.setValue(ColumnIndex.Score, value); }

    public get comboStatus(): ComboStatus { return this.m_buffer[ColumnIndex.ComboStatus]; }
    public set comboStatus(value: ComboStatus) { this.setValue(ColumnIndex.ComboStatus, value); }

    private m_cachedImagePaths: string[] = null;
    public get imagePaths(): string[] {
        if (this.m_cachedImagePaths == null) {
            this.m_cachedImagePaths = (this.m_buffer[ColumnIndex.ImagePaths] as string).split(',');
        }
        return this.m_cachedImagePaths;
    }
    public set imagePaths(value: string[]) {
        if (!value || value.length == 0) {
            this.m_cachedImagePaths = [];
            this.setValue(ColumnIndex.ImagePaths, '');
        }
        else {
            this.m_cachedImagePaths = value;
            this.setValue(ColumnIndex.ImagePaths, value.reduce((previous, current) => previous + ',' + current));
        }
    }

    public get postLocation(): PostLocation { return this.m_buffer[ColumnIndex.PostLocation]; }
    public set postLocation(value: PostLocation) { this.setValue(ColumnIndex.PostLocation, value); }

    public get reportStatus(): ReportStatus { return this.m_buffer[ColumnIndex.ReportStatus]; }
    public set reportStatus(value: ReportStatus) { this.setValue(ColumnIndex.ReportStatus, value); }

    private setValue(index: ColumnIndex, value: any): void {
        if (this.m_buffer[index] != value) {
            this.m_buffer[index] = value;
            this.m_isDirty = true;
        }
    }
}