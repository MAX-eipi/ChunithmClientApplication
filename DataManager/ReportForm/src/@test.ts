import { Instance } from "./Product/ReportForm/Instance";
import { ReportForm } from "./Product/ReportForm/ReportForm";

// implements test core here
function checkInitialize() {
    console.time("checkInitialize");
    Instance.initialize();
    console.timeEnd("checkInitialize");
}

function doGetTest() {
    type DoGet = GoogleAppsScript.Events.DoGet & { pathInfo?: string };
    const e: DoGet = {
        contentLength: -1,
        pathInfo: "Dev4",
        contextPath: "",
        queryString: "",
        parameters: {},
        parameter: {},
    };

    ReportForm.doGet(e);
}
