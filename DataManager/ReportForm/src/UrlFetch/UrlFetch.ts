export interface UrlFetchRequest { }

export interface UrlFetchResponse { }

export interface Stream {
    getRawRequest(): GoogleAppsScript.URL_Fetch.URLFetchRequest;
    setRawResponse(response: GoogleAppsScript.URL_Fetch.HTTPResponse): void;
    readonly hasError: boolean;
    readonly error: string;
}

export interface ConcreteStream<TRequest extends UrlFetchRequest, TResponse extends UrlFetchResponse>
    extends Stream {
    readonly request: TRequest;
    readonly response: TResponse;
}

export interface Result {
    readonly hasError: boolean;
    readonly errors: string[];
}
