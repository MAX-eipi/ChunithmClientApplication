import { ICommand } from "../Commands/ICommand";
import { LineConnectorOperator } from "./LineConnectorOperator";
import { VersionGetCommand } from "../Commands/VersionGetCommand";
import { FormUrlGetCommand } from "../Commands/FormUrlGetCommand";
import { TopUrlGetCommand } from "../Commands/TopUrlGetCommand";
import { EnvironmentGetCommand } from "../Commands/EnvironmentGetCommand";
import { LatestGameVersionGetCommand } from "../Commands/LatestGameVersionGetCommand";
import { ReportPostNoticeEnabledGetCommand } from "../Commands/ReportPostNoticeEnabledGetCommand";
import { ReportPostNoticeEnabledSetCommand } from "../Commands/ReportPostNoticeEnabledSetCommand";
import { PostTweetEnabledGetCommand } from "../Commands/PostTweetEnabledGetCommand";
import { PostTweetEnabledSetCommand } from "../Commands/PostTweetEnabledSetCommand";
import { TestCommand } from "../Commands/TestCommand";
import { DefaultGameVersionGetCommand } from "../Commands/DefaultGameVersionGetCommand";

export class CommandOperator {
    public static invoke(postData: any): void {
        let commands: ICommand[] = this.getCommands();
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

    private static getCommands(): ICommand[] {
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
}