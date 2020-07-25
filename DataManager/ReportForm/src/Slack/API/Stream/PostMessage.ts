import { ConcreteStream } from '../../../UrlFetch/UrlFetch';
import * as Payload from '../Payload/Chat/PostMessage';

export class ChatPostMessage implements ConcreteStream<Payload.Request, Payload.Response> {
    private readonly methodUrl = 'https://slack.com/api/chat.postMessage';
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
            'content-type': 'application/json; charset=utf-8',
            'authorization': `Bearer ${request.token}`
        };
    }
    public getRawRequest(): GoogleAppsScript.URL_Fetch.URLFetchRequest {
        return {
            url: this.methodUrl,
            headers: this.getHeader(this.request),
            method: this.method,
            payload: JSON.stringify(this.request),
        };
    }

    public setRawResponse(response: GoogleAppsScript.URL_Fetch.HTTPResponse): void {
    }

    private _response: Payload.Response = null;
    public get response(): Payload.Response {
        return this._response;
    }
}
