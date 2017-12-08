export interface KeyValue<T> {
    [key: string]: T;
}
export declare class Common {
    private static instance;
    private maxAmountOfBreadcrumbs;
    private endPoint;
    private readonly storageKey;
    private breadcrumbs;
    private versionName;
    private versionCode;
    private environment;
    constructor();
    static getInstance(): Common;
    setCredentials(sentryId: string, sentryKey: string): void;
    saveBreadcrumb(message: string, category: string, properties?: KeyValue<string>): void;
    saveError(errorMessage: string, errorDetails: string): void;
    sendErrors(): void;
    private setVersionName();
    private setVersionCode();
}
