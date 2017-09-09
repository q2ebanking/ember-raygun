# ember-raygun

A Raygun.io integration via an addon. Uses v2 of the Raygun JS API, `rg4js`.

- See <https://github.com/MindscapeHQ/raygun4js#getting-started>
- Loads Raygun JS asset from: `//cdn.raygun.io/raygun4js/raygun.min.js`

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

## User tracking

Personally identifiable info (PII) should never be sent to Raygun, without express legal approval.

The `enableUserTracking` setting will disable the Raygun anonymous tracking and utilize the Q2AO user id values to track users.

## Installation

* `ember install ember-raygun`

## Running Tests

* `npm test` (Runs `ember try:each` to test your addon against multiple Ember versions)
* `ember test`
* `ember test --server`

For more information on using ember-cli, visit [https://ember-cli.com/](https://ember-cli.com/).
