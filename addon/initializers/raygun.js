/* global rg4js */
import Ember from 'ember';
import { getAnonymousId, getUserId } from 'ember-raygun/utils/user-storage';
import isTruthy from 'ember-raygun/utils/is-truthy-string-boolean';

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
