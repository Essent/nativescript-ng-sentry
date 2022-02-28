import { NgSentry } from '@essent/nativescript-ng-sentry';

export function onNavigatingTo(args: any) {
    const toPage: string = args.object.toString();
    NgSentry.getInstance().saveBreadcrumb(toPage, 'state');
}
