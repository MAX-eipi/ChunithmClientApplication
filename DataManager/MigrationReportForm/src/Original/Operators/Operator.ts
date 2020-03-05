import { Configuration, VersionConfiguration } from "../Configuration";
import { Router } from "../Router";
import { LineConnectorOperator } from "./LineConnectorOperator";
import { SpreadSheetLoggerOperator } from "./SpreadSheetLoggerOperator";
import { Role } from "../Role";

export class Operator {
    private static readonly DEFAULT_VERSION_NAME = "default_version_name";
    private static readonly ENVIRONMENT = "environment";
    private static readonly ROLE = "role";

    private static configuration: Configuration;
    private static targetVersionName: string;

    private static versionConfiguration: VersionConfiguration;

    private static rootUrl: string = null;
    private static router: Router = null;
    private static reportForm: GoogleAppsScript.Forms.Form = null;

    private static role: Role = null;

    private static onChangeTargetVersion: any[] = null;

    public static getConfiguration(): Configuration {
        if (!this.configuration) {
            this.configuration = new Configuration();
        }
        return this.configuration;
    }

    public static getRootUrl(): string {
        if (this.rootUrl) {
            return this.rootUrl;
        }
        this.rootUrl = this.getConfiguration().getGlobalConfigurationProperty<string>("root_url", "");
        return this.rootUrl;
    }

    public static getUrl(pageName: string): string {
        return `${this.getRootUrl}?page=${pageName}`;
    }

    private static getRouter(): Router {
        if (this.router) {
            return this.router;
        }
        this.router = new Router();
        return this.router;
    }

    public static routing(pageName: string, parameter: any): GoogleAppsScript.HTML.HtmlOutput {
        return this.getRouter().call(pageName, parameter);
    }

    public static routingError(message: string): GoogleAppsScript.HTML.HtmlOutput {
        return this.getRouter().callError(message);
    }

    public static routingException(error: Error): GoogleAppsScript.HTML.HtmlOutput {
        let message = this.toExceptionMessage(error).replace(/\n/g, "<br>");
        return this.getRouter().callError(message);
    }

    public static getReportForm(): GoogleAppsScript.Forms.Form {
        if (this.reportForm) {
            return this.reportForm;
        }

        let config = this.getConfiguration();

        let formId = config.getGlobalConfigurationProperty<string>("form_id", "");
        if (!formId) {
            throw new Error("form_id is not set.");
        }

        this.reportForm = FormApp.openById(formId);
        if (!this.reportForm) {
            throw new Error(`Form is invalid. formId: ${formId}`);
        }
        return this.reportForm;
    }

    public static addOnChangeTargetVersionEventHandler(callback: any) {
        if (!this.onChangeTargetVersion) {
            this.onChangeTargetVersion = [];
        }
        this.onChangeTargetVersion.push(callback);
    }

    public static setVersion(versionName: string): void {
        if (this.targetVersionName == versionName) {
            return;
        }

        this.targetVersionName = versionName;
        this.versionConfiguration = null;

        if (!this.onChangeTargetVersion) {
            for (let key in this.onChangeTargetVersion) {
                this.onChangeTargetVersion[key](this.targetVersionName);
            }
        }
    }

    public static setDefaultVersion(): void {
        this.setVersion(this.getDefaultVersionName());
    }

    public static getDefaultVersionName(): string {
        let versionName = this.getConfiguration().getGlobalConfigurationProperty<string>(this.DEFAULT_VERSION_NAME, "");
        if (!versionName) {
            return this.getConfiguration().getLatestVersionName();
        }
        return versionName;
    }

    public static getTargetVersionName(): string {
        return this.targetVersionName || "";
    }

    public static getTargetVersionConfiguration(): VersionConfiguration {
        if (this.versionConfiguration) {
            return this.versionConfiguration;
        }

        let config = this.getConfiguration();
        this.versionConfiguration = config.getVersionConfiguration(this.targetVersionName);
        if (!this.versionConfiguration) {
            throw new Error(`Invalid version name. versionName:"${this.targetVersionName}"`);
        }
        return this.versionConfiguration;
    }

    public static getEnvironment(): string {
        let config = this.getConfiguration();
        return config.getGlobalConfigurationProperty<string>(this.ENVIRONMENT, "");
    }

    public static isDevelop(): boolean {
        let environment = this.getEnvironment();
        return environment == "develop";
    }

    public static getRole(): Role {
        if (this.role != null) {
            return this.role;
        }
        let config = this.getConfiguration();
        let roleText = config.getGlobalConfigurationProperty<string>(this.ROLE, "");
        switch (roleText) {
            case "operator":
                this.role = Role.Operator;
                break;
            case "reader":
                this.role = Role.Reader;
                break;
            default:
                this.role = Role.Reader;
                break;
        }
        return this.role;
    }

    public static error(messages: string[]): void {
        LineConnectorOperator.pushErrorMessage(messages);
        SpreadSheetLoggerOperator.logError(messages);
        for (var i = 0; i < messages.length; i++) {
            Logger.log(messages[i]);
        }
    }

    public static exception(error: Error): void {
        this.error([this.toExceptionMessage(error)]);
    }

    private static toExceptionMessage(error: Error): string {
        return `[Message]
${error.message}

[Stack Trace]
${error.stack}`;
    }
}