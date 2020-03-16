import { LINEConnector } from "../../LINE/LINEConnector";
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
    private _notice: LINEConnector;
    public get notice(): LINEConnector {
        if (!this._notice) {
            this._notice = new LINEConnector(
                this.config.line.channelAccessToken,
                this.config.line.noticeTargetIdList);
        }
        return this._notice;
    }

    private _errorNotice: LINEConnector;
    public get errorNotice(): LINEConnector {
        if (!this._errorNotice) {
            this._errorNotice = new LINEConnector(
                this.config.line.channelAccessToken,
                this.config.line.errorNoticeTargetIdList);
        }
        return this._errorNotice;
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
                self.line.notice.pushTextMessage([`存在しないコマンド:${commandText}`]);
            }
        }
    }
}