import { Difficulty } from "../../MusicDataTable/Difficulty";
import { calcBaseRating, ComboStatus } from "../Rating";
import { GoogleFormReport } from "./GoogleFormReport";
import { Utility } from "../Utility";

export enum ReportStatus {
    InProgress,
    Resolved,
    Rejected,
}

export class Report {
    private _reportId: number;
    private _musicId: number;
    private _musicName: string;
    private _difficulty: Difficulty;
    private _beforeOp: number;
    private _afterOp: number;
    private _score: number;
    private _comboStatus: ComboStatus;
    private _imagePaths: string[];
    private _reportStatus: ReportStatus;

    public static createByRow(row: Object[]): Report {
        return new Report(
            parseInt(row[0].toString()),
            parseInt(row[1].toString()),
            row[2].toString(),
            Utility.toDifficulty(row[3].toString()),
            parseFloat(row[4].toString()),
            parseFloat(row[5].toString()),
            parseInt(row[6].toString()),
            parseInt(row[7].toString()),
            row[8].toString() ? row[8].toString().split(",") : [],
            parseInt(row[9].toString()));
    }

    public static createByGoogleFormReport(reportId: number, musicId: number, googleFormReport: GoogleFormReport, reportStatus: ReportStatus): Report {
        return new Report(
            reportId,
            musicId,
            googleFormReport.musicName,
            googleFormReport.difficulty,
            googleFormReport.beforeOp,
            googleFormReport.afterOp,
            googleFormReport.score,
            googleFormReport.comboStatus,
            googleFormReport.imagePaths,
            reportStatus
        );
    }

    public constructor(
        reportId: number,
        musicId: number,
        musicName: string,
        difficulty: Difficulty,
        beforeOp: number,
        afterOp: number,
        score: number,
        comboStatus: ComboStatus,
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

    public get reportId(): number {
        return this._reportId;
    }
    public get musicId(): number {
        return this._musicId;
    }
    public get musicName(): string {
        return this._musicName;
    }
    public get difficulty(): Difficulty {
        return this._difficulty;
    }
    public get beforeOp(): number {
        return this._beforeOp;
    }
    public get afterOp(): number {
        return this._afterOp;
    }
    public get score(): number {
        return this._score;
    }
    public get comboStatus(): ComboStatus {
        return this._comboStatus;
    }
    public get imagePaths(): string[] {
        return this._imagePaths;
    }
    public get reportStatus(): ReportStatus {
        return this._reportStatus;
    }
    public set reportStatus(value: ReportStatus) {
        this._reportStatus = value;
    }

    public calcBaseRating(): number {
        var comboStatus = ComboStatus.None;
        switch (this.comboStatus) {
            case ComboStatus.AllJustice:
                comboStatus = ComboStatus.AllJustice;
                break;
            case ComboStatus.FullCombo:
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
            Utility.toDifficultyText(this._difficulty),
            this._beforeOp,
            this._afterOp,
            this._score,
            this._comboStatus,
            (this._imagePaths && this._imagePaths.length > 0) ? this._imagePaths.reduce(function (acc, src) { return `${acc},${src}`; }) : "",
            this._reportStatus,
        ];
    }
}

