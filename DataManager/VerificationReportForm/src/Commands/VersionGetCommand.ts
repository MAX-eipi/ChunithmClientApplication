import { ICommand } from "./ICommand";
import { getAppVersion } from "../app";
import { LineConnectorOperator } from "../Operators/LineConnectorOperator";

export class VersionGetCommand implements ICommand {
    public called(command: string): boolean {
        return command == "version";
    }

    public invoke(command: string, event: any, postData: any): void {
        LineConnectorOperator.replyMessage(event.replyToken, [getAppVersion()]);
    }
}