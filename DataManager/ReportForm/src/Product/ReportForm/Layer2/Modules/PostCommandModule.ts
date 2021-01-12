import { PostCommand, PostCommandParameter } from "../../Layer3/PostCommand/@PostCommand";
import { ReportFormModule } from "./@ReportFormModule";

interface PostCommandFactory {
    new(module: ReportFormModule): PostCommand;
}

interface PostCommandHandler {
    invoke(): any;
}

export class PostCommandModule extends ReportFormModule {
    public static readonly moduleName = "postCommand"

    private _commands: PostCommand[] = [];
    public setCommandFactories(commandFactories: PostCommandFactory[]): void {
        this._commands = commandFactories.map(cmd => new cmd(this.module));
    }

    public findCommand(postRequest: PostCommandParameter): PostCommandHandler {
        if (!postRequest.API) {
            return null;
        }

        let command = this.getCommand(postRequest.API);
        if (!command) {
            return null;
        }

        return {
            invoke() {
                return command.invoke(postRequest.API, postRequest);
            }
        }
    }

    private getCommand(api: string): PostCommand {
        for (let command of this._commands) {
            if (command.called(api)) {
                return command;
            }
        }
        return null;
    }
}
