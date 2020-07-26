import { Debug } from "../ReportForm/Debug";
import { ConfigurationObject } from "./ConfigurationObject";

export class JsonConfiguration extends ConfigurationObject {
    public static createByFileId(fileId: string): JsonConfiguration {
        try {
            const file = DriveApp.getFileById(fileId);
            const json = file.getBlob().getDataAsString();
            return this.createByJson(json);
        }
        catch (e) {
            Debug.logException(e);
            return null;
        }
    }

    public static createByJson(json: string): JsonConfiguration {
        let jsonObject;
        try {
            jsonObject = JSON.parse(json);
        }
        catch (e) {
            Debug.logException(e)
            return null;
        }
        return new JsonConfiguration(jsonObject);
    }

    private constructor(jsonObject) {
        super(jsonObject);
    }
}
