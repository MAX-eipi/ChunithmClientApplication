import { ICommand } from "./ICommand";
import { Operator } from "../Operators/Operator";
import { LineConnectorOperator } from "../Operators/LineConnectorOperator";

export class TopUrlGetCommand implements ICommand {
    public called(command: string): boolean {
        return command == "top-url";
    }

    public invoke(command: string, event: any, postData: any): void {
        LineConnectorOperator.replyMessage(event.replyToken, [`[検証報告管理ツール]\n${Operator.getRootUrl()}?page=top`]);
    }
}