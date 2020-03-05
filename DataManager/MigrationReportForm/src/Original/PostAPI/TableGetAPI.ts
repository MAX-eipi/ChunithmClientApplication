import { IPostAPI } from "./IPostApi";
import { DataManagerOperator } from "../Operators/DataManagerOperator";

export class TableGetAPI implements IPostAPI {
    called(api: string): boolean {
        return api == "table/get";
    }

    invoke(api: string, postData: any): any {
        let musicDatas = DataManagerOperator.getMusicDatas();
        let musicDataTable = { MusicDatas: musicDatas };
        let response = {
            MusicDataTable: musicDataTable
        };
        return response;
    }
}