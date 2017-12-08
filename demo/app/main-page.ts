import * as observable from 'tns-core-modules/data/observable';
import { NgSentry } from 'nativescript-ng-sentry';

// Event handler for Page 'loaded' event attached in main-page.xml
export function pageLoaded(args: observable.EventData) {
    NgSentry.getInstance().setCredentials('123456', '123456789abcdefghijklmnopqrstuvw');

    // report a crash 1 sec after startup
    setTimeout(() => {
        NgSentry.getInstance().saveError('test err msg from plugin', 'test err stack trace from plugin');
        NgSentry.getInstance().sendErrors();
    },1000);
}
