import { UrlFetchRequest, UrlFetchResponse } from "../../UrlFetch/UrlFetch";

export interface LINERequest extends UrlFetchRequest {
    channelAccessToken: string;
}

export interface LINEResponse extends UrlFetchResponse {
    statusCode: number;
    message?: string;
    details?: { message: string; property: string }[];
}
