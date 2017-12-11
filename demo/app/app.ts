import "./bundle-config";
import * as application from 'tns-core-modules/application';
import { isAndroid, isIOS } from 'tns-core-modules/platform';
import { NgSentry } from 'nativescript-ng-sentry';

application.on(application.launchEvent, function () {
    NgSentry.getInstance().setCredentials('123456', '1234567890abcdefghijklmnopqrstuv');
    NgSentry.getInstance().sendErrors();
});

application.on(application.uncaughtErrorEvent, function (args) {
    if (isAndroid) {
        NgSentry.getInstance().saveError(args.android.nativeException.getMessage(), args.android);
    } else if (isIOS) {
        NgSentry.getInstance().saveError(args.ios, args.ios.stack);
    }
});

application.start({ moduleName: "main-page" });
