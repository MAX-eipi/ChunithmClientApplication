import { ConfigurationObject } from "./ConfigurationObject";

export class ScriptPropertiesConfiguration extends ConfigurationObject {
    public constructor(configJson: string) {
        super(JSON.parse(configJson));
    }
}
