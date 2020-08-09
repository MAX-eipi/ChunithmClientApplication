import * as Payload from "./Payload";
import { ConcreteStream } from "../../../../UrlFetch/UrlFetch";

export class LINEMessageReplyStream implements ConcreteStream<Payload.Request, Payload.Response> {
    private readonly url = 'https://api.line.me/v2/bot/message/reply';
    private readonly method = 'post';

    constructor(readonly request: Payload.Request) { }

    private _error = '';
    public get error(): string {
        return this._error;
    }

    public get hasError(): boolean {
        return this._error ? true : false;
    }

    private getHeader(request: Payload.Request): GoogleAppsScript.URL_Fetch.HttpHeaders {
        return {
            'content-Type': 'application/json; charset=utf-8',
            'authorization': 'Bearer ' + request.channelAccessToken,
        }
    }

    getRawRequest(): GoogleAppsScript.URL_Fetch.URLFetchRequest {
        return {
            url: this.url,
            headers: this.getHeader(this.request),
            method: this.method,
            payload: JSON.stringify(this.request),
        };
    }
    setRawResponse(response: GoogleAppsScript.URL_Fetch.HTTPResponse): void {
        this._response = JSON.parse(response.getContentText());
        if (this._response.message) {
            this._error = this._response.message;
        }
    }

    private _response: Payload.Response;
    public get response(): Payload.Response {
        return this._response;
    }
}
