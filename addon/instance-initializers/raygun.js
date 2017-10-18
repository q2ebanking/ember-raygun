/* global rg4js */
import Ember from 'ember';
import RSVP from 'rsvp';
import isTruthy from 'ember-raygun/utils/is-truthy-string-boolean';

const defaultErrorLogger = Ember.Logger.error;

export function initialize(appInstance) {
  let config = appInstance.resolveRegistration('config:environment');
  if (isEnabled(config.raygun)) {
    let filter = appInstance.resolveRegistration('util:raygun-error-filter');
    setupEmberOnError(filter);
    setupRSVPOnError(filter);
    setupErrorLogger(filter);
    if (!isTruthy(config.raygun.enableCrashReporting)) {
      setupWindowOnError(filter);
    }
  }
}

export default {
  name: 'raygun',
  initialize
};

function isEnabled(config) {
  return config && config.apiKey && isTruthy(config.enabled);
}

function setupWindowOnError(filter) {
  let handler = 'window.onerror';
  // See https://github.com/MindscapeHQ/raygun4js#usage
  window.onerror = function(error) {
    if (filter(error)) {
      sendToRayGun(error, handler);
    }
  }
}

function setupEmberOnError(filter) {
  let handler = 'Ember.onerror';
  // https://guides.emberjs.com/v2.11.0/configuring-ember/debugging/#toc_implement-an-ember-onerror-hook-to-log-all-errors-in-production
  // https://emberjs.com/api/ember/2.11/namespaces/Ember/events/onerror?anchor=onerror
  Ember.onerror = function(error) {
    if (filter(error)) {
      sendToRayGun(error, handler);
    }
  };
}

function setupRSVPOnError(filter) {
  // https://guides.emberjs.com/v2.11.0/configuring-ember/debugging/#toc_errors-within-an-code-rsvp-promise-code
  // https://github.com/tildeio/rsvp.js/#error-handling
  RSVP.on('error', function(error, label) {
    // SEE: https://github.com/emberjs/ember.js/issues/5566
    if (error && error.hasOwnProperty('name') && error.name !== 'TransitionAborted') {
      let handler = label ? `Ember.RSVP error: ${label}` : 'Ember.RSVP error';
      if (filter(error)) {
        sendToRayGun(error, handler);
      }
    }
  });
}

function setupErrorLogger(filter) {
  let handler = 'Ember.Logger.error';
  // https://github.com/emberjs/ember.js/blob/master/packages/ember-console/lib/index.js
  Ember.Logger.error = function(error) {
    defaultErrorLogger(handler, error);
    if (error instanceof Error && filter(error)) {
      sendToRayGun(error, handler);
    }
  };
}

function sendToRayGun(error, handler) {
  const payload = {
    error: error,
    customData: {
      handler: handler,
      stack: (error && error.stack) ? error.stack : '',
    },
  };
  rg4js('send', payload);
}
