import "./bundle-config";
import * as application from 'tns-core-modules/application';
import { isAndroid, isIOS } from 'tns-core-modules/platform';
import { NgSentry } from '@essent/nativescript-ng-sentry';

application.on(application.launchEvent, function () {
    NgSentry.getInstance().setCredentials('123456', '1234567890abcdefghijklmnopqrstuv');
});

application.on(application.resumeEvent, function () {
    NgSentry.getInstance().sendCrashes();
});

application.on(application.uncaughtErrorEvent, function (args) {
    if (isAndroid) {
        NgSentry.getInstance().saveCrash(args.android.nativeException.getMessage(), args.android);
    } else if (isIOS) {
        NgSentry.getInstance().saveCrash(args.ios, args.ios.stack);
    }
});

application.run({ moduleName: "app-root" });
