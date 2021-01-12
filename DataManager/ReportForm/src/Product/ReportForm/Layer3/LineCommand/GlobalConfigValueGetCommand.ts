import { LINECommand } from "./@LINECommand";

export class GlobalConfigValueGetCommand extends LINECommand {
    public called(command: string): boolean {
        return command.indexOf('get-global-config-value<<') == 0;
    }
    public invoke(command: string, event: any, postData: any): void {
        const key = command.replace('get-global-config-value<<', '');
        if (!(key in this.module.configuration.global)) {
            this.replyMessage(event.replyToken, [`指定のパラメータは存在しません: ${key}`]);
            return;
        }
        const value = this.module.configuration.global[key];
        this.replyMessage(event.replyToken, [value]);
    }
}
