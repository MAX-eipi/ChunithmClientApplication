import { ReportGroup, ReportGroupUnitParameter } from "./ReportGroup";
import { ReportSheet } from "./ReportSheet";
import { Utility } from "../Utility";

interface ContainerParameter {
    groupId: string;
    units: ReportGroupUnitParameter[];
}


export class ReportGroupContainer {
    public static createBySheet(sheet: GoogleAppsScript.Spreadsheet.Sheet, reportSheet: ReportSheet): ReportGroupContainer {
        let containerParameters: ContainerParameter[] = [];
        let containerParameterMap: { [key: string]: number } = {};

        let table = sheet.getDataRange().getValues();
        table.shift();
        for (let data of table) {
            let groupId = data[0].toString();
            let musicId = parseInt(data[1]);
            let difficulty = Utility.toDifficulty(data[2].toString());

            if (!(groupId in containerParameterMap)) {
                let containerParam: ContainerParameter = {
                    groupId: groupId,
                    units: [],
                };
                let index = containerParameters.push(containerParam) - 1;
                containerParameterMap[groupId] = index;
            }

            containerParameters[containerParameterMap[groupId]].units.push({
                musicId: musicId,
                difficulty: difficulty,
            });
        }

        return new ReportGroupContainer(containerParameters, reportSheet);
    }

    private _reportGroups: ReportGroup[] = [];
    private _reportGroupMap: { [key: string]: number } = {};

    private constructor(parameters: ContainerParameter[], reportSheet: ReportSheet) {
        for (let param of parameters) {
            let reportGroup = new ReportGroup(param.groupId, param.units, reportSheet);
            let index = this._reportGroups.push(reportGroup) - 1;
            this._reportGroupMap[param.groupId] = index;
        }
    }

    public get reportGroups(): ReportGroup[] {
        return this._reportGroups;
    }

    public getReportGroup(groupId: string): ReportGroup {
        return this._reportGroups[this._reportGroupMap[groupId]];
    }
}