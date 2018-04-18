import { NgSentry } from '@essent/nativescript-ng-sentry';

function onNavigatingTo(args: any) {
    const toPage: string = args.object.toString();
    NgSentry.getInstance().saveBreadcrumb(toPage, 'state');
}
exports.onNavigatingTo = onNavigatingTo;
