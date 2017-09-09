/* global rg4js */
import isTruthy from 'ember-raygun/utils/is-truthy-string-boolean';

export default function(config) {
  const raygunConfig = config.raygun;
  if (raygunConfig && raygunConfig.apiKey && isTruthy(raygunConfig.enabled)) {
    rg4js('enablePulse', isTruthy(raygunConfig.enablePulse));
  }
}
