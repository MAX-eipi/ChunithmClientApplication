﻿import { ICommand } from "./ICommand";
import { LineConnectorOperator } from "../Operators/LineConnectorOperator";
import { Operator } from "../Operators/Operator";

export class FormUrlGetCommand implements ICommand {
    public called(command: string): boolean {
        return command == "form-url";
    }

    public invoke(command: string, event: any, postData: any): void {
        LineConnectorOperator.replyMessage(event.replyToken, [`[検証報告フォーム]\n${Operator.getReportForm().getPublishedUrl()}`]);
    }
}