export class ReportError implements Error {
    public name: string = "ReportError";
    public message: string;
    public constructor(message: string) {
        this.message = message;
    }
    toString(): string {
        return `${this.name}:${this.message}`;
    }
}
