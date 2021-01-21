import { Instance } from "./Product/ReportForm/Instance";
import { ReportForm } from "./Product/ReportForm/ReportForm";
import { RatingDataAnalysisModule } from "./Product/ReportForm/Layer2/Modules/RatingDataAnalysisModule";

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

function writeRatingDataTest() {
    Instance.initialize();
    Instance.instance.module.getModule(RatingDataAnalysisModule).test();
}
