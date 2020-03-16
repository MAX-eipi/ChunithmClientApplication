import * as TwitterWebService from "../../Dependencies/TwitterWebService";

export class TwitterConnector {
    private twitter: TwitterWebService.ITwitterWebService;

    public constructor(apiToken: string, secretKey: string) {
        this.twitter = TwitterWebService.getInstance(apiToken, secretKey);
    }

    public authorize() {
        this.twitter.authorize();
    }

    public authCallback(request: any): any {
        return this.twitter.authCallback(request);
    }

    public postTweet(message: string): any {
        var service = this.twitter.getService();
        var endPointUrl = 'https://api.twitter.com/1.1/statuses/update.json';
        var response = service.fetch(endPointUrl, {
            method: 'post',
            payload: {
                status: message
            }
        });
        return response;
    }
}