export interface Configuration {
    hasProperty(key: string): boolean;
    getProperty<T>(key: string, defaultValue: T): T;
}