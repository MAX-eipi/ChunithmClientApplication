import { Connector } from "./Connector";

(async function () {
    let connector = new Connector(Connector.RELEASE_URL);
    var tableGetResult = await connector.post({ API: "table/get" });
    if (tableGetResult) {
        alert("楽曲リストの取得に成功しました");
        console.log(tableGetResult);
    }
    else {
        alert("楽曲リストの取得に失敗しました");
    }
})();