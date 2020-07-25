import * as CompositionObjects from "./CompositionObjects";
import { Block } from "./Blocks";

export interface ElementOptions { }

export interface Element extends ElementOptions {
    type: string;
}

export interface ButtonOptions extends ElementOptions {
    url?: string;
    value?: string;
    style?: string;
    confirm?: CompositionObjects.ConfirmationDialog;
}

export interface Button extends Element, ButtonOptions {
    text: CompositionObjects.Text;
    action_id: string;
}

export interface CheckboxGroupsOptions extends ElementOptions {
    initial_options?: CompositionObjects.Option[];
    confirm?: CompositionObjects.ConfirmationDialog;
}

export interface CheckboxGroups extends Element, CheckboxGroupsOptions {
    action_id: string;
    options: CompositionObjects.Option[];
}

export interface DatePickerOptions extends ElementOptions {
    placeholder?: CompositionObjects.Text;
    initial_date?: string;
    confirm?: CompositionObjects.ConfirmationDialog;
}

export interface DatePicker extends Element, DatePickerOptions {
    action_id: string;
}

export interface ImageOptions extends ElementOptions { }

export interface Image extends Element {
    image_url: string;
    alt_text: string;
}

export interface MultiSelectMenu extends Element { }

export interface MultiSelectMenuWithStaticOptionsOptions extends ElementOptions {
    option_groups?: CompositionObjects.OptionGroup[];
    initial_options?: CompositionObjects.Option[] | CompositionObjects.OptionGroup[];
    confirm?: CompositionObjects.ConfirmationDialog;
    max_selected_items?: number;
}

export interface MultiSelectMenuWithStaticOptions
    extends MultiSelectMenu, MultiSelectMenuWithStaticOptionsOptions {
    placeholder: CompositionObjects.Text;
    action_id: string;
    options: CompositionObjects.Option[];
}

export interface MultiSelectMenuWithExternalDataSourceOptions extends ElementOptions {
    min_quest_length?: number;
    initial_options?: CompositionObjects.Option[] | CompositionObjects.OptionGroup[];
    confirm?: CompositionObjects.ConfirmationDialog;
    max_selected_items?: number;
}

export interface MultiSelectMenuWithExternalDataSource
    extends MultiSelectMenu, MultiSelectMenuWithExternalDataSourceOptions {
    placeholder: CompositionObjects.Text;
    action_id: string;
}

export interface MultiSelectMenuWithUserListOptions extends ElementOptions {
    initial_users?: string[];
    confirm?: CompositionObjects.ConfirmationDialog;
    max_selected_items?: number;
}

export interface MultiSelectMenuWithUserList
    extends MultiSelectMenu, MultiSelectMenuWithUserListOptions {
    placeholder: CompositionObjects.Text;
    action_id: string;
}

export interface MultiSelectMenuWithConversationsListOptions extends ElementOptions {
    initial_conversations?: string[];
    default_to_current_conversation?: boolean;
    confirm?: CompositionObjects.ConfirmationDialog;
    max_selected_items?: number;
    filter?: CompositionObjects.Filter;
}

export interface MultiSelectMenuWithConversationsList
    extends MultiSelectMenu, MultiSelectMenuWithConversationsListOptions {
    placeholder: CompositionObjects.Text;
    action_id: string;
}

export interface MultiSelectMenuWithChannelsListOptions extends ElementOptions {
    initial_channels?: string;
    confirm?: CompositionObjects.ConfirmationDialog;
    max_selected_items?: number;
}

export interface MultiSelectMenuWithChannelsList
    extends MultiSelectMenu, MultiSelectMenuWithChannelsListOptions {
    placeholder: CompositionObjects.Text;
    action_id: string;
}

export interface OverflowMenuOptions extends ElementOptions {
    confirm?: CompositionObjects.ConfirmationDialog;
}

export interface OverflowMenu extends Element, OverflowMenuOptions {
    action_id: string;
    options: CompositionObjects.Option[];
}

export interface PlainTextInputOptions extends ElementOptions {
    placeholder?: CompositionObjects.Text;
    initial_value?: string;
    multiline?: boolean;
    min_length?: number;
    max_length?: number;
}

export interface PlainTextInput extends Element, PlainTextInputOptions {
    action_id: string;
}

export interface RadioButtonGroupOptions extends ElementOptions {
    initial_option?: CompositionObjects.Option;
    confirm?: CompositionObjects.ConfirmationDialog;
}

export interface RadioButtonGroup extends Element, RadioButtonGroupOptions {
    action_id: string;
    options: CompositionObjects.Option[];
}

export interface SelectMenu extends Element { }

export interface SelectMenuWithStaticOptionsOptions extends ElementOptions {
    option_groups?: CompositionObjects.OptionGroup[];
    initial_option?: CompositionObjects.Option | CompositionObjects.OptionGroup;
    confirm?: CompositionObjects.ConfirmationDialog;
}

export interface SelectMenuWithStaticOptions extends SelectMenu, SelectMenuWithStaticOptionsOptions {
    placeholder: CompositionObjects.Text;
    action_id: string;
    options: CompositionObjects.Option[];
}

export interface SelectMenuWithExternalDataSourceOptions extends ElementOptions {
    initial_option?: CompositionObjects.Option | CompositionObjects.OptionGroup;
    min_query_length?: number;
    confirm?: CompositionObjects.ConfirmationDialog;
}

export interface SelectMenuWithExternalDataSource
    extends SelectMenu, SelectMenuWithExternalDataSourceOptions {
    placeholder: CompositionObjects.Text;
    action_id: string;
}

export interface SelectMenuWithUserListOptions extends ElementOptions {
    initial_user?: string;
    confirm?: CompositionObjects.ConfirmationDialog;
}

export interface SelectMenuWithUserList extends SelectMenu, SelectMenuWithUserListOptions {
    placeholder: CompositionObjects.Text;
    action_id: string;
}

export interface SelectMenuWithConversationsListOptions extends ElementOptions {
    initial_conversation?: string;
    default_to_current_conversation?: boolean;
    confirm?: CompositionObjects.ConfirmationDialog;
    response_url_enabled?: boolean;
    filter?: CompositionObjects.Filter;
}

export interface SelectMenuWithConversationsList
    extends SelectMenu, SelectMenuWithConversationsListOptions {
    placeholder: CompositionObjects.Text;
    action_id: string;
}

export interface SelectMenuWithChannelsListOptions extends ElementOptions {
    initial_channel?: string;
    confirm?: CompositionObjects.ConfirmationDialog;
    response_url_enabled?: boolean;
}

export interface SelectMenuWithChannelsList extends SelectMenu, SelectMenuWithChannelsListOptions {
    placeholder: CompositionObjects.Text;
    action_id: string;
}

export interface AttachmentOptions {
    blocks?: Block[];
    color?: string;
}

export interface Attachment extends AttachmentOptions { }
