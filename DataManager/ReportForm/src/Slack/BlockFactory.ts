import * as Elements from "./BlockElements";
import * as Blocks from "./Blocks";
import { Text } from "./CompositionObjects";

export class BlockFactory {
    public static section(text: Text, options: Blocks.SectionOptions = {}): Blocks.Section {
        const ret: Blocks.Section = {
            type: 'section',
            text: text,
        };
        this.copyValue(options, ret, [
            'block_id',
            'fields',
            'accessory',
        ]);
        return ret;
    }

    public static divider(options: Blocks.DividerOptions = {}): Blocks.Divider {
        const ret: Blocks.Divider = {
            type: 'divider',
        };
        this.copyValue(options, ret, [
            'block_id',
        ]);
        return ret;
    }

    public static image(imageUrl: string, altText: string, options: Blocks.ImageOptions = {}): Blocks.Image {
        const ret: Blocks.Image = {
            type: 'image',
            image_url: imageUrl,
            alt_text: altText,
        };
        this.copyValue(options, ret, [
            'block_id',
            'title',
        ]);
        return ret;
    }

    public static action(
        elements: (Elements.Button | Elements.SelectMenu | Elements.OverflowMenu | Elements.DatePicker)[],
        options: Blocks.ActionOptions = {}): Blocks.Action {
        const ret: Blocks.Action = {
            type: 'actions',
            elements: elements,
        };
        this.copyValue(options, ret, [
            'block_id',
        ]);
        return ret;
    }

    public static context(
        elements: (Elements.Image[] | Text)[],
        options: Blocks.ContextOptions = {}): Blocks.Context {
        const ret: Blocks.Context = {
            type: 'context',
            elements: elements,
        };
        this.copyValue(options, ret, [
            'block_id',
        ]);
        return ret;
    }

    public static input(
        label: Text,
        element: Elements.PlainTextInput | Elements.SelectMenu | Elements.MultiSelectMenu | Elements.DatePicker,
        options: Blocks.InputOptions = {}): Blocks.Input {
        const ret: Blocks.Input = {
            type: 'input',
            label: label,
            element: element,
        };
        this.copyValue(options, ret, [
            'block_id',
            'hint',
            'optional',
        ]);
        return ret;
    }

    public static file(externalId: string, source: string, options: Blocks.FileOptions = {}): Blocks.File {
        const ret: Blocks.File = {
            type: 'file',
            external_id: externalId,
            source: source,
        };
        this.copyValue(options, ret, [
            'block_id',
        ]);
        return ret;
    }

    private static copyValue<TOptions extends Blocks.BlockOptions>(src: TOptions, dist: TOptions, propertyNames: string[]): void {
        if (src) {
            for (const prop of propertyNames) {
                if (prop in src) {
                    dist[prop] = src[prop];
                }
            }
        }
    }
}
