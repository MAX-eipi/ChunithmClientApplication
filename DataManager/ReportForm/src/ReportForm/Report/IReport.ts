import { ReportStatus } from "./Report";
import { PostLocation } from "./ReportStorage";
import { ReportInputFormat } from "./ReportInputFormat";
export interface IReport extends ReportInputFormat {
    readonly reportId: number;
    readonly musicName: string;
    readonly imagePaths: string[];
    readonly postLocation: PostLocation;
    readonly reportStatus: ReportStatus;
}
