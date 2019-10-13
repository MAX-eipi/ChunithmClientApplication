
export interface Pager {
    getPageName(): string;
    call(parameter: any): GoogleAppsScript.HTML.HtmlOutput;
}

export function readHtml(pageName: string): string {
    let source = HtmlService.createTemplateFromFile(`html/${pageName}`).evaluate().getContent();
    return source;
}

export function createHtmlOutput(source: string): GoogleAppsScript.HTML.HtmlOutput {
    let htmlOutput = HtmlService.createHtmlOutput(source).setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
    htmlOutput.setTitle("譜面定数 検証報告 管理ツール");
    return htmlOutput;
}

export function getPageUrl(rootUrl: string, pageName: string, versionName: string): string {
    return `${rootUrl}?page=${pageName}&versionName=${versionName}`;
}

export function resolveRootUrl(source: string, rootUrl: string): string {
    return source ? source.replace(/%rootUrl%/g, rootUrl) : "";
}

export function resolveVersionName(source: string, versionName: string): string {
    return source ? source.replace(/%versionName%/g, versionName) : "";
}

function include(fileName: string): string {
    return HtmlService.createHtmlOutputFromFile(fileName).getContent();
}