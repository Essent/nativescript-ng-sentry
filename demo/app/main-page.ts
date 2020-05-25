import { NgSentry } from '@essent/nativescript-ng-sentry';
import { Frame } from "tns-core-modules/ui/frame";
import { Page } from "tns-core-modules/ui/page";
import { Button } from "tns-core-modules/ui/button";

function onNavigatingTo(args: any) {
    const toPage: string = args.object.toString();
    NgSentry.getInstance().saveBreadcrumb(toPage, 'state');
}
exports.onNavigatingTo = onNavigatingTo;

export function openDetails(args: any) {
    const button: Button = args.object;
    const page: Page = button.page;
    const topmostFrame: Frame = page.frame; 

    topmostFrame.navigate({
        moduleName: "details-page"
    });
}

export function forceCrash(args: any) {
    const newProperty = undefined;
    const testProperty = newProperty.notFound;
}
