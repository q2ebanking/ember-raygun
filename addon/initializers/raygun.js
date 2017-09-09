/* global rg4js */
import Ember from 'ember';
import RSVP from 'rsvp';
import { getAnonymousId, getUserId } from 'ember-raygun/utils/user-storage';
import isTruthy from 'ember-raygun/utils/is-truthy-string-boolean';

const defaultErrorHandler = Ember.Logger.error;
let _tags;

export default function(config) {
  const raygunConfig = config.raygun;
  if (!raygunConfig || !raygunConfig.apiKey) {
    Ember.assert('Make sure you set your Raygun API Key in config/environment.js!');
  } else if (!isTruthy(raygunConfig.enabled)) {
    if (!raygunConfig.beQuiet) {
      Ember.Logger.info(`FYI: Ember CLI Raygun is currently disabled, as config.raygun.enabled is ${raygunConfig.enabled}`);
    }
  } else {
    configureRaygun(config);
    setupEmberOnError();
    setupRSVPOnError();
    setupErrorLogger();
    if (!raygunConfig.beQuiet) {
      Ember.Logger.info('Ember CLI Raygun Enabled and ready to report!');
    }
  }
}

function configureRaygun(config) {
  const raygunConfig = config.raygun;
  const options = {};
  rg4js('apiKey', raygunConfig.apiKey);
  rg4js('setVersion', config.APP.version);
  rg4js('saveIfOffline', isTruthy(raygunConfig.saveIfOffline));
  rg4js('withCustomData', {
    environment: config.environment,
    appName: config.APP.name,
    version: config.APP.version,
  });
  if (raygunConfig.tags) {
    _tags = raygunConfig.tags;
    rg4js('withTags', raygunConfig.tags);
  }
  // Automatic window.onerror handler callback
  rg4js('enableCrashReporting', isTruthy(raygunConfig.enableCrashReporting));
  // Disable anonymous tracking
  const enableUserTracking = isTruthy(raygunConfig.enableUserTracking);
  options.disableAnonymousUserTracking = enableUserTracking;
  rg4js('options', options);
  if (enableUserTracking) {
    let userId = getUserId();
    const user = { identifier: userId || getAnonymousId(), isAnonymous: !userId, };
    rg4js('setUser', user);
  }
  // Filter sensitive data
  if (raygunConfig.sensitiveData) {
    rg4js('filterSensitiveData', raygunConfig.sensitiveData);
    rg4js('setFilterScope', 'all'); // Filter any key in the payload, defaults to `customData`
  }
}

function setupEmberOnError() {
  // https://guides.emberjs.com/v2.11.0/configuring-ember/debugging/#toc_implement-an-ember-onerror-hook-to-log-all-errors-in-production
  // https://emberjs.com/api/ember/2.11/namespaces/Ember/events/onerror?anchor=onerror
  Ember.onerror = function(error) {
    sendToRayGun(error, 'Ember.onerror');
  };
}

function setupRSVPOnError() {
  // https://guides.emberjs.com/v2.11.0/configuring-ember/debugging/#toc_errors-within-an-code-rsvp-promise-code
  // https://github.com/tildeio/rsvp.js/#error-handling
  RSVP.on('error', function(error, label) {
    // SEE: https://github.com/emberjs/ember.js/issues/5566
    if (error && error.hasOwnProperty('name') && error.name !== 'TransitionAborted') {
      let name = 'Ember.RSVP error' + label ? `: ${label}` : '';
      sendToRayGun(error, name);
    }
  });
}

function setupErrorLogger() {
  // https://github.com/emberjs/ember.js/blob/master/packages/ember-console/lib/index.js
  Ember.Logger.error = function(error) {
    sendToRayGun(error, 'Ember.Logger.error');
  };
}

function sendToRayGun(error, name) {
  defaultErrorHandler(name, error);
  const payload = {
    error: error,
    customData: {
      handler: name,
      stack: (error && error.stack) ? error.stack : '',
    },
    tags: _tags || [],
  };
  rg4js('send', payload);
}
