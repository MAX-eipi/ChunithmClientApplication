import { ConfirmationDialog, Filter, Option, OptionGroup, Text } from "./CompositionObjects";

export class CompositionObjectFactory {
    public static plainText(text: string, emoji?: boolean): Text {
        const ret: Text = {
            type: 'plain_text',
            text: text,
        };
        if (emoji) ret.emoji = emoji;
        return ret;
    }

    public static markdownText(text: string, verbatim?: boolean): Text {
        const ret: Text = {
            type: 'mrkdwn',
            text: text,
        };
        if (verbatim) ret.verbatim = verbatim;
        return ret;
    }

    public static confirmationDialog(title: Text, text: Text, confirm: Text, deny: Text, style?: string): ConfirmationDialog {
        const ret: ConfirmationDialog = {
            title: title,
            text: text,
            confirm: confirm,
            deny: deny,
        };
        if (style) ret.style = style;
        return ret;
    }

    public static option(text: Text, value: string, description?: Text, url?: string): Option {
        const ret: Option = {
            text: text,
            value: value,
        };
        if (description) ret.description = description;
        if (url) ret.url = url;
        return ret;
    }

    public static optionGroup(label: Text, options: Option[]): OptionGroup {
        return {
            label: label,
            options: options,
        };
    }

    public static filter(include?: string[], excludeExternalSharedChannels?: boolean, excludeBotUsers?: boolean): Filter {
        const ret: Filter = {};
        if (include) ret.include = include;
        if (excludeExternalSharedChannels) ret.exclude_external_shared_channels = excludeExternalSharedChannels;
        if (excludeBotUsers) ret.exclude_bot_users = excludeBotUsers;
        return ret;
    }
}
