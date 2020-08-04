import * as UrlFetch from "../../../../UrlFetch/UrlFetch";
import { Attachment } from "../../../BlockElements";
import { Section, Block } from "../../../Blocks";

export interface Request extends UrlFetch.Request {
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

export interface Response extends UrlFetch.Response {
    readonly ok: boolean;
    readonly error?: string;
    readonly channel?: string;
    readonly ts?: string;
    readonly message?: Record<string, any>;
}
