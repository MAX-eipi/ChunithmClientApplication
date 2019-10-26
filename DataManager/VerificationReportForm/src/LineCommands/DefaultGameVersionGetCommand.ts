import { ILineCommand } from "./ILineCommand";
import { Operator } from "../Operators/Operator";
import { LineConnectorOperator } from "../Operators/LineConnectorOperator";

export class DefaultGameVersionGetCommand implements ILineCommand {
    public called(command: string): boolean {
        return command == "default-game-version";
    }

    public invoke(command: string, event: any, postData: any): void {
        let defaultVersionName = Operator.getDefaultVersionName();
        let config = Operator.getConfiguration().getVersionConfiguration(defaultVersionName);
        let defaultVersionText = config.getProperty("version_text", "");
        let message = `デフォルトゲームバージョン:${defaultVersionText}
内部コード:${defaultVersionName}`;
        LineConnectorOperator.replyMessage(event.replyToken, [message]);
    }
}