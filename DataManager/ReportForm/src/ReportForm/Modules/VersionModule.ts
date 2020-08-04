import { VersionConfigurationFormat } from "../../Configurations/Configuration";
import { ReportFormModule } from "./@ReportFormModule";

export class VersionModule extends ReportFormModule {
    public static readonly moduleName = 'version';

    public getVersionConfig(versionName: string): VersionConfigurationFormat {
        return this.config.versions[versionName];
    }

    public getDefaultVersionConfig(): VersionConfigurationFormat {
        const versionName = this.config.common.defaultVersionName;
        return this.getVersionConfig(versionName);
    }

    public getLatestVersionConfig(): VersionConfigurationFormat {
        const versionName = this.config.common.latestVersionName;
        return this.getVersionConfig(versionName);
    }
}
