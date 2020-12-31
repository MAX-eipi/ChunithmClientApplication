import { Logger } from "./Logger";
import { SlackChatPostMessageStream } from "../../Slack/API/Chat/PostMessage/Stream";
import { UrlFetchManager } from "../../UrlFetch/UrlFetchManager";

export class SlackLogger implements Logger {

    public constructor(
        private readonly _slackApiToken: string,
        private readonly _logChannelId: string,
        private readonly _warningChannelId: string,
        private readonly _errorChannelId: string
    ) {
    }

    public log(message: string): void {
        if (!this._logChannelId) {
            return;
        }
        const stream = new SlackChatPostMessageStream({
            token: this._slackApiToken,
            channel: this._logChannelId,
            text: message
        });
        UrlFetchManager.execute(stream);
    }

    public logWarning(message: string): void {
        if (!this._warningChannelId) {
            return;
        }
        const stream = new SlackChatPostMessageStream({
            token: this._slackApiToken,
            channel: this._warningChannelId,
            text: message
        });
        UrlFetchManager.execute(stream);
    }

    public logError(message: string): void {
        if (!this._errorChannelId) {
            return;
        }
        const stream = new SlackChatPostMessageStream({
            token: this._slackApiToken,
            channel: this._errorChannelId,
            text: message
        });
        UrlFetchManager.execute(stream);
    }
}
