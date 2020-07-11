import { Difficulty } from "../../MusicDataTable/Difficulty";
import { IMusicDataReport } from "./IMusicDataReport";
import { ReportStatus } from "./ReportStatus";
import { ReportStorage } from "./ReportStorage";

export class MusicDataReportGroup {
    public constructor(private _groupId: string, private _params: { musicId: number; difficulty: Difficulty }[], private _storage: ReportStorage) {
    }

    public get groupId(): string {
        return this._groupId;
    }

    public getMusicDataReports(): IMusicDataReport[] {
        return this._params.map(p => this._storage.getMusicDataReport(p.musicId, p.difficulty));
    }

    public verified(): boolean {
        return this.getMusicDataReports().every(r => r.mainReport && r.mainReport.reportStatus === ReportStatus.Resolved);
    }
}