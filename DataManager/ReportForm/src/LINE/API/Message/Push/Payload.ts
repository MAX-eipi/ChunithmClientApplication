import { MessageObject } from "../../MessageObjects";
import { LINERequest, LINEResponse } from "../../LINEPayload";

export interface Request extends LINERequest {
    to: string;
    messages: MessageObject[];
    notificationDisabled?: boolean;
}

export interface Response extends LINEResponse {
}

export type LINEMessagePushRequest = Request;
export type LINEMessagePushResponse = Response;
