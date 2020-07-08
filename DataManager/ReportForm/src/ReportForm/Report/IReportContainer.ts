import { Difficulty } from "../../MusicDataTable/Difficulty";
import { IReport } from "./IReport";
export interface IReportContainer {
    readonly musicId: number;
    readonly difficulty: Difficulty;
    readonly reports: IReport[];
    readonly mainReport: IReport;
}
