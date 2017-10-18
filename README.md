# ember-raygun

A Raygun.io integration via an addon. Uses v2 of the Raygun JS API, `rg4js`.

- See <https://github.com/MindscapeHQ/raygun4js#getting-started>
- Loads Raygun JavaScript asset from: `//cdn.raygun.io/raygun4js/raygun.min.js`

[![Build Status](https://travis-ci.org/q2ebanking/ember-raygun.svg?branch=master)](https://travis-ci.org/q2ebanking/ember-raygun)

To enable and set your API Key add to config/environment:

```js
'use strict';

module.exports = function(environment/*, appConfig */) {
  return {
    raygun: {
      apiKey: 'APP_API_KEY_HERE',
      enabled: true,
      enableCrashReporting: false,
      enableUserTracking: true,
      enablePulse: true,
      saveIfOffline: true,
      sensitiveData: ['password'],
      tags: [ environment ]
    }
  };
};
```

The config also supports using a string.

- e.g. `enablePulse: "#{raygun:enablePulse}",`

This may be useful if you use replace config settings during deployment
instead of only during the ember build.

## User tracking

Personally identifiable info (PII) should never be sent to Raygun, without
legal approval.

The `enableUserTracking` setting will disable the Raygun anonymous tracking
and utilize a custom user id value (uuid) to track users. When using this
update the user id once your user logs into your application. The `raygun`
service provides a `setUser` method.

## Example Implementation

Your implemenation depends on your application's needs, the `raygun` service,
provided by this addon can be used to manage the tracked user.

See the [tests/dummy](tests/dummy) application as an example of managing an
user id, with anonymous id or an actual user id provided after login.

The config for a development build uses environment variables.

- `export RAYGUN_ENABLED=true; export RAYGUN_CRASH_REPORTING=false; export RAYGUN_USER_TRACKING=true; export RAYGUN_API_KEY='X'; ember s`
- visit <http://localhost:4200/login>

On Windows you can use PowerShell to set an environment variable, `$env:RAYGUN_ENABLED="true"`

To prevent certain errors from Raygun Crash Reporting, use a utility function
in your app named `raygun-error-filter`.

- `ember generate util raygun-error-filter`

Perhaps your app handles RSVP errors caught from XHR requests, based status codes,
`401`, `403`, and `409`. And the related errors shoud not be reported to Raygun.

Below is an example utility function that you may use as a filter.

```js
export default function raygunErrorFilter(error) {
  if (error && error.xhr && error.xhr.status && [401,403,409].includes(error.xhr.status)) {
    return null;
  } else {
    return error;
  }
}
```

If the utility function returns the error passed in, then it will be reported.
To ensure the filter function is used with `window.onerror` (uncaught errors)
set the config value for `enableCrashReporting` to `false`. A `true` setting
would use Raygun's automatic setup for `winodow.onerror`, which doesn't filter.
 
See the dummy app example, [utils/raygun-error-filter](tests/dummy/app/utils/raygun-error-filter.js).

Crash reporting is generated through `Ember.onerror`, `RSVP.on('error', () => {})`, 
`Ember.Logger.error`, and `window.onerror`. When your application's config enables
Raygun Crash reporting, this behavior is setup using an instance initializer.

If you would like to define how your app reports runtime errors to Raygun,
then you may generate your own instance initializer.

- `ember generate instance-initializer raygun`

See [addon/instance-initializers/raygun](addon/instance-initializers/raygun).

## Installation

* `ember install ember-raygun`

## Running Tests

* `npm test` (Runs `ember try:each` to test multiple Ember versions)
* `ember test`
* `ember test --server`

For more information on using ember-cli, visit [https://ember-cli.com/](https://ember-cli.com/).
