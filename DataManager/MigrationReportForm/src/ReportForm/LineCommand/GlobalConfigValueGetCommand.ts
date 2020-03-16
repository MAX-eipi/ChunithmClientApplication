import { LINECommand } from "./@LINECommand";

export class GlobalConfigValueGetCommand extends LINECommand {
    public called(command: string): boolean {
        return command.indexOf('get-global-config-value<<') == 0;
    }
    public invoke(command: string, event: any, postData: any): void {
        let key = command.replace('get-global-config-value<<', '');
        if (!this.module.config.hasProperty(key)) {
            this.replyMessage(event.replyToken, [`指定のパラメータは存在しません: ${key}`]);
            return;
        }
        let value = this.module.config.getProperty(key, null);
        this.replyMessage(event.replyToken, [value]);
    }
}