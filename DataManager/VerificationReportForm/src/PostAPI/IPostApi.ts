export interface IPostAPI {
    called(api: string): boolean;
    invoke(api: string, postData: any): any;
}