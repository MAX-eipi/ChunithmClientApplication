import { ConfigurationSourceType } from "./z.ReportForm/Configurations/ConfigurationSourceType";
import { Environment } from "./z.ReportForm/Environment";

export interface ConstDefinition {
    environment: Environment;
    configurationSourceType: ConfigurationSourceType;
    configurationJsonFileId: string;
    runtimeConfigurationSourceType: ConfigurationSourceType;
    runtimeConfigurationJsonFileId: string;
}
