import { Instance } from "./ReportForm/Instance";
import { ChunirecModule } from "./ReportForm/Modules/ChunirecModule";
import { Difficulty } from "./MusicDataTable/Difficulty";

function testRequestChunirecUpdateMusic() {
    Instance.initialize();
    const chunirecModule = Instance.instance.module.getModule(ChunirecModule);
    chunirecModule.apiHost = 'http://api.0jocn9xq49ke-chunirec.tk';
    chunirecModule.apiToken = '814b6c508ce17d9791d932c50688e2f2363db38192f1d5eb5e42be06b868400b';

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