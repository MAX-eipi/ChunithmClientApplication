import * as UrlFetch from "./UrlFetch";

class UrlFetchResult implements UrlFetch.Result {
    public static createErrorResult(error: Error): UrlFetch.Result {
        const result = new UrlFetchResult;
        result.errors = [this.toErrorMessage(error)];
        return result;
    }

    private static toErrorMessage(error: Error): string {
        return `[Message]
${error.message}

[Stack Trace]
${error.stack}`;
    }

    public errors: string[] = [];
    public get hasError(): boolean {
        return this.errors && this.errors.length > 0;
    }
}

export class UrlFetchManager {
    public static execute(streams: UrlFetch.Stream[]): UrlFetch.Result {
        const length = streams.length;
        const requests: GoogleAppsScript.URL_Fetch.URLFetchRequest[] = [];
        for (let i = 0; i < length; i++) {
            requests.push(streams[i].getRawRequest());
        }
        let responses: GoogleAppsScript.URL_Fetch.HTTPResponse[] = [];
        try {
            responses = UrlFetchApp.fetchAll(requests);
        }
        catch (e) {
            return UrlFetchResult.createErrorResult(e);
        }
        const result = new UrlFetchResult();
        for (let i = 0; i < length; i++) {
            streams[i].setRawResponse(responses[i]);
            if (streams[i].hasError) {
                result.errors.push(streams[i].error);
            }
        }
        return result;
    }
}
