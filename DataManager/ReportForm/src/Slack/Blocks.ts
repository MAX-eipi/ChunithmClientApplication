import * as Elements from "./BlockElements";
import { Text } from "./CompositionObjects";

export interface BlockOptions {
    block_id?: string;
}

export interface Block extends BlockOptions {
    type: string;
}

export interface SectionOptions extends BlockOptions {
    fields?: Text[];
    accessory?: Element;
}

export interface Section extends Block, SectionOptions {
    text: Text;
}

export interface DividerOptions extends BlockOptions { }

export interface Divider extends Block, DividerOptions { }

export interface ImageOptions extends BlockOptions {
    title?: Text;
}

export interface Image extends Block, ImageOptions {
    image_url: string;
    alt_text: string;
}

export interface ActionOptions extends BlockOptions { }

export interface Action extends Block, ActionOptions {
    elements: (Elements.Button | Elements.SelectMenu | Elements.OverflowMenu | Elements.DatePicker)[];
}

export interface ContextOptions extends BlockOptions { }

export interface Context extends Block, ContextOptions {
    elements: (Elements.Image[] | Text)[];
}

export interface InputOptions extends BlockOptions {
    hint?: Text;
    optional?: boolean;
}

export interface Input extends Block, InputOptions {
    label: Text;
    element: Elements.PlainTextInput | Elements.SelectMenu | Elements.MultiSelectMenu | Elements.DatePicker;
}

export interface FileOptions extends BlockOptions { }

export interface File extends Block, FileOptions {
    external_id: string;
    source: string;
}
