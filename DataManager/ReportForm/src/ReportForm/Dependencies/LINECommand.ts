import { BulkReportFormBuildCommand } from "../LineCommand/BulkReportFormBuildCommand";
import { BulkReportFormUrlGetCommand } from "../LineCommand/BulkReportFormUrlGetCommand";
import { DefaultGameVersionGetCommand } from "../LINECommand/DefaultGameVersionGetCommand";
import { EnvironmentGetCommand } from "../LINECommand/EnvironmentGetCommand";
import { FormUrlGetCommand } from "../LINECommand/FormUrlGetCommand";
import { GlobalConfigValueGetCommand } from "../LineCommand/GlobalConfigValueGetCommand";
import { LatestGameVersionGetCommand } from "../LINECommand/LatestGameVersionGetCommand";
import { PostTweetEnabledGetCommand } from "../LINECommand/PostTweetEnabledGetCommand";
import { PostTweetEnabledSetCommand } from "../LINECommand/PostTweetEnabledSetCommand";
import { ReportFormBuildCommand } from "../LineCommand/ReportFormBuildCommand";
import { ReportPostNoticeEnabledGetCommand } from "../LINECommand/ReportPostNoticeEnabledGetCommand";
import { ReportPostNoticeEnabledSetCommand } from "../LINECommand/ReportPostNoticeEnabledSetCommand";
import { TargetLevelMusicCountGetCommand } from "../LineCommand/TargetLevelMusicCountGetCommand";
import { TestCommand } from "../LINECommand/TestCommand";
import { TopUrlGetCommand } from "../LINECommand/TopUrlGetCommand";
import { VersionGetCommand } from "../LINECommand/VersionGetCommand";
import { ReportFormModule } from "../Modules/@ReportFormModule";
import { LINEModule } from "../Modules/LINEModule";

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
