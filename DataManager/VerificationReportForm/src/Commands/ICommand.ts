export interface ICommand {
    called(command: string): boolean;
    invoke(command: string, event: any, postData: any): void;
}