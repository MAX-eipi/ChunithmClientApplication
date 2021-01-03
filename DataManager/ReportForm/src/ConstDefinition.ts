import { Environment } from "./ReportForm/Environment";
import { ConfigurationSourceType } from "./ReportForm/Configurations/ConfigurationSourceType";

export interface ConstDefinition {
    environment: Environment;
    configurationSourceType: ConfigurationSourceType;
    configurationJsonFileId: string;
    runtimeConfigurationSourceType: ConfigurationSourceType;
    runtimeConfigurationJsonFileId: string;
}
