import "./bundle-config";
import * as application from '@nativescript/core/application';
import { isIOS } from '@nativescript/core';;
import { NgSentry } from '@essent/nativescript-ng-sentry';

application.on(application.launchEvent, function () {
    NgSentry.getInstance().setCredentials('123456', '1234567890abcdefghijklmnopqrstuv');
});

application.on(application.resumeEvent, function () {
    NgSentry.getInstance().sendCrashes();
});

application.on(application.uncaughtErrorEvent, function (args) {
    if (isIOS) {
        NgSentry.getInstance().saveCrash(args.ios, args.ios.stack);
    } else {
        NgSentry.getInstance().saveCrash(args.android.nativeException.getMessage(), args.android);
    }
});

application.run({ moduleName: "app-root" });
