import { PostCommand, PostCommandParameter } from "./@PostCommand";

export interface TableGetCommandParameer extends PostCommandParameter {
}

export class TableGetCommand extends PostCommand {
    public called(api: string): boolean {
        return api == "table/get";
    }

    public invoke(api: string, postData: TableGetCommandParameer): any {
        let musicDatas = this.module.musicData.getTable(postData.versionName).datas;
        let musicDataTable = { MusicDatas: musicDatas };
        let response = {
            MusicDataTable: musicDataTable
        };
        return response;
    }
}