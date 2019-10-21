import { ILineCommand } from "../LineCommands/ILineCommand";
import { LineConnectorOperator } from "./LineConnectorOperator";
import { VersionGetCommand } from "../LineCommands/VersionGetCommand";
import { FormUrlGetCommand } from "../LineCommands/FormUrlGetCommand";
import { TopUrlGetCommand } from "../LineCommands/TopUrlGetCommand";
import { EnvironmentGetCommand } from "../LineCommands/EnvironmentGetCommand";
import { LatestGameVersionGetCommand } from "../LineCommands/LatestGameVersionGetCommand";
import { ReportPostNoticeEnabledGetCommand } from "../LineCommands/ReportPostNoticeEnabledGetCommand";
import { ReportPostNoticeEnabledSetCommand } from "../LineCommands/ReportPostNoticeEnabledSetCommand";
import { PostTweetEnabledGetCommand } from "../LineCommands/PostTweetEnabledGetCommand";
import { PostTweetEnabledSetCommand } from "../LineCommands/PostTweetEnabledSetCommand";
import { TestCommand } from "../LineCommands/TestCommand";
import { DefaultGameVersionGetCommand } from "../LineCommands/DefaultGameVersionGetCommand";
import { IPostAPI } from "../PostAPI/IPostApi";
import { TableGetAPI } from "../PostAPI/TableGetAPI";
import { TableUpdateAPI } from "../PostAPI/TableUpadateAPI";

export class CommandOperator {
    public static invokeLineCommand(postData: any): void {
        let commands: ILineCommand[] = this.getLineCommands();
        for (var i = 0; i < postData.events.length; i++) {
            let event = postData.events[i];
            if (event.type != "message" || event.message.type != "text") {
                continue;
            }
            var messageText: string = event.message.text;
            if (messageText.indexOf(":") != 0) {
                continue;
            }
            let command = messageText.substring(1);
            for (var j = 0; j < commands.length; j++) {
                if (commands[j].called(command)) {
                    commands[j].invoke(command, event, postData);
                    return;
                }
            }
            LineConnectorOperator.replyMessage(event.replyToken, [`未知のコマンドです\n${command}`]);
        }
    }

    private static getLineCommands(): ILineCommand[] {
        return [
            new VersionGetCommand(),
            new FormUrlGetCommand(),
            new TopUrlGetCommand(),
            new EnvironmentGetCommand(),
            new LatestGameVersionGetCommand(),
            new DefaultGameVersionGetCommand(),
            new ReportPostNoticeEnabledGetCommand(),
            new ReportPostNoticeEnabledSetCommand(),
            new PostTweetEnabledGetCommand(),
            new PostTweetEnabledSetCommand(),
            new TestCommand(),
        ];
    }

    public static invokePostAPI(postData: any): any {
        let commands: IPostAPI[] = this.getPostCommand();
        for (var i = 0; i < commands.length; i++) {
            let command = commands[i];
            if (command.called(postData.API)) {
                return command.invoke(postData.API, postData);
            }
        }
        return {};
    }

    private static getPostCommand(): IPostAPI[] {
        return [
            new TableGetAPI(),
            new TableUpdateAPI(),
        ];
    }
}