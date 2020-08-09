
export interface MessageObject {
    sender?: Sender;
}

export interface Sender {
    name?: string;
    iconUrl: string;
}

export interface TextMessage extends MessageObject {
    type: string;
    text: string;
    emojis?: { index: number; productId: string; emojiId: string }[];
}

export interface StampMessage extends MessageObject {
    type: string;
    packageId: string;
    stickerId: string;
}

export interface ImageMessage extends MessageObject {
    type: string;
    originalContentUrl: string;
    previewImageUrl: string;
}

export interface VideoMessage extends MessageObject {
    type: string;
    originalContentUrl: string;
    previewImageUrl: string;
    trackingId?: string;
}

export interface AudioMessage extends MessageObject {
    type: string;
    originalContentUrl: string;
    duration: number;
}

export interface LocationMessage extends MessageObject {
    type: string;
    title: string;
    address: string;
    latitude: number;
    longitude: number;
}
