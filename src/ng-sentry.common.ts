import { getVersionName, getVersionCode } from 'nativescript-appversion';
import * as platform from 'tns-core-modules/platform';
import * as http from 'tns-core-modules/http';
import { setString, getString, remove } from 'tns-core-modules/application-settings';
import * as moment from 'moment/moment';

export interface KeyValue<T> { [key: string]: T; }

export class Common {
    private static instance: Common = new Common();

    private maxAmountOfBreadcrumbs: number = 50;
    private endPoint: string;
    private readonly storageKey: string = 'toSendErrors';

    private breadcrumbs: Array<any> = [];
    private versionName: string = '';
    private versionCode: string = '';
    private environment: string = 'DEVELOPMENT';

    constructor() {
        if (Common.getInstance()) {
            throw new Error("Error: Instance failed: Use LiveEngage.getInstance() instead of new.");
        }

        Common.instance = this;

        this.setVersionName();
        this.setVersionCode();
    }

    static getInstance() {
        return Common.instance;
    }

    public setCredentials(sentryId: string, sentryKey: string) {
        this.endPoint = 'https://sentry.io/api/' + sentryId + '/store/?sentry_version=7&sentry_client=raven-js%2F3.20.1&sentry_key=' + sentryKey;
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

    public saveError(errorMessage: string, errorDetails: string): void {
        this.saveBreadcrumb('' + errorDetails, 'crash start');

        const errorData = {
            project: '253147',
            logger: 'nativescript',
            platform: 'javascript',
            message: '' + errorMessage,
            level: 'error',
            tags: {
                device_type: platform.device.deviceType,
                device_lang: platform.device.language,
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
                    family: platform.device.manufacturer,
                    model: platform.device.model
                },
                os: {
                    name: platform.device.os,
                    version: platform.device.osVersion
                },
                runtime: {
                    name: 'Nativescript'
                }
            }
        };

        setString(this.storageKey, JSON.stringify(errorData));
    }

    public sendErrors(): void {
        if (getString(this.storageKey) === undefined) {
            return;
        }

        const postData = JSON.parse(getString(this.storageKey));
        http.request({
            url: this.endPoint,
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'Accept': '*/*',
                'Origin': 'nativescript://'
            },
            content: JSON.stringify(postData)
        }).then((response) => {
            remove(this.storageKey);
        }, (e) => {
            console.error("Sentry error", e);
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
}
