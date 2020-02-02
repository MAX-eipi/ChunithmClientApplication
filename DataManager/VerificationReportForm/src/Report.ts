import { calcBaseRating, ComboStatus } from "./Rating";

export enum ReportStatus {
    InProgress,
    Resolved,
    Rejected,
}

export class Report {
    public static get UNASSIGNED_REPORT_ID(): string {
        return "";
    }

    private _reportId: string;
    private _musicId: number;
    private _musicName: string;
    private _difficulty: string;
    private _beforeOp: number;
    private _afterOp: number;
    private _score: number;
    private _comboStatus: string;
    private _imagePaths: string[];
    private _reportStatus: ReportStatus;

    public static createByRow(row: Object[]): Report {
        return new Report(
            row[0].toString(),
            parseInt(row[1].toString()),
            row[2].toString(),
            row[3].toString(),
            parseFloat(row[4].toString()),
            parseFloat(row[5].toString()),
            parseInt(row[6].toString()),
            row[7].toString(),
            row[8].toString() ? row[8].toString().split(",") : [],
            parseInt(row[9].toString()));
    }

    public constructor(
        reportId: string,
        musicId: number,
        musicName: string,
        difficulty: string,
        beforeOp: number,
        afterOp: number,
        score: number,
        comboStatus: string,
        imagePaths: string[],
        reportStatus: ReportStatus) {
        this._reportId = reportId;
        this._musicId = musicId;
        this._musicName = musicName;
        this._difficulty = difficulty;
        this._beforeOp = beforeOp;
        this._afterOp = afterOp;
        this._score = score;
        this._comboStatus = comboStatus;
        this._imagePaths = imagePaths;
        this._reportStatus = reportStatus;
    }

    public get reportId(): string {
        return this._reportId;
    }
    public set reportId(value: string) {
        this._reportId = value;
    }
    public getReportId(): string {
        return this.reportId;
    }

    public get musicId(): number {
        return this._musicId;
    }
    public getMusicId(): number {
        return this.musicId;
    }

    public get musicName(): string {
        return this._musicName;
    }
    public getMusicName(): string {
        return this.musicName;
    }

    public get difficulty(): string {
        return this._difficulty;
    }
    public getDifficulty(): string {
        return this.difficulty;
    }

    public get beforeOp(): number {
        return this._beforeOp;
    }
    public getBeforeOp(): number {
        return this.beforeOp;
    }

    public get afterOp(): number {
        return this._afterOp;
    }
    public getAfterOp(): number {
        return this.afterOp;
    }

    public get score(): number {
        return this._score;
    }
    public getScore(): number {
        return this.score;
    }

    public get comboStatus(): string {
        return this._comboStatus;
    }
    public getComboStatus(): string {
        return this.comboStatus;
    }

    public get imagePaths(): string[] {
        return this._imagePaths.map(function (id) { return `https://drive.google.com/uc?id=${id}`; });
    }
    public getImagePaths(): string[] {
        return this.imagePaths;
    }

    public get reportStatus(): ReportStatus {
        return this._reportStatus;
    }
    public getReportStatus(): ReportStatus {
        return this.reportStatus;
    }

    public calcBaseRating(): number {
        var comboStatus = ComboStatus.None;
        switch (this.comboStatus) {
            case "AJ":
                comboStatus = ComboStatus.AllJustice;
                break;
            case "FC":
                comboStatus = ComboStatus.FullCombo;
                break;
        }
        return calcBaseRating(this.beforeOp, this.afterOp, this.score, comboStatus);
    }

    public toRawData(): Object[] {
        return [
            this._reportId,
            this._musicId,
            this._musicName,
            this._difficulty,
            this._beforeOp,
            this._afterOp,
            this._score,
            this._comboStatus,
            (this._imagePaths && this._imagePaths.length > 0) ? this.imagePaths.reduce(function (acc, src) { return `${acc},${src}`; }) : "",
            this._reportStatus,
        ];
    }
}

export class ReportError implements Error {
    public name: string = "ReportError";
    public message: string;

    public constructor(message: string) {
        this.message = message;
    }

    toString(): string {
        return `${this.name}:${this.message}`;
    }
}