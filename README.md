# NativeScript plugin for Sentry

[![npm version](https://badge.fury.io/js/%40essent%2Fnativescript-ng-sentry.svg)](https://www.npmjs.com/package/@essent/nativescript-ng-sentry)

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

At the launch of your app call `setCredentials` with your own credentials, these can be found in your Sentry Project Settings, Client Keys (DSN). Use the public DSN for these credentials. Optionally you can also provide an environment.

```ts
NgSentry.getInstance().setCredentials('123456', '123456789abcdefghijklmnopqrstuvw', 'development');
```

To log a crash, call `saveCrash` with a message and details.
The details will be used as a Sentry breadcrumb, you can use this to save a stacktrace, for example.
You can have a look at [our example](./demo/app/app.ts) on how to call this with an uncaughtErrorEvent.

```ts
NgSentry.getInstance().saveCrash('My crash message', 'My crash details');
```

Crashes are not send to Sentry automatically, you can call `sendCrashes` to send all saved crashes to Sentry.
We suggest you call this method in the resume event of your app.

```ts
NgSentry.getInstance().sendCrashes();
```

### Breadcrumbs (optional)

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

Optionally you can set a maximum amount of breadcrumbs, the default is 50.
```ts
NgSentry.getInstance().setMaxAmountOfBreadcrumbs(10);
```