import { Service } from "./OAuth1/Service";

export function getInstance(consumer_key: string, consumre_secret: string): ITwitterWebService {
    return null;
}

export interface ITwitterWebService {
    getService(): Service;
    authorize(): void;
    reset(): void;
    authCallback(request: object): void;
}