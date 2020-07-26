import { Difficulty } from "../../MusicDataTable/Difficulty";
import { ReportFormModule } from "./@ReportFormModule";
import { Debug } from "../Debug";

export class ChunirecModule extends ReportFormModule {
    public static readonly moduleName = 'chunirec';

    private _apiHost: string = null;
    public get apiHost(): string {
        if (!this._apiHost) {
            this._apiHost = this.module.config.global.chunirecApiHost;
        }
        return this._apiHost;
    }

    private _apiToken: string = null;
    public get apiToken(): string {
        if (!this._apiToken) {
            this._apiToken = this.module.config.global.chunirecApiToken;
        }
        return this._apiToken;
    }

    public requestUpdateMusic(musicId: number, difficulty: Difficulty, baseRating: number): boolean {
        return this.requestUpdateMusics([{ musicId: musicId, difficulty: difficulty, baseRating: baseRating }]);
    }

    public requestUpdateMusics(params: { musicId: number; difficulty: Difficulty; baseRating: number }[]): boolean {
        const requests: GoogleAppsScript.URL_Fetch.URLFetchRequest[] = [];
        for (const param of params) {
            requests.push({
                url: `${this.apiHost}/1.2/music/update.json`,
                payload: {
                    idx: param.musicId,
                    diff: this.toDifficultyText(param.difficulty),
                    const: param.baseRating,
                    token: this.apiToken,
                },
                muteHttpExceptions: true,
            });
        }
        let success = true;
        try {
            const responses = UrlFetchApp.fetchAll(requests);
            for (const response of responses) {
                if (response.getResponseCode() !== 200) {
                    Debug.logError(`failure ChunirecModule.requestUpdateMusics.
${response.getContentText()}`);
                    success = false;
                }
            }
        }
        catch (e) {
            Debug.logError(e);
            success = false;
        }
        return success;
    }

    private toDifficultyText(difficulty: Difficulty): string {
        switch (difficulty) {
            case Difficulty.Basic:
                return 'BAS';
            case Difficulty.Advanced:
                return 'ADV';
            case Difficulty.Expert:
                return 'EXP';
            case Difficulty.Master:
                return 'MAS';
        }

        throw new Error(`Unsupported value. Diffiuclty::${difficulty}`);
    }
}
