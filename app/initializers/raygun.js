import config from '../config/environment';
import initialize from 'ember-raygun/initializers/raygun';
import initializePulse from 'ember-raygun/initializers/tracking';

export default {
  name: 'ember-raygun',

  initialize(/*application*/) {
    initialize(config);
    initializePulse(config);
  }
};
