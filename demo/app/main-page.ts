import { NgSentry } from '@essent/nativescript-ng-sentry';
import {topmost as topmostFrame} from "tns-core-modules/ui/frame";

function onNavigatingTo(args: any) {
    const toPage: string = args.object.toString();
    NgSentry.getInstance().saveBreadcrumb(toPage, 'state');
}
exports.onNavigatingTo = onNavigatingTo;

export function openDetails(args: any) {
    topmostFrame().navigate({
        moduleName: "details-page"
    });
}

export function forceCrash(args: any) {
    const newProperty = undefined;
    const testProperty = newProperty.notFound;
}
