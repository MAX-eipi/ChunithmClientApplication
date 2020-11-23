import { LINEMessagePushStream } from "../../../LINE/API/Message/Push/Stream";
import { TextMessage } from "../../../LINE/API/MessageObjects";
import { Difficulty } from "../../../MusicDataTable/Difficulty";
import { Block } from "../../../Slack/API/Blocks";
import { SlackChatPostMessageStream } from "../../../Slack/API/Chat/PostMessage/Stream";
import { SlackBlockFactory } from "../../../Slack/BlockFactory";
import { SlackCompositionObjectFactory } from "../../../Slack/CompositionObjectFactory";
import { UrlFetchStream } from "../../../UrlFetch/UrlFetch";
import { UrlFetchManager } from "../../../UrlFetch/UrlFetchManager";
import { ApprovalPage } from "../../Page/ApprovalPage";
import { IReport } from "../../Report/IReport";
import { LevelBulkReport } from "../../Report/LevelBulkReport/LevelBulkReport";
import { Utility } from "../../Utility";
import { ReportFormModule } from "../@ReportFormModule";
import { TwitterModule } from "../TwitterModule";
import { NoticeQueue } from "./NoticeQueue";
import { CacheServiceProvider } from "../../../Cache/CacheServiceProvider";

export class NoticeModule extends ReportFormModule {
    public static readonly moduleName = 'notice';

    private _queue: NoticeQueue;
    public getQueue(): NoticeQueue {
        if (!this._queue) {
            this._queue = new NoticeQueue(new CacheServiceProvider());
        }
        return this._queue;
    }

    public noticeCreateUnitReport(versionName: string, reportIds: number[]): void {
        if (reportIds.length === 0) {
            return;
        }
        const reports: IReport[] = [];
        const missingReportIds: number[] = [];
        for (const id of reportIds) {
            const r = this.report.getReport(versionName, id);
            if (r) {
                reports.push(r);
            }
            else {
                missingReportIds.push(id);
            }
        }

        const errors: Error[] = [];

        // 通知処理
        // slack
        {
            const blocks: Block[] = [];
            blocks.push(SlackBlockFactory.section(
                SlackCompositionObjectFactory.markdownText(`:mailbox_with_mail: *新規単曲検証報告(${reports.length}件)*`)
            ));
            for (const r of reports) {
                const diffText = Utility.toDifficultyText(r.difficulty);
                const url = this.router.getPage(ApprovalPage).getReportPageUrl(versionName, r.reportId);
                blocks.push(SlackBlockFactory.section(
                    SlackCompositionObjectFactory.markdownText(`<${url}|:chunithm_difficulty_${diffText}: ${r.musicName}>`)
                ));
            }
            const stream = new SlackChatPostMessageStream({
                token: this.config.global.slackApiToken,
                channel: this.config.global.slackChannelIdTable['noticeUpdateReportStatus'],
                text: '検証結果報告',
                blocks: blocks,
            });
            try {
                UrlFetchManager.execute([stream]);
            }
            catch (e) {
                errors.push(e);
            }
        }

        // line
        if (this.config.line.reportPostNoticeEnabled) {
            const streams: LINEMessagePushStream[] = [];
            for (const r of reports) {
                // LINEグループに対しては低難易度帯の報告を投げない
                if (r.difficulty !== Difficulty.Master && (r.difficulty !== Difficulty.Expert || r.calcBaseRating() < 11)) {
                    continue;
                }
                const message: TextMessage = {
                    type: 'text',
                    text: `[単曲検証報告]
楽曲名:${r.musicName}
難易度:${Utility.toDifficultyText(r.difficulty)}
URL:${this.module.router.getPage(ApprovalPage).getReportPageUrl(versionName, r.reportId)}`
                };
                for (const target of this.config.global.lineNoticeTargetIdList) {
                    streams.push(new LINEMessagePushStream({
                        channelAccessToken: this.config.global.lineChannelAccessToken,
                        to: target,
                        messages: [message]
                    }));
                }
            }
            try {
                UrlFetchManager.execute(streams);
            }
            catch (e) {
                errors.push(e);
            }
        }

        this.noticeMissingUnitReports(missingReportIds);
        this.noticeErrors(errors);
    }
    public noticeApproveUnitReport(versionName: string, reportIds: number[]): void {
        if (reportIds.length === 0) {
            return;
        }
        const reports: IReport[] = [];
        const missingReportIds: number[] = [];
        for (const id of reportIds) {
            const r = this.report.getReport(versionName, id);
            if (r) {
                reports.push(r);
            }
            else {
                missingReportIds.push(id);
            }
        }

        const errors: Error[] = [];

        // 通知処理
        // twitter
        if (this.config.twitter.postTweetEnabled) {
            for (const r of reports) {
                this.getModule(TwitterModule).postTweet(`[譜面定数 検証結果]
楽曲名:${r.musicName}
難易度:${Utility.toDifficultyText(r.difficulty)}
譜面定数:${r.calcBaseRating().toFixed(1)}

バージョン:${this.version.getVersionConfig(versionName).displayVersionName}`);
            }
        }

        // slack-結果承認
        {
            const streams: UrlFetchStream[] = [];
            // 結果承認
            {
                const blocks: Block[] = [];
                blocks.push(SlackBlockFactory.section(
                    SlackCompositionObjectFactory.markdownText(`:o: *単曲検証報告 承認(${reports.length}件)*`)
                ));
                for (const r of reports) {
                    const diffText = Utility.toDifficultyText(r.difficulty);
                    const url = this.router.getPage(ApprovalPage).getReportPageUrl(versionName, r.reportId);
                    blocks.push(SlackBlockFactory.section(
                        SlackCompositionObjectFactory.markdownText(`<${url}|:chunithm_difficulty_${diffText}: ${r.musicName}>`)
                    ));
                }
                const stream = new SlackChatPostMessageStream({
                    token: this.config.global.slackApiToken,
                    channel: this.config.global.slackChannelIdTable['noticeUpdateReportStatus'],
                    text: '検証結果承認',
                    blocks: blocks,
                });
                streams.push(stream);
            }
            // 定数表更新
            {
                const blocks: Block[] = [];
                blocks.push(SlackBlockFactory.section(
                    SlackCompositionObjectFactory.markdownText(`:pushpin: *譜面定数更新(${reports.length}件)*`)
                ));
                for (const r of reports) {
                    const diffText = Utility.toDifficultyText(r.difficulty);
                    blocks.push(SlackBlockFactory.section(
                        SlackCompositionObjectFactory.markdownText(`:chunithm_difficulty_${diffText}: ${r.musicName}
:arrow_right: 譜面定数: ${r.calcBaseRating().toFixed(1)}`)
                    ));
                }
                const stream = new SlackChatPostMessageStream({
                    token: this.config.global.slackApiToken,
                    channel: this.config.global.slackChannelIdTable['updateMusicDataTable'],
                    text: '譜面定数更新',
                    blocks: blocks,
                });
                streams.push(stream);
            }

            try {
                UrlFetchManager.execute(streams);
            }
            catch (e) {
                errors.push(e);
            }
        }

        // line
        if (this.config.line.reportPostNoticeEnabled) {
            const streams: LINEMessagePushStream[] = [];
            for (const r of reports) {
                if (r.difficulty !== Difficulty.Master && (r.difficulty !== Difficulty.Expert || r.calcBaseRating() < 11)) {
                    continue;
                }
                const message: TextMessage = {
                    type: 'text',
                    text: `⭕️[単曲検証報告 承認]⭕️
楽曲名:${r.musicName}
難易度:${Utility.toDifficultyText(r.difficulty)}
譜面定数:${r.calcBaseRating().toFixed(1)}
URL:${this.module.router.getPage(ApprovalPage).getReportPageUrl(versionName, r.reportId)}`
                };
                for (const target of this.config.global.lineNoticeTargetIdList) {
                    streams.push(new LINEMessagePushStream({
                        channelAccessToken: this.config.global.lineChannelAccessToken,
                        to: target,
                        messages: [message]
                    }));
                }
            }
            try {
                UrlFetchManager.execute(streams);
            }
            catch (e) {
                errors.push(e);
            }
        }

        this.noticeMissingUnitReports(missingReportIds);
        this.noticeErrors(errors);
    }
    public noticeRejectUnitReport(versionName: string, reportIds: number[]): void {
        if (reportIds.length === 0) {
            return;
        }
        const reports: IReport[] = [];
        const missingReportIds: number[] = [];
        for (const id of reportIds) {
            const r = this.report.getReport(versionName, id);
            if (r) {
                reports.push(r);
            }
            else {
                missingReportIds.push(id);
            }
        }

        const errors: Error[] = [];

        // 通知処理
        // slack
        {
            const blocks: Block[] = [];
            blocks.push(SlackBlockFactory.section(
                SlackCompositionObjectFactory.markdownText(`:x: *報告結果却下(${reports.length}件)*`)
            ));
            for (const r of reports) {
                const diffText = Utility.toDifficultyText(r.difficulty);
                const url = this.router.getPage(ApprovalPage).getReportPageUrl(versionName, r.reportId);
                blocks.push(SlackBlockFactory.section(
                    SlackCompositionObjectFactory.markdownText(`<${url}|:chunithm_difficulty_${diffText}: ${r.musicName}>`)
                ));
            }
            const stream = new SlackChatPostMessageStream({
                token: this.config.global.slackApiToken,
                channel: this.config.global.slackChannelIdTable['noticeUpdateReportStatus'],
                text: '検証結果却下',
                blocks: blocks,
            });

            try {
                UrlFetchManager.execute([stream]);
            }
            catch (e) {
                errors.push(e);
            }
        }

        // line
        if (this.config.line.reportPostNoticeEnabled) {
            const streams: LINEMessagePushStream[] = [];
            for (const r of reports) {
                if (r.difficulty !== Difficulty.Master && (r.difficulty !== Difficulty.Expert || r.calcBaseRating() < 11)) {
                    continue;
                }
                const message: TextMessage = {
                    type: 'text',
                    text: `✖️[検証結果 却下]✖️
楽曲名:${r.musicName}
難易度:${Utility.toDifficultyText(r.difficulty)}
URL:${this.module.router.getPage(ApprovalPage).getReportPageUrl(versionName, r.reportId)}`
                };
                for (const target of this.config.global.lineNoticeTargetIdList) {
                    streams.push(new LINEMessagePushStream({
                        channelAccessToken: this.config.global.lineChannelAccessToken,
                        to: target,
                        messages: [message]
                    }));
                }
            }
            try {
                UrlFetchManager.execute(streams);
            }
            catch (e) {
                errors.push(e);
            }
        }

        this.noticeMissingUnitReports(missingReportIds);
        this.noticeErrors(errors);
    }
    private noticeMissingUnitReports(reportIds: number[]): void {
        if (!reportIds || reportIds.length === 0) {
            return
        }

        let idsText = '';
        for (const id of reportIds) {
            if (idsText) {
                idsText += ',' + id;
            }
            else {
                idsText = id.toString();
            }
        }
        const stream = new SlackChatPostMessageStream({
            token: this.config.global.slackApiToken,
            channel: this.config.global.slackChannelIdTable['alert'],
            text: 'Missing Report',
            blocks: [
                SlackBlockFactory.section(
                    SlackCompositionObjectFactory.markdownText(`:error: 単曲検証報告の取得に失敗しました\nreport id(s):[${idsText}]`)
                )
            ],
        });
        try {
            UrlFetchManager.execute([stream]);
        }
        catch (e) {
            console.error(e);
        }
    }

    public noticeCreateLevelReport(versionName: string, reportIds: number[]): void {
        if (reportIds.length === 0) {
            return;
        }
        const reports: LevelBulkReport[] = [];
        const missingReportIds: number[] = [];
        for (const id of reportIds) {
            const r = this.report.getLevelBulkReportSheet(versionName).getBulkReport(id);
            if (r) {
                reports.push(r);
            }
            else {
                missingReportIds.push(id);
            }
        }

        const errors: Error[] = [];

        // 通知処理
        // slack
        {
            const blocks: Block[] = [];
            blocks.push(SlackBlockFactory.section(
                SlackCompositionObjectFactory.markdownText(`:mailbox_with_mail: *新規レベル検証報告(${reports.length}件)*`)
            ));
            for (const r of reports) {
                const difficulty = r.targetLevel >= 4 ? Difficulty.Advanced : Difficulty.Basic;
                const diffText = Utility.toDifficultyText(difficulty);
                const url = this.router.getPage(ApprovalPage).getReportPageUrl(versionName, r.reportId);
                blocks.push(SlackBlockFactory.section(
                    SlackCompositionObjectFactory.markdownText(`<${url}|:chunithm_difficulty_${diffText}: Lv.${r.targetLevel} (${r.musicCount}曲)>`)
                ));
            }
            const stream = new SlackChatPostMessageStream({
                token: this.config.global.slackApiToken,
                channel: this.config.global.slackChannelIdTable['noticeUpdateReportStatus'],
                text: '検証結果報告',
                blocks: blocks,
            });
            try {
                UrlFetchManager.execute([stream]);
            }
            catch (e) {
                errors.push(e);
            }
        }

        // LINEグループに対しては低難易度帯の報告を投げない
        // line
        //        if (this.config.line.reportPostNoticeEnabled) {
        //            const streams: LINEMessagePushStream[] = [];
        //            for (const r of reports) { 
        //                const message: TextMessage = {
        //                    type: 'text',
        //                    text: `[レベル検証報告]
        //対象レベル:${r.targetLevel}
        //楽曲数:${r.musicCount}
        //URL:${this.module.router.getPage(LevelBulkApprovalPage).getReportPageUrl(versionName, r.reportId)}`
        //                };
        //                for (const target of this.config.global.lineNoticeTargetIdList) {
        //                    streams.push(new LINEMessagePushStream({
        //                        channelAccessToken: this.config.global.lineChannelAccessToken,
        //                        to: target,
        //                        messages: [message]
        //                    }));
        //                }
        //            }
        //            try {
        //                UrlFetchManager.execute(streams);
        //            }
        //            catch (e) {
        //                errors.push(e);
        //            }
        //        }

        this.noticeMissingLevelReports(missingReportIds);
        this.noticeErrors(errors);
    }
    public noticeApproveLevelReport(versionName: string, reportIds: number[]): void {
        if (reportIds.length === 0) {
            return;
        }
        const reports: LevelBulkReport[] = [];
        const missingReportIds: number[] = [];
        for (const id of reportIds) {
            const r = this.report.getLevelBulkReportSheet(versionName).getBulkReport(id);
            if (r) {
                reports.push(r);
            }
            else {
                missingReportIds.push(id);
            }
        }

        const errors: Error[] = [];

        // 通知処理
        // slack-結果承認
        {
            const streams: UrlFetchStream[] = [];
            // 結果承認
            {
                const blocks: Block[] = [];
                blocks.push(SlackBlockFactory.section(
                    SlackCompositionObjectFactory.markdownText(`:o: *レベル検証報告 承認(${reports.length}件)*`)
                ));
                for (const r of reports) {
                    const difficulty = r.targetLevel >= 4 ? Difficulty.Advanced : Difficulty.Basic;
                    const diffText = Utility.toDifficultyText(difficulty);
                    const url = this.router.getPage(ApprovalPage).getReportPageUrl(versionName, r.reportId);
                    blocks.push(SlackBlockFactory.section(
                        SlackCompositionObjectFactory.markdownText(`<${url}|:chunithm_difficulty_${diffText}: Lv.${r.targetLevel} (${r.musicCount}曲)>`)
                    ));
                }
                const stream = new SlackChatPostMessageStream({
                    token: this.config.global.slackApiToken,
                    channel: this.config.global.slackChannelIdTable['noticeUpdateReportStatus'],
                    text: '検証結果承認',
                    blocks: blocks,
                });
                streams.push(stream);
            }
            // 定数表更新
            {
                const blocks: Block[] = [];
                blocks.push(SlackBlockFactory.section(
                    SlackCompositionObjectFactory.markdownText(`:pushpin: *譜面定数更新(${reports.length}件)*`)
                ));
                for (const r of reports) {
                    const difficulty = r.targetLevel >= 4 ? Difficulty.Advanced : Difficulty.Basic;
                    const diffText = Utility.toDifficultyText(difficulty);
                    blocks.push(SlackBlockFactory.section(
                        SlackCompositionObjectFactory.markdownText(`:chunithm_difficulty_${diffText}: Lv.${r.targetLevel} (${r.musicCount}曲)`)
                    ));
                }
                const stream = new SlackChatPostMessageStream({
                    token: this.config.global.slackApiToken,
                    channel: this.config.global.slackChannelIdTable['updateMusicDataTable'],
                    text: '譜面定数更新',
                    blocks: blocks,
                });
                streams.push(stream);
            }

            try {
                UrlFetchManager.execute(streams);
            }
            catch (e) {
                errors.push(e);
            }
        }

        // LINEグループに対しては低難易度帯の報告を投げない
        // line
        //        if (this.config.line.reportPostNoticeEnabled) {
        //            const streams: LINEMessagePushStream[] = [];
        //            for (const r of reports) {
        //                const message: TextMessage = {
        //                    type: 'text',
        //                    text: `⭕️[レベル検証報告 承認]⭕️
        //対象レベル:${r.targetLevel}
        //楽曲数:${r.musicCount}
        //URL:${this.module.router.getPage(LevelBulkApprovalPage).getReportPageUrl(versionName, r.reportId)}`
        //                };
        //                for (const target of this.config.global.lineNoticeTargetIdList) {
        //                    streams.push(new LINEMessagePushStream({
        //                        channelAccessToken: this.config.global.lineChannelAccessToken,
        //                        to: target,
        //                        messages: [message]
        //                    }));
        //                }
        //            }
        //            try {
        //                UrlFetchManager.execute(streams);
        //            }
        //            catch (e) {
        //                errors.push(e);
        //            }
        //        }

        this.noticeMissingLevelReports(missingReportIds);
        this.noticeErrors(errors);
    }
    public noticeRejectLevelReport(versionName: string, reportIds: number[]): void {
        if (reportIds.length === 0) {
            return;
        }
        const reports: LevelBulkReport[] = [];
        const missingReportIds: number[] = [];
        for (const id of reportIds) {
            const r = this.report.getLevelBulkReportSheet(versionName).getBulkReport(id);
            if (r) {
                reports.push(r);
            }
            else {
                missingReportIds.push(id);
            }
        }

        const errors: Error[] = [];

        // 通知処理
        // slack
        {
            const blocks: Block[] = [];
            blocks.push(SlackBlockFactory.section(
                SlackCompositionObjectFactory.markdownText(`:x: *レベル検証報告 却下(${reports.length}件)*`)
            ));
            for (const r of reports) {
                const difficulty = r.targetLevel >= 4 ? Difficulty.Advanced : Difficulty.Basic;
                const diffText = Utility.toDifficultyText(difficulty);
                const url = this.router.getPage(ApprovalPage).getReportPageUrl(versionName, r.reportId);
                blocks.push(SlackBlockFactory.section(
                    SlackCompositionObjectFactory.markdownText(`<${url}|:chunithm_difficulty_${diffText}: Lv.${r.targetLevel} (${r.musicCount}曲)>`)
                ));
            }
            const stream = new SlackChatPostMessageStream({
                token: this.config.global.slackApiToken,
                channel: this.config.global.slackChannelIdTable['noticeUpdateReportStatus'],
                text: '検証結果却下',
                blocks: blocks,
            });

            try {
                UrlFetchManager.execute([stream]);
            }
            catch (e) {
                errors.push(e);
            }
        }

        // LINEグループに対しては低難易度帯の報告を投げない
        // line
        //        if (this.config.line.reportPostNoticeEnabled) {
        //            const streams: LINEMessagePushStream[] = [];
        //            for (const r of reports) {
        //                const message: TextMessage = {
        //                    type: 'text',
        //                    text: `×[レベル検証報告 却下]×
        //対象レベル:${r.targetLevel}
        //楽曲数:${r.musicCount}
        //URL:${this.module.router.getPage(LevelBulkApprovalPage).getReportPageUrl(versionName, r.reportId)}`
        //                };
        //                for (const target of this.config.global.lineNoticeTargetIdList) {
        //                    streams.push(new LINEMessagePushStream({
        //                        channelAccessToken: this.config.global.lineChannelAccessToken,
        //                        to: target,
        //                        messages: [message]
        //                    }));
        //                }
        //            }
        //            try {
        //                UrlFetchManager.execute(streams);
        //            }
        //            catch (e) {
        //                errors.push(e);
        //            }
        //        }

        this.noticeMissingLevelReports(missingReportIds);
        this.noticeErrors(errors);
    }
    private noticeMissingLevelReports(reportIds: number[]): void {
        if (!reportIds || reportIds.length === 0) {
            return
        }

        let idsText = '';
        for (const id of reportIds) {
            if (idsText) {
                idsText += ',' + id;
            }
            else {
                idsText = id.toString();
            }
        }
        const stream = new SlackChatPostMessageStream({
            token: this.config.global.slackApiToken,
            channel: this.config.global.slackChannelIdTable['alert'],
            text: 'Missing Report',
            blocks: [
                SlackBlockFactory.section(
                    SlackCompositionObjectFactory.markdownText(`:error: レベル検証報告の取得に失敗しました\nreport id(s):[${idsText}]`)
                )
            ],
        });
        try {
            UrlFetchManager.execute([stream]);
        }
        catch (e) {
            console.error(e);
        }
    }

    private noticeErrors(errors: Error[]): void {
        if (!errors || errors.length === 0) {
            return;
        }

        const blocks: Block[] = [];
        blocks.push(SlackBlockFactory.section(
            SlackCompositionObjectFactory.markdownText(`:error: *実行時エラー(${errors.length}件)*`)
        ));
        blocks.push(SlackBlockFactory.divider());
        for (const e of errors) {
            blocks.push(SlackBlockFactory.section(
                SlackCompositionObjectFactory.markdownText(`*[Message]*\n${e.message}`)
            ));
            blocks.push(SlackBlockFactory.section(
                SlackCompositionObjectFactory.markdownText('*[StackTrace]*\n```' + e.stack + '```')
            ));
            blocks.push(SlackBlockFactory.divider());
        }
        const stream = new SlackChatPostMessageStream({
            token: this.config.global.slackApiToken,
            channel: this.config.global.slackChannelIdTable['alert'],
            text: 'Error(s) occurred',
            blocks: blocks,
        })
        try {
            UrlFetchManager.execute([stream]);
        }
        catch (e) {
            console.error(e);
        }
    }
}
