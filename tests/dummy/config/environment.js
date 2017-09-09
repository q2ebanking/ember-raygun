/* eslint-env node */
'use strict';

module.exports = function(environment) {
  let ENV = {
    modulePrefix: 'dummy',
    environment,
    rootURL: '/',
    locationType: 'auto',
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      },
      EXTEND_PROTOTYPES: {
        // Prevent Ember Data from overriding Date.parse.
        Date: false
      }
    },
    raygun: {
      apiKey: '#{ApiKey}',
      enabled: '#{enabled}',
      enableCrashReporting: '#{enableCrashReporting}',
      enableUserTracking: '#{enableUserTracking}',
      enablePulse: '#{enablePulse}',
      saveIfOffline: '#{saveIfOffline}',
      sensitiveData: ['password'],
      tags: [
        'ember-raygun',
      ],
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    }
  };

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
    ENV.raygun.apiKey = process.env.RAYGUN_API_KEY || 'no-key-set';
    ENV.raygun.enabled = process.env.RAYGUN_ENABLED === 'true';
    ENV.raygun.enableCrashReporting = process.env.RAYGUN_CRASH_REPORTING === 'true';
    ENV.raygun.enableUserTracking = process.env.RAYGUN_USER_TRACKING === 'true';
    ENV.raygun.enablePulse = process.env.RAYGUN_PULSE === 'true';
    ENV.raygun.saveIfOffline = false;
    ENV.raygun.tags = ['ember-raygun', 'development'];
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';

    ENV.raygun.apiKey = 'no-key-set-in-test';
    ENV.raygun.enabled = true;
    ENV.raygun.enableCrashReporting = true;
    ENV.raygun.enableUserTracking = true;
    ENV.raygun.enablePulse = true;
    ENV.raygun.saveIfOffline = false;
    ENV.raygun.tags = ['ember-raygun', 'test'];
  }

  if (environment === 'production') {
    ENV.raygun.sensitiveData = ['password'];
  }

  return ENV;
};
