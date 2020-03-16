import { ReportFormModule } from "../Modules/@ReportFormModule";
import { TableGetCommand } from "../PostCommand/TableGetCommand";
import { TableUpdateCommand } from "../PostCommand/TableUpadateCommand";

export class PostCommandDI {
    public static setCommandFactories(module: ReportFormModule): void {
        module.postCommand.setCommandFactories([
            TableGetCommand,
            TableUpdateCommand,
        ]);
    }
}