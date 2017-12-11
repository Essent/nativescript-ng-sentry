# NativeScript plugin for Sentry

[![npm version](https://img.shields.io/npm/v/@essent/nativescript-ng-sentry.svg?style=flat-square)](https://www.npmjs.com/package/@essent/nativescript-ng-sentry)

This is a plugin to log errors with [Sentry](https://sentry.io).

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

To log an error call `saveError` with the error message and error details.
The error details will be used as a Sentry breadcrumb, you can use this to save a stacktrace for example.

```ts
NgSentry.getInstance().saveError('My error message', 'My error details');
```

Errors are not send to Sentry automatically, you can call `sendErrors` to send your last error to Sentry.

```ts
NgSentry.getInstance().sendErrors();
```

#### Breadcrumbs (optional)

You can save breadcrumbs to see what a user did before an error occurred, these will be added to the next error you save.
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