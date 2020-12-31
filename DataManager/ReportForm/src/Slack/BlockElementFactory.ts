import * as Elements from "./API/BlockElements";
import * as CompositionObjects from "./API/CompositionObjects";

export class SlackBlockElementFactory {
    public static button(text: CompositionObjects.Text, actionId: string, options: Elements.ButtonOptions = {}): Elements.Button {
        const ret: Elements.Button = {
            type: 'button',
            text: text,
            action_id: actionId,
        };
        this.copyValue(options, ret, [
            'url',
            'value',
            'style',
            'confirm',
        ]);
        return ret;
    }

    public static checkboxGroups(
        actionId: string,
        options: CompositionObjects.Option[],
        extraOptions: Elements.CheckboxGroupsOptions = {}
    ): Elements.CheckboxGroups {
        const ret: Elements.CheckboxGroups = {
            type: 'checkboxes',
            action_id: actionId,
            options: options,
        };
        this.copyValue(extraOptions, ret, [
            'initial_options',
            'confirm',
        ]);
        return ret;
    }

    public static datePicker(actionId: string, options: Elements.DatePickerOptions = {}): Elements.DatePicker {
        const ret: Elements.DatePicker = {
            type: 'datepicker',
            action_id: actionId,
        };
        this.copyValue(options, ret, [
            'placeholder',
            'initial_date',
            'confirm',
        ]);
        return ret;
    }

    public static image(imageUrl: string, altText: string): Elements.Image {
        return {
            type: 'image',
            image_url: imageUrl,
            alt_text: altText,
        };
    }

    public static multiSelectMenuWithStaticOptions(
        placeholder: CompositionObjects.Text,
        actionId: string,
        options: CompositionObjects.Option[],
        extraOptions: Elements.MultiSelectMenuWithStaticOptionsOptions = {}
    ): Elements.MultiSelectMenuWithStaticOptions {
        const ret: Elements.MultiSelectMenuWithStaticOptions = {
            type: 'multi_static_select',
            placeholder: placeholder,
            action_id: actionId,
            options: options,
        };
        this.copyValue(extraOptions, ret, [
            'option_groups',
            'initial_options',
            'confirm',
            'max_selected_items',
        ]);
        return ret;
    }

    public static multiSelectMenuWithExternalDataSource(
        placeholder: CompositionObjects.Text,
        actionId: string,
        options: Elements.MultiSelectMenuWithExternalDataSourceOptions = {}
    ): Elements.MultiSelectMenuWithExternalDataSource {
        const ret: Elements.MultiSelectMenuWithExternalDataSource = {
            type: 'multi_external_select',
            placeholder: placeholder,
            action_id: actionId,
        };
        this.copyValue(options, ret, [
            'min_quest_length',
            'initial_options',
            'confirm',
            'max_selected_items',
        ]);
        return ret;
    }

    public static multiSelectMenuWithUserList(
        placeholder: CompositionObjects.Text,
        actionId: string,
        options: Elements.MultiSelectMenuWithUserListOptions = {}
    ): Elements.MultiSelectMenuWithUserList {
        const ret: Elements.MultiSelectMenuWithUserList = {
            type: 'multi_users_select',
            placeholder: placeholder,
            action_id: actionId,
        };
        this.copyValue(options, ret, [
            'initial_users',
            'confirm',
            'max_selected_items',
        ]);
        return ret;
    }

    public static multiSelectMenuWithConversationsList(
        placeholder: CompositionObjects.Text,
        actionId: string,
        options: Elements.MultiSelectMenuWithConversationsListOptions
    ): Elements.MultiSelectMenuWithConversationsList {
        const ret: Elements.MultiSelectMenuWithConversationsList = {
            type: 'multi_conversations_select',
            placeholder: placeholder,
            action_id: actionId,
        };
        this.copyValue(options, ret, [
            'initial_conversations',
            'default_to_current_conversation',
            'confirm',
            'max_selected_items',
            'filter',
        ]);
        return ret;
    }

    public static multiSelectMenuWithChannelsList(
        placeholder: CompositionObjects.Text,
        actionId: string,
        options: Elements.MultiSelectMenuWithChannelsListOptions = {}
    ): Elements.MultiSelectMenuWithChannelsList {
        const ret: Elements.MultiSelectMenuWithChannelsList = {
            type: 'multi_channels_select',
            placeholder: placeholder,
            action_id: actionId,
        };
        this.copyValue(options, ret, [
            'initial_channels',
            'confirm',
            'max_selected_items',
        ]);
        return ret;
    }

    public static overflowMenu(
        actionId: string,
        options: CompositionObjects.Option[],
        extraOptions: Elements.OverflowMenuOptions = {}
    ): Elements.OverflowMenu {
        const ret: Elements.OverflowMenu = {
            type: 'overflow',
            action_id: actionId,
            options: options,
        };
        this.copyValue(extraOptions, ret, [
            'confirm',
        ]);
        return ret;
    }

    public static plainTextInput(
        actionId: string,
        options: Elements.PlainTextInputOptions = {}
    ): Elements.PlainTextInput {
        const ret: Elements.PlainTextInput = {
            type: 'plain_text_input',
            action_id: actionId,
        };
        this.copyValue(options, ret, [
            'placeholder',
            'initial_value',
            'multiline',
            'min_length',
            'max_length',
        ]);
        return ret;
    }

    public static radioButtonGroup(
        actionId: string,
        options: CompositionObjects.Option[],
        extraOptions: Elements.RadioButtonGroupOptions = {}
    ): Elements.RadioButtonGroup {
        const ret: Elements.RadioButtonGroup = {
            type: 'radio_buttons',
            action_id: actionId,
            options: options,
        };
        this.copyValue(extraOptions, ret, [
            'initial_option',
            'confirm',
        ]);
        return ret;
    }

    public static selectMenuWithStaticOptions(
        placeholder: CompositionObjects.Text,
        actionId: string,
        options: CompositionObjects.Option[],
        extraOptions: Elements.SelectMenuWithStaticOptionsOptions = {}
    ): Elements.SelectMenuWithStaticOptions {
        const ret: Elements.SelectMenuWithStaticOptions = {
            type: 'static_select',
            placeholder: placeholder,
            action_id: actionId,
            options: options,
        };
        this.copyValue(extraOptions, ret, [
            'option_groups',
            'initial_option',
            'confirm',
        ]);
        return ret;
    }

    public static selectMenuWithExternalDataSource(
        placeholder: CompositionObjects.Text,
        actionId: string,
        options: Elements.SelectMenuWithExternalDataSourceOptions = {}
    ): Elements.SelectMenuWithExternalDataSource {
        const ret: Elements.SelectMenuWithExternalDataSource = {
            type: 'external_select',
            placeholder: placeholder,
            action_id: actionId,
        };
        this.copyValue(options, ret, [
            'initial_option',
            'min_query_length',
            'confirm,'
        ]);
        return ret;
    }

    public static selectMenuWithUserList(
        placeholder: CompositionObjects.Text,
        actionId: string,
        options: Elements.SelectMenuWithUserListOptions = {}
    ): Elements.SelectMenuWithUserList {
        const ret: Elements.SelectMenuWithUserList = {
            type: 'users_select',
            placeholder: placeholder,
            action_id: actionId,
        };
        this.copyValue(options, ret, [
            'initial_user',
            'confirm',
        ]);
        return ret;
    }

    public static selectMenuWithConversationsList(
        placeholder: CompositionObjects.Text,
        actionId: string,
        options: Elements.SelectMenuWithConversationsListOptions = {}
    ): Elements.SelectMenuWithConversationsList {
        const ret: Elements.SelectMenuWithConversationsList = {
            type: 'conversations_select',
            placeholder: placeholder,
            action_id: actionId,
        };
        this.copyValue(options, ret, [
            'initial_conversation',
            'default_to_current_conversation',
            'confirm',
            'response_url_enabled',
            'filter',
        ]);
        return ret;
    }

    public static selectMenuWithChannelsList(
        placeholder: CompositionObjects.Text,
        actionId: string,
        options: Elements.SelectMenuWithChannelsListOptions = {}
    ): Elements.SelectMenuWithChannelsList {
        const ret: Elements.SelectMenuWithChannelsList = {
            type: 'channels_select',
            placeholder: placeholder,
            action_id: actionId,
        };
        this.copyValue(options, ret, [
            'initial_channel',
            'confirm',
            'response_url_enabled',
        ]);
        return ret;
    }

    public static attachment(options: Elements.AttachmentOptions = {}): Elements.Attachment {
        const ret: Elements.Attachment = {
        };
        this.copyValue(options, ret, [
            'blocks',
            'color',
        ]);
        return ret;
    }

    private static copyValue<T>(src: T, dist: T, propertyNames: string[]): void {
        if (src) {
            for (const prop of propertyNames) {
                if (prop in src) {
                    dist[prop] = src[prop];
                }
            }
        }
    }
}
