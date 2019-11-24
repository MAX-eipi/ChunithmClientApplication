﻿import { ILineCommand } from "./ILineCommand";
import { LineConnectorOperator } from "../Operators/LineConnectorOperator";
import { Operator } from "../Operators/Operator";

export class EnvironmentGetCommand implements ILineCommand {
    public called(command: string): boolean {
        return command == "environment";
    }

    public invoke(command: string, event: any, postData: any): void {
        LineConnectorOperator.replyMessage(event.replyToken, [`環境:${Operator.getEnvironment()}
モード:${Operator.isDevelop() ? "開発" : "本番"}`]);
    }
}