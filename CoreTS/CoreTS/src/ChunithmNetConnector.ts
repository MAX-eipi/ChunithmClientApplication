const TIME_OUT = 10000;

export class ChunithmNetConnector {
    public static post(localPath: string, payload: any): Promise<{}> {
        return new Promise((resolve, reject) => {
            $.ajax({
                type: "post",
                url: ChunithmNetConnector.createUrl(localPath),
                data: payload,
                timeout: TIME_OUT,
            }).done(function (data, textStatus, jqXHR) {
                resolve(data);
            }).fail(function (jqXHR, textStatus, errorThrown) {
                reject("Error occured in ajax connection." + jqXHR.responseText);
            });
        })
    }

    public static createUrl(localPath: string): string {
        return "https://chunithm-net.com/mobile/" + localPath;
    }

    public static getToken(document: Document): string {
        return document.getElementsByName("token")[0].getAttribute("value");
    }
}