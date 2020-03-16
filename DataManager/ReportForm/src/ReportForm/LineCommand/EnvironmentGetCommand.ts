import { Environment } from "../Environment";
import { LINECommand } from "./@LINECommand";


export class EnvironmentGetCommand extends LINECommand {
    public called(command: string): boolean {
        return command == "environment";
    }

    public invoke(command: string, event: any, postData: any): void {
        let environmentText = this.getEnvironmentText(this.module.config.common.environment);
        let message = `環境:${environmentText}`;
        this.replyMessage(event.replyToken, [message]);
    }

    private getEnvironmentText(environment: Environment): string {
        switch (environment) {
            case Environment.Develop:
                return "開発";
            case Environment.Release:
                return "本番";
        }
    }
}