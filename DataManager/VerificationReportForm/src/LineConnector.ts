export class LineConnector {
    private channelAccessToken: string;
    private noticeTargetIds: string[];

    public constructor(channelAccessToken: string, noticeTargetIds: string[]) {
        this.channelAccessToken = channelAccessToken;
        this.noticeTargetIds = noticeTargetIds;
    }

    private getHeader(): object {
        return {
            'Content-Type': 'application/json; charset=UTF-8',
            'Authorization': 'Bearer ' + this.channelAccessToken,
        }
    }

    public pushTextMessage(messages: string[]) {
        let endpoint = "https://api.line.me/v2/bot/message/push";
        let send_messages = messages.map(function (v) {
            return { 'type': 'text', 'text': v }
        });

        for (var i = 0; i < this.noticeTargetIds.length; i++) {
            let noticeTargetId = this.noticeTargetIds[i];
            UrlFetchApp.fetch(endpoint, {
                'headers': this.getHeader(),
                'method': 'post',
                'payload': JSON.stringify({
                    'to': noticeTargetId,
                    'messages': send_messages,
                }),
            });
        }
    }

    public replyTextMessage(replyToken: string, messages: string[]) {
        let endpoint = "https://api.line.me/v2/bot/message/reply";
        let send_messages = messages.map(function (v) {
            return { 'type': 'text', 'text': v }
        });

        UrlFetchApp.fetch(endpoint, {
            'headers': this.getHeader(),
            'method': 'post',
            'payload': JSON.stringify({
                'replyToken': replyToken,
                'messages': send_messages,
            }),
        });
    }
}