import { ConfigurationSourceType } from "./ReportForm/Configurations/ConfigurationSourceType";
import { Environment } from "./ReportForm/Environment";

export interface ConstDefinition {
    environment: Environment;
    configurationSourceType: ConfigurationSourceType;
    configurationJsonFileId: string;
    runtimeConfigurationSourceType: ConfigurationSourceType;
    runtimeConfigurationJsonFileId: string;
}
