const URL = "https://script.google.com/macros/s/AKfycbw1gWsX0uk-Zz6FHLLAEciYI5aalPsn0XZhXXKRc9rNmC9wfhU/exec";
const TIME_OUT = 10000;

export class ChunithmMusicDatabaseConnector {
    public static post(payload: any): Promise<{}> {
        return new Promise((resolve, reject) => {
            $.ajax({
                type: "post",
                url: URL,
                data: JSON.stringify(payload),
                timeout: TIME_OUT,
            }).done(function (data, textStatus, jqXHR) {
                resolve(data);
            }).fail(function (jqXHR, textStatus, errorThrown) {
                reject("Error occured in ajax connection." + jqXHR.responseText);
            });
        })
    }
}