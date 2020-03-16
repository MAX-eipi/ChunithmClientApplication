import { ReportFormModule } from "../Modules/@ReportFormModule";
import { ApprovalPage } from "../Page/ApprovalPage";
import { ErrorPage } from "../Page/ErrorPage";
import { GroupApprovalPage } from "../Page/GroupApprovalPage";
import { InProgressListPage } from "../Page/InProgressListPage";
import { ReportGroupListPage } from "../Page/ReportGroupListPage";
import { TopPage } from "../Page/TopPage";
import { UnverifiedListByGenrePage } from "../Page/UnverifiedListByGenrePage";
import { UnverifiedListByLevelPage } from "../Page/UnverifiedListByLevelPage";

export class PageDI {
    public static setPageFactories(module: ReportFormModule): void {
        module.router.setPageFactories(
            ErrorPage,
            [
                ErrorPage,
                TopPage,
                InProgressListPage,
                ReportGroupListPage,
                UnverifiedListByGenrePage,
                UnverifiedListByLevelPage,
                ApprovalPage,
                GroupApprovalPage,
            ]
        );
    }
}