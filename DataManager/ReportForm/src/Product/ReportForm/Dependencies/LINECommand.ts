import { ReportFormModule } from "../Layer2/Modules/@ReportFormModule";
import { LINEModule } from "../Layer2/Modules/LINEModule";
import { BulkReportFormBuildCommand } from "../Layer3/LineCommand/BulkReportFormBuildCommand";
import { BulkReportFormUrlGetCommand } from "../Layer3/LineCommand/BulkReportFormUrlGetCommand";
import { DefaultGameVersionGetCommand } from "../Layer3/LineCommand/DefaultGameVersionGetCommand";
import { EnvironmentGetCommand } from "../Layer3/LineCommand/EnvironmentGetCommand";
import { FormUrlGetCommand } from "../Layer3/LineCommand/FormUrlGetCommand";
import { GlobalConfigValueGetCommand } from "../Layer3/LineCommand/GlobalConfigValueGetCommand";
import { LatestGameVersionGetCommand } from "../Layer3/LineCommand/LatestGameVersionGetCommand";
import { PostTweetEnabledGetCommand } from "../Layer3/LineCommand/PostTweetEnabledGetCommand";
import { PostTweetEnabledSetCommand } from "../Layer3/LineCommand/PostTweetEnabledSetCommand";
import { ReportFormBuildCommand } from "../Layer3/LineCommand/ReportFormBuildCommand";
import { ReportPostNoticeEnabledGetCommand } from "../Layer3/LineCommand/ReportPostNoticeEnabledGetCommand";
import { ReportPostNoticeEnabledSetCommand } from "../Layer3/LineCommand/ReportPostNoticeEnabledSetCommand";
import { TargetLevelMusicCountGetCommand } from "../Layer3/LineCommand/TargetLevelMusicCountGetCommand";
import { TestCommand } from "../Layer3/LineCommand/TestCommand";
import { TopUrlGetCommand } from "../Layer3/LineCommand/TopUrlGetCommand";
import { VersionGetCommand } from "../Layer3/LineCommand/VersionGetCommand";

export class LINECommandDI {
    public static setCommandFactories(module: ReportFormModule): void {
        module.getModule(LINEModule).setCommandFactories([
            BulkReportFormBuildCommand,
            BulkReportFormUrlGetCommand,
            DefaultGameVersionGetCommand,
            EnvironmentGetCommand,
            FormUrlGetCommand,
            GlobalConfigValueGetCommand,
            LatestGameVersionGetCommand,
            PostTweetEnabledGetCommand,
            PostTweetEnabledSetCommand,
            ReportFormBuildCommand,
            ReportPostNoticeEnabledGetCommand,
            ReportPostNoticeEnabledSetCommand,
            TargetLevelMusicCountGetCommand,
            TestCommand,
            TopUrlGetCommand,
            VersionGetCommand,
        ]);
    }
}
