import { getVersionName, getVersionCode } from 'nativescript-appversion';
import * as platform from 'tns-core-modules/platform';
import * as http from 'tns-core-modules/http';
import { setString, getString } from 'tns-core-modules/application-settings';
import * as moment from 'moment/moment';
import { isNullOrUndefined } from 'tns-core-modules/utils/types';

export interface KeyValue<T> {
    [key: string]: T;
}

export class Common {
    private static instance: Common = new Common();

    private maxAmountOfBreadcrumbs: number = 50;
    private endPoint: string;
    private readonly storageKey: string = 'sentryCrashesQueue';

    private breadcrumbs: Array<any> = [];
    private versionName: string = '';
    private versionCode: string = '';
    private sentryId: string = '';
    private environment: string = 'DEVELOPMENT';

    constructor() {
        if (Common.getInstance()) {
            throw new Error("Error: Instance failed: Use LiveEngage.getInstance() instead of new.");
        }

        Common.instance = this;

        // Fix for Android timing issue
        setTimeout(() => {
            this.setVersionName();
            this.setVersionCode();
        });
    }

    static getInstance() {
        return Common.instance;
    }

    public setCredentials(sentryId: string, sentryKey: string, environment?: string) {
        this.sentryId = sentryId;
        this.endPoint = 'https://sentry.io/api/' + sentryId + '/store/?sentry_version=7&sentry_client=raven-js%2F3.22.2&sentry_key=' + sentryKey;
        if (environment) {
            this.environment = environment;
        }
    }

    public setMaxAmountOfBreadcrumbs(amount: number) {
        this.maxAmountOfBreadcrumbs = amount;
    }

    public saveBreadcrumb(message: string, category: string, properties?: KeyValue<string>): void {
        const crumb = {
            timestamp: moment(),
            message,
            category,
            data: properties
        };
        this.breadcrumbs.push(crumb);
        if (this.breadcrumbs.length > this.maxAmountOfBreadcrumbs) {
            this.breadcrumbs.shift();
        }
    }

    public saveCrash(errorMessage: string, errorDetails: string): void {
        this.saveBreadcrumb('' + errorDetails, 'crash start');

        let deviceType: string = '';
        let language: string = '';
        let manufacturer: string = '';
        let model: string = '';
        let os: string = '';
        let osVersion: string = '';
        if (!isNullOrUndefined(platform.device)) {
            deviceType = platform.device.deviceType;
            language = platform.device.language;
            manufacturer = platform.device.manufacturer;
            model = platform.device.model;
            os = platform.device.os;
            osVersion = platform.device.osVersion;
        }

        const crashData = {
            project: this.sentryId,
            logger: 'nativescript',
            platform: 'javascript',
            message: '' + errorMessage,
            level: 'error',
            tags: {
                device_type: deviceType,
                device_lang: language,
                app_version: this.versionCode,
                trace_category: 'Error'

            },
            breadcrumbs: {
                values: this.breadcrumbs
            },
            environment: this.environment,
            release: this.versionName,
            contexts: {
                device: {
                    family: manufacturer,
                    model: model
                },
                os: {
                    name: os,
                    version: osVersion
                },
                runtime: {
                    name: 'Nativescript'
                }
            }
        };

        let crashes: Array<any> = [];
        if (this.isPresentInSettings(this.storageKey)) {
            crashes = JSON.parse(getString(this.storageKey));
        }
        crashes.push(crashData);
        setString(this.storageKey, JSON.stringify(crashes));
    }

    public sendCrashes(): void {
        if (!this.isPresentInSettings(this.storageKey)) {
            return;
        }

        const crashes = JSON.parse(getString(this.storageKey));
        for (let crash of crashes) {
            this.submitCrash(crash);
        }
    }

    private submitCrash(crash) {
        http.request({
            url: this.endPoint,
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'Accept': '*/*',
                'Origin': 'nativescript://'
            },
            content: JSON.stringify(crash)
        }).then((response) => {
            // remove crash from saved crashes
            const crashes = JSON.parse(getString(this.storageKey));
            const index: number = this.customIndexOf(crashes, crash);
            if (index > -1) {
                crashes.splice(index, 1);
                setString(this.storageKey, JSON.stringify(crashes));
            }
        }, (e) => {
            console.error("Sentry send error", e);
        });
    }

    private setVersionName(): void {
        getVersionName().then((versionName: string) => {
            this.versionName = versionName;
        });
    }

    private setVersionCode(): void {
        getVersionCode().then((versionCode: string) => {
            this.versionCode = versionCode;
        });
    }

    private isPresentInSettings(storeKey: string): boolean {
        return getString(storeKey) !== undefined;
    }

    private customIndexOf(arr: Array<any>, searchElement: any): number {
        for (let i = 0; i < arr.length; i++) {
            if (arr[i].message === searchElement.message) {
                return i;
            }
        }
        return -1;
    }
}
