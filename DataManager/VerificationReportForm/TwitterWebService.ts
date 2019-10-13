export function getInstance(consumer_key: string, consumre_secret: string): ITwitterWebService {
    return new DummyTwitterWebService();
}

export interface ITwitterWebService {
    getService(): any;
    authorize(): void;
    reset(): void;
    authCallback(request: object): void;
}

class DummyTwitterWebService implements ITwitterWebService {

    getService(): any {
        return {};
    }

    authorize(): void {
    }

    reset(): void {
    }

    authCallback(request: object): void {
    }
}