export interface ILineCommand {
    called(command: string): boolean;
    invoke(command: string, event: any, postData: any): void;
}