import { ReportFormModule } from "../Layer2/Modules/@ReportFormModule";
import { PostCommandModule } from "../Layer2/Modules/PostCommandModule";
import { TableGetCommand } from "../Layer3/PostCommand/TableGetCommand";
import { TableUpdateCommand } from "../Layer3/PostCommand/TableUpadateCommand";


export class PostCommandDI {
    public static setCommandFactories(module: ReportFormModule): void {
        module.getModule(PostCommandModule).setCommandFactories([
            TableGetCommand,
            TableUpdateCommand,
        ]);
    }
}
