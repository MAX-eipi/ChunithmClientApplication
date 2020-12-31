import { ReportFormModule } from "../Modules/@ReportFormModule";
import { TableGetCommand } from "../PostCommand/TableGetCommand";
import { TableUpdateCommand } from "../PostCommand/TableUpadateCommand";
import { PostCommandModule } from "../Modules/PostCommandModule";

export class PostCommandDI {
    public static setCommandFactories(module: ReportFormModule): void {
        module.getModule(PostCommandModule).setCommandFactories([
            TableGetCommand,
            TableUpdateCommand,
        ]);
    }
}
