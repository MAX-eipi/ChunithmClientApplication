import { Difficulty } from "../../MusicDataTable/Difficulty";
import { ComboStatus } from "../Rating";

export interface ReportInputFormat {
    readonly musicId: number;
    readonly difficulty: Difficulty;
    readonly beforeOp: number;
    readonly afterOp: number;
    readonly score: number;
    readonly comboStatus: ComboStatus;
}
