import { DefaultGameVersionGetCommand } from "../LINECommand/DefaultGameVersionGetCommand";
import { EnvironmentGetCommand } from "../LINECommand/EnvironmentGetCommand";
import { FormUrlGetCommand } from "../LINECommand/FormUrlGetCommand";
import { LatestGameVersionGetCommand } from "../LINECommand/LatestGameVersionGetCommand";
import { PostTweetEnabledGetCommand } from "../LINECommand/PostTweetEnabledGetCommand";
import { PostTweetEnabledSetCommand } from "../LINECommand/PostTweetEnabledSetCommand";
import { ReportPostNoticeEnabledGetCommand } from "../LINECommand/ReportPostNoticeEnabledGetCommand";
import { ReportPostNoticeEnabledSetCommand } from "../LINECommand/ReportPostNoticeEnabledSetCommand";
import { TestCommand } from "../LINECommand/TestCommand";
import { TopUrlGetCommand } from "../LINECommand/TopUrlGetCommand";
import { VersionGetCommand } from "../LINECommand/VersionGetCommand";
import { ReportFormModule } from "../Modules/@ReportFormModule";
import { ReportFormBuildCommand } from "../LineCommand/ReportFormBuildCommand";
import { GlobalConfigValueGetCommand } from "../LineCommand/GlobalConfigValueGetCommand";

export class LINECommandDI {
    public static setCommandFactories(module: ReportFormModule): void {
        module.line.setCommandFactories([
            VersionGetCommand,
            FormUrlGetCommand,
            TopUrlGetCommand,
            EnvironmentGetCommand,
            LatestGameVersionGetCommand,
            DefaultGameVersionGetCommand,
            GlobalConfigValueGetCommand,
            ReportPostNoticeEnabledGetCommand,
            ReportPostNoticeEnabledSetCommand,
            PostTweetEnabledGetCommand,
            PostTweetEnabledSetCommand,
            ReportFormBuildCommand,
            TestCommand,
        ]);
    }
}