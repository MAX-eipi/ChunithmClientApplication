export class Connector {
    public static readonly DEVELOP_URL: string = "https://script.google.com/macros/s/AKfycbxujx4njFMXtNUKkzvCHIMz21RPt2F74XSzS5xgy9gkoFQ9l4A/exec";
    public static readonly RELEASE_URL: string = "https://script.google.com/macros/s/AKfycbwAOxPF2cTkx8yIYUL_0kf_Nd7zdzdulbVVQZs6z69wiMKwEutD/exec";
    private static readonly TIME_OUT: number = 10000;
    
    private url: string;
    
    public constructor(url: string) {
        this.url = url;
    }
    
    public post(payload: any): Promise<any> {
        return new Promise((resolve, reject) => {
            $.ajax({
                type: "post",
                url: this.url,
                data: JSON.stringify(payload),
                timeout: Connector.TIME_OUT,
            }).done(function (data, textStatus, jqXHR) {
                resolve(data);
            }).fail(function (jqXHR, textStatus, errorThrown) {
                reject("Error occured in ajax connection." + jqXHR.responseText);
            });
        })
    }
}