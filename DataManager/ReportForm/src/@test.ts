import { Instance } from "./ReportForm/Instance";
import { ChunirecModule } from "./ReportForm/Modules/ChunirecModule";
import { Difficulty } from "./MusicDataTable/Difficulty";

function testRequestChunirecUpdateMusic() {
    Instance.initialize();
    const chunirecModule = Instance.instance.module.getModule(ChunirecModule);

    const params: { musicId: number; difficulty: Difficulty; baseRating: number }[] = [
        {
            musicId: 61,
            difficulty: Difficulty.Master,
            baseRating: 13.6,
        },
        {
            musicId: 61,
            difficulty: Difficulty.Expert,
            baseRating: 11.4,
        },
        {
            musicId: 61,
            difficulty: Difficulty.Advanced,
            baseRating: 7.0,
        },
    ];
    chunirecModule.requestUpdateMusics(params);
}