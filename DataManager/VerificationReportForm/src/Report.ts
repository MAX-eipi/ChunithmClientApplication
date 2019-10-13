import { calcBaseRating, ComboStatus } from "./Rating";

export enum ReportStatus {
    InProgress,
    Resolved,
    Rejected,
}

export class Report {
    private reportId: string;
    private musicId: number;
    private musicName: string;
    private difficulty: string;
    private beforeOp: number;
    private afterOp: number;
    private score: number;
    private comboStatus: string;
    private imagePaths: string[];
    private reportStatus: ReportStatus;

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
        this.reportId = reportId;
        this.musicId = musicId;
        this.musicName = musicName;
        this.difficulty = difficulty;
        this.beforeOp = beforeOp;
        this.afterOp = afterOp;
        this.score = score;
        this.comboStatus = comboStatus;
        this.imagePaths = imagePaths;
        this.reportStatus = reportStatus;
    }

    public getReportId(): string {
        return this.reportId;
    }
    public getMusicId(): number {
        return this.musicId;
    }
    public getMusicName(): string {
        return this.musicName;
    }
    public getDifficulty(): string {
        return this.difficulty;
    }
    public getBeforeOp(): number {
        return this.beforeOp;
    }
    public getAfterOp(): number {
        return this.afterOp;
    }
    public getScore(): number {
        return this.score;
    }
    public getComboStatus(): string {
        return this.comboStatus;
    }
    public getImagePaths(): string[] {
        return this.imagePaths.map(function (id) { return `https://drive.google.com/uc?id=${id}`; });
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
            this.reportId,
            this.musicId,
            this.musicName,
            this.difficulty,
            this.beforeOp,
            this.afterOp,
            this.score,
            this.comboStatus,
            (this.imagePaths && this.imagePaths.length > 0) ? this.imagePaths.reduce(function(acc, src) { return `${acc},${src}`;}) : "",
            this.reportStatus,
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