import { isIOS, Application } from '@nativescript/core';;
import { NgSentry } from '@essent/nativescript-ng-sentry';

Application.on(Application.launchEvent, function () {
    NgSentry.getInstance().setCredentials('123456', '1234567890abcdefghijklmnopqrstuv');
});

Application.on(Application.resumeEvent, function () {
    NgSentry.getInstance().sendCrashes();
});

Application.on(Application.uncaughtErrorEvent, function (args) {
    if (isIOS) {
        NgSentry.getInstance().saveCrash(args.ios, args.ios.stack);
    } else {
        NgSentry.getInstance().saveCrash(args.android.nativeException.getMessage(), args.android);
    }
});

Application.run({ moduleName: "app-root" });
