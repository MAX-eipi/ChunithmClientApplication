import { ComboStatus } from "../../Layer1/Rating";
import { Difficulty } from "../MusicDataTable/Difficulty";

export interface ReportInputFormat {
    readonly musicId: number;
    readonly difficulty: Difficulty;
    readonly beforeOp: number;
    readonly afterOp: number;
    readonly score: number;
    readonly comboStatus: ComboStatus;
}
