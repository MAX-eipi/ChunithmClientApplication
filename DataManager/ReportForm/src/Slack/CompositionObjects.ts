export interface Text {
    type: string;
    text: string;
    emoji?: boolean;
    verbatim?: boolean;
}

export interface ConfirmationDialog {
    title: Text;
    text: Text;
    confirm: Text;
    deny: Text;
    style?: string;
}

export interface Option {
    text: Text;
    value: string;
    description?: Text;
    url?: string;
}

export interface OptionGroup {
    label: Text;
    options: Option[];
}

export interface Filter {
    include?: string[];
    exclude_external_shared_channels?: boolean;
    exclude_bot_users?: boolean;
}
