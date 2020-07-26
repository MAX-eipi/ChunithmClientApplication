import { Environment } from "./ReportForm/Environment";
import { ConfigurationSourceType } from "./Configurations/ConfigurationObject";

export interface ConstDefinition {
    environment: Environment;
    configurationSourceType: ConfigurationSourceType;
    configurationJsonFileId: string;
}
