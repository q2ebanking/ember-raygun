# ember-raygun

A Raygun.io integration via an addon. Uses v2 of the Raygun JS API, `rg4js`.

- See <https://github.com/MindscapeHQ/raygun4js#getting-started>
- Loads Raygun JavaScript asset from: `//cdn.raygun.io/raygun4js/raygun.min.js`

To enable and set your API Key add to config/environment:

```js
'use strict';

module.exports = function(environment/*, appConfig */) {
  return {
    raygun: {
      apiKey: 'APP_API_KEY_HERE',
      enabled: true,
      enableCrashReporting: true,
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

- `export RAYGUN_ENABLED=true; export RAYGUN_CRASH_REPORTING=true; export RAYGUN_USER_TRACKING=true; export RAYGUN_API_KEY='X'; ember s`
- visit <http://localhost:4200/login>

On Windows you can use PowerShell to set an environment variable, `$env:RAYGUN_ENABLED="true"`

## Installation

* `ember install ember-raygun`

## Running Tests

* `npm test` (Runs `ember try:each` to test multiple Ember versions)
* `ember test`
* `ember test --server`

For more information on using ember-cli, visit [https://ember-cli.com/](https://ember-cli.com/).
