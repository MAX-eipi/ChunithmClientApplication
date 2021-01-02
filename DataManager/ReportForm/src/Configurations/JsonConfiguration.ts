import { CustomLogManager } from "../CustomLogger/CustomLogManager";
import { ConfigurationObject } from "./ConfigurationObject";

export class JsonConfiguration extends ConfigurationObject {
    public static createByFileId(fileId: string): JsonConfiguration {
        try {
            const file = DriveApp.getFileById(fileId);
            const json = file.getBlob().getDataAsString();
            return this.createByJson(json);
        }
        catch (e) {
            CustomLogManager.exception(e);
            return null;
        }
    }

    public static createByJson(json: string): JsonConfiguration {
        let jsonObject;
        try {
            jsonObject = JSON.parse(json);
        }
        catch (e) {
            CustomLogManager.exception(e);
            return null;
        }
        return new JsonConfiguration(jsonObject);
    }

    private constructor(jsonObject) {
        super(jsonObject);
    }
}
