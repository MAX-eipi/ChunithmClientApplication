import { MusicDataModule } from "../../Layer2/Modules/MusicDataModule";
import { PostCommandController, PostCommandParameter } from "./@PostCommandController";

export interface TableGetCommandParameer extends PostCommandParameter {
}

export class TableGetCommandController extends PostCommandController {
    public invoke(postData: TableGetCommandParameer): any {
        const musicDatas = this.module.getModule(MusicDataModule).getTable(postData.versionName).datas;
        const musicDataTable = { MusicDatas: musicDatas };
        const response = {
            MusicDataTable: musicDataTable
        };
        return response;
    }
}
