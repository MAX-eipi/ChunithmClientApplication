import { LineConnectorOperator } from "../Operators/LineConnectorOperator";
import { Operator } from "../Operators/Operator";
import { ILineCommand } from "./ILineCommand";

export class LatestGameVersionGetCommand implements ILineCommand {
    public called(command: string): boolean {
        return command == "latest-game-version";
    }

    public invoke(command: string, event: any, postData: any): void {
        let latestVersionName = Operator.getConfiguration().getLatestVersionName();
        let config = Operator.getConfiguration().getVersionConfiguration(latestVersionName);
        let latestVersionText = config.getProperty("version_text", "");
        let message = `最新ゲームバージョン:${latestVersionText}
内部コード:${latestVersionName}`;
        LineConnectorOperator.replyMessage(event.replyToken, [message]);
    }
}