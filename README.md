# NativeScript plugin for Sentry

[![npm version](https://img.shields.io/npm/v/@essent/nativescript-ng-sentry.svg?style=flat-square)](https://www.npmjs.com/package/@essent/nativescript-ng-sentry)

This is a plugin to log app crashes with [Sentry](https://sentry.io).

## Installation

Run the following command from the root of your project:

```
$ tns plugin add @essent/nativescript-ng-sentry
```

This command automatically installs the necessary files, as well as stores nativescript-ng-sentry as a dependency in your project's `package.json` file.

## Usage 

To use nativescript-ng-sentry you must first `import` the module:

```ts
import { NgSentry } from 'nativescript-ng-sentry';
```

At the launch of your app call `setCredentials` with your own credentials, these can be found in your Sentry Project Settings, Client Keys (DSN). Use the public DSN for these credentials.

```ts
NgSentry.getInstance().setCredentials('123456', '123456789abcdefghijklmnopqrstuvw');
```

To log a crash call `saveCrash` with a message and details.
The details will be used as a Sentry breadcrumb, you can use this to save a stacktrace for example.
You can have a look at [our example](./demo/app/app.ts#L14) on how to call this with an uncaughtErrorEvent.

```ts
NgSentry.getInstance().saveCrash('My crash message', 'My crash details');
```

Crashes are not send to Sentry automatically, you can call `sendCrashes` to send all saved crashes to Sentry.
We suggest you call this method in the resume event of your app.

```ts
NgSentry.getInstance().sendCrashes();
```

#### Breadcrumbs (optional)

You can save breadcrumbs to see what a user did before a crash occurred, these will be added to the next crash you save.
To add a breadcrumb use `saveBreadcrumb` with a title and category.

```ts
NgSentry.getInstance().saveBreadcrumb('Routed to details page', 'state');
```

Optionally you can add extra data to the breadcrumb.

```ts
const properties: KeyValue<string> = {
    page: 'Change user data',
    changed: 'Username'
};
NgSentry.getInstance().saveBreadcrumb('Save success', 'action', properties);
```