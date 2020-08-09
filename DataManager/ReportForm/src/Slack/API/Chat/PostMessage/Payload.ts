import { Attachment } from "../../BlockElements";
import { Section, Block } from "../../Blocks";
import { UrlFetchRequest, UrlFetchResponse } from "../../../../UrlFetch/UrlFetch";

export interface Request extends UrlFetchRequest {
    token: string;
    channel: string;
    text: string;
    as_suser?: boolean;
    attachments?: Attachment[];
    blocks?: (Block | Section)[];
    icon_emobj?: string;
    icon_url?: string;
    link_names?: boolean;
    mrkdwn?: boolean;
    parse?: string;
    reply_broadcast?: boolean;
    thread_ts?: string;
    unfurl_links?: boolean;
    unfurl_media?: boolean;
    username?: boolean;
}

export interface Response extends UrlFetchResponse {
    readonly ok: boolean;
    readonly error?: string;
    readonly channel?: string;
    readonly ts?: string;
    readonly message?: Record<string, any>;
}

export type SlackChatPostMessageRequest = Request;
export type SlackChatPostMessageResponse = Response;
