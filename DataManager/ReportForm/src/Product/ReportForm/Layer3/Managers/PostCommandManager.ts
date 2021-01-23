import { PostCommandController } from "../PostCommandControllers/@PostCommandController";

export class PostCommandManager {
    private readonly _factories: { predicate: (command: string) => boolean; factory: new () => PostCommandController }[] = [];

    public bindEquals(command: string, factory: new () => PostCommandController): void {
        this.bind(x => x === command, factory);
    }

    public bindStartWith(command: string, factory: new () => PostCommandController): void {
        this.bind(x => x.startsWith(command), factory);
    }

    public bind(predicate: (command: string) => boolean, factory: new () => PostCommandController): void {
        this._factories.push({ predicate: predicate, factory: factory });
    }

    public findController(command: string): PostCommandController {
        for (const x of this._factories) {
            if (x.predicate(command)) {
                return new x.factory();
            }
        }

        return null;
    }
}
