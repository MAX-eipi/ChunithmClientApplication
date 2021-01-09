import { LINEMessagePushStream } from "../../UrlFetch.LINE/API/Message/Push/Stream";
import { LINEMessageReplyStream } from "../../UrlFetch.LINE/API/Message/Reply/Stream";
import { TextMessage } from "../../UrlFetch.LINE/API/MessageObjects";
import { Result, UrlFetchStream } from "../../UrlFetch/UrlFetch";
import { UrlFetchManager } from "../../UrlFetch/UrlFetchManager";
import { LINECommand } from "../LINECommand/@LINECommand";
import { ReportFormModule } from "./@ReportFormModule";

interface LINECommandFactory {
    new(module: ReportFormModule): LINECommand;
}

interface LINEPostEvent {
    type: string,
    message: {
        type: string,
        text: string,
    },
}

interface LINECommandHandler {
    invoke(): void;
}

export class LINEModule extends ReportFormModule {
    public static readonly moduleName = 'line';

    private get lineModule(): LINEModule { return this.getModule(LINEModule); }

    public pushNoticeMessage(messages: string[]): Result {
        const textMessages: TextMessage[] = messages.map(m => {
            return {
                type: 'text',
                text: m,
            };
        });
        const streams: UrlFetchStream[] = [];
        for (const target of this.configuration.properties.global.lineNoticeTargetIdList) {
            const stream = new LINEMessagePushStream({
                channelAccessToken: this.configuration.properties.global.lineChannelAccessToken,
                to: target,
                messages: textMessages,
            });
            streams.push(stream);
        }
        return UrlFetchManager.execute(streams);
    }

    public replyMessage(replyToken: string, messages: string[]): Result {
        const textMessages: TextMessage[] = messages.map(m => {
            return {
                type: 'text',
                text: m,
            };
        });
        const stream = new LINEMessageReplyStream({
            channelAccessToken: this.configuration.properties.global.lineChannelAccessToken,
            replyToken: replyToken,
            messages: textMessages,
        });
        return UrlFetchManager.execute(stream);
    }

    private _commands: LINECommand[] = [];
    public setCommandFactories(commandFactories: LINECommandFactory[]) {
        this._commands.length = 0;
        Array.prototype.push.apply(this._commands, commandFactories.map(cmd => new cmd(this.module)));
    }

    public findCommand(postRequest: { events: LINEPostEvent[] }): LINECommandHandler {
        if (!postRequest.events || !postRequest.events[0]) {
            return null;
        }

        let event = postRequest.events[0];
        if (event.type != "message" || event.message.type != "text") {
            return null;
        }
        var messageText: string = event.message.text;
        if (messageText.indexOf(":") != 0) {
            return null;
        }
        let commandText = messageText.substring(1);
        let command = this.getCommand(commandText);
        if (!command) {
            return this.createMissingCommandHandler(commandText);
        }

        return {
            invoke() {
                command.invoke(commandText, event, postRequest);
            }
        };
    }

    private getCommand(commandText: string): LINECommand {
        for (let command of this._commands) {
            if (command.called(commandText)) {
                return command;
            }
        }
        return null;
    }

    private createMissingCommandHandler(commandText: string): LINECommandHandler {
        let self = this;
        return {
            invoke() {
                self.lineModule.pushNoticeMessage([`存在しないコマンド:${commandText}`]);
            }
        }
    }
}
