import { MusicData, MusicDataParameter } from "../../MusicDataTable/MusicData";
import { PostCommand, PostCommandParameter } from "./@PostCommand";
import { WebhookEventName } from "../Dependencies/WebhookEventDefinition";
import { UrlFetchManager } from "../../UrlFetch/UrlFetchManager";
import { BlockFactory } from "../../Slack/BlockFactory";
import { BlockElementFactory } from "../../Slack/BlockElementFactory";
import { CompositionObjectFactory } from "../../Slack/CompositionObjectFactory";
import { ChatPostMessage } from "../../Slack/API/Stream/PostMessage";

interface TableUpdateCommandParameter extends PostCommandParameter {
    MusicDatas: MusicDataParameter[];
}

export class TableUpdateCommand extends PostCommand {
    called(api: string): boolean {
        return api == "table/update";
    }

    invoke(api: string, postData: TableUpdateCommandParameter): any {
        let oldMusicDatas = this.module.musicData.getTable(postData.versionName).datas;
        let musicDataTable = this.module.musicData.updateTable(postData.versionName, postData.MusicDatas);
        let response = {
            MusicDataTable: {
                MusicDatas: musicDataTable.getTable(),
            }
        }

        const addedMusicDatas = this.getAddedMusicDatas(oldMusicDatas, musicDataTable.getTable());

        if (addedMusicDatas.length > 0) {
            const musicCounts = this.setMusicList(postData.versionName, musicDataTable.datas);
            if (oldMusicDatas.length > 0) {
                let message = "[新曲追加]";
                for (let i = 0; i < addedMusicDatas.length; i++) {
                    const m = addedMusicDatas[i];
                    const basicLevelText = m.BasicLevel.toString().replace(".7", "+");
                    const advancedLevelText = m.AdvancedLevel.toString().replace(".7", "+");
                    const expertLevelText = m.ExpertLevel.toString().replace(".7", "+");
                    const masterLevelText = m.MasterLevel.toString().replace(".7", "+");
                    message += `
${m.Name} ${basicLevelText}/${advancedLevelText}/${expertLevelText}/${masterLevelText}`;
                }
                this.module.line.notice.pushTextMessage([message]);
                this.module.twitter.postTweet(message);

                let slackMessage = `:musical_keyboard: *新曲追加* (${addedMusicDatas.length}曲)`;
                for (let i = 0; i < addedMusicDatas.length; i++) {
                    const m = addedMusicDatas[i];
                    const basicLevelText = m.BasicLevel.toString().replace(".7", "+");
                    const advancedLevelText = m.AdvancedLevel.toString().replace(".7", "+");
                    const expertLevelText = m.ExpertLevel.toString().replace(".7", "+");
                    const masterLevelText = m.MasterLevel.toString().replace(".7", "+");
                    slackMessage += `
${i + 1}. ${m.Name} ${basicLevelText}/${advancedLevelText}/${expertLevelText}/${masterLevelText}`;
                }
                UrlFetchManager.execute([
                    new ChatPostMessage({
                        token: this.module.config.global.slackApiToken,
                        channel: this.module.config.global.slackChannelIdTable['updateMusicDataTable'],
                        text: `新曲追加(${addedMusicDatas.length}曲)`,
                        blocks: [
                            BlockFactory.section(
                                CompositionObjectFactory.markdownText(
                                    slackMessage
                                )
                            )
                        ]
                    })
                ]);

                this.module.webhook.invoke(WebhookEventName.ON_UPDATE_TABLE);
            }
            else {
                let message = '[新規定数表作成]\n';
                for (const genre in musicCounts) {
                    message += `${genre}: ${musicCounts[genre]}\n`;
                }
                this.module.line.notice.pushTextMessage([message]);
                this.module.twitter.postTweet(message);

                let slackMessage = ':musical_keyboard: *新規定数表作成*';
                for (const genre in musicCounts) {
                    slackMessage += `
${genre}: ${musicCounts[genre]}曲`;
                }
                UrlFetchManager.execute([
                    new ChatPostMessage({
                        token: this.module.config.global.slackApiToken,
                        channel: this.module.config.global.slackChannelIdTable['updateMusicDataTable'],
                        text: `新規定数表作成`,
                        blocks: [
                            BlockFactory.section(
                                CompositionObjectFactory.markdownText(
                                    slackMessage
                                )
                            )
                        ]
                    })
                ]);

                this.module.webhook.invoke(WebhookEventName.ON_UPDATE_TABLE);
            }
        }

        return response;
    }

    private getAddedMusicDatas(oldMusicDatas: MusicData[], newMusicDatas: MusicData[]): MusicData[] {
        let oldMusicIds: { [key: string]: boolean } = {};
        for (var i = 0; i < oldMusicDatas.length; i++) {
            oldMusicIds[oldMusicDatas[i].Id.toString()] = true;
        }

        var added: MusicData[] = [];
        for (var i = 0; i < newMusicDatas.length; i++) {
            let musicData = newMusicDatas[i];
            if (!oldMusicIds[musicData.Id.toString()]) {
                added.push(musicData);
            }
        }
        return added;
    }

    private setMusicList(versionName: string, musicDatas: MusicData[]): { [genre: string]: number } {
        var form = this.module.report.reportGoogleForm;
        var list = form.getItems(FormApp.ItemType.LIST);

        let genres = this.module.version.getVersionConfig(versionName).genres;
        genres.push("ALL");
        let musicCounts: { [genre: string]: number } = {};
        for (var i = 0; i < genres.length; i++) {
            let genre = genres[i];
            let musicList = list[i + 1].asListItem();
            let filteredMusicDatas = musicDatas.filter(function (m) { return genre == "ALL" ? true : m.Genre == genre; });
            if (filteredMusicDatas.length > 0) {
                musicList.setChoiceValues(filteredMusicDatas.map(function (m) { return m.Name; }));
            }
            else {
                musicList.setChoiceValues([""]);
            }
            musicCounts[genre] = filteredMusicDatas.length;
        }
        return musicCounts;
    }
}
