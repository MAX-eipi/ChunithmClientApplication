import { Instance } from "./Product/ReportForm/Instance";
import { ReportForm } from "./Product/ReportForm/ReportForm";

// implements test core here
function checkInitialize() {
    console.time("checkInitialize");
    Instance.initialize();
    console.timeEnd("checkInitialize");
}

function doGetTest() {
    const e = {
        contentLength: -1,
        pathInfo: "Dev4",
        contextPath: "",
        queryString: "",
        parameters: {},
        parameter: {
            versionName: null
        },
    };

    ReportForm.doGet(e);
}
