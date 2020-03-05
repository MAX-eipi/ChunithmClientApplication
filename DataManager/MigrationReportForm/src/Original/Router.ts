import { Operator } from "./Operators/Operator";
import { ApprovalPager } from "./Pager/ApprovalPager";
import { ErrorPager } from "./Pager/ErrorPager";
import { GroupApprovalPager } from "./Pager/GroupApprovalPager";
import { InProgressListPager } from "./Pager/InProgressListPager";
import { Pager } from "./Pager/Pager";
import { ReportGroupListPager } from "./Pager/ReportGroupListPager";
import { TopPager } from "./Pager/TopPager";
import { UnverifiedListByGenrePager } from "./Pager/UnverifiedListByGenrePager";
import { UnverifiedListByLevelPager } from "./Pager/UnverifiedListByLevelPager";

export class Router {
    private pagers: { [key: string]: Pager } = {};

    public constructor() {
        let pagers: Pager[] = [
            new ErrorPager(),
            new TopPager(),
            new ApprovalPager(),
            new InProgressListPager(),
            new UnverifiedListByGenrePager(),
            new UnverifiedListByLevelPager(),
            new ReportGroupListPager(),
            new GroupApprovalPager(),
        ];
        for (var i = 0; i < pagers.length; i++) {
            let pager = pagers[i];
            this.pagers[pager.getPageName()] = pager;
        }
    }

    public call(page: string, parameter: any): GoogleAppsScript.HTML.HtmlOutput {
        if (!page) {
            return this.callError("ページが指定されていません");
        }

        if (!this.pagers[page]) {
            try {
                return HtmlService.createTemplateFromFile(`html/${page}`).evaluate();
            }
            catch (e) {
                Operator.error([`存在しないページにアクセスされました\n指定ページ:${page}`]);
                return this.callError("存在しないページが指定されました");
            }
        }

        if (!this.pagers[page].isAccessable(Operator.getRole()))
        {
            Operator.error([`権限のないページにアクセスされました\n指定ページ:${page}`]);
            return this.callError("存在しないページが指定されました");
        } 

        return this.pagers[page].call(parameter);
    }

    public callError(message: string): GoogleAppsScript.HTML.HtmlOutput {
        return this.pagers["error"].call({ message: message });
    }
}