import Ember from 'ember';
import RaygunInitializer from 'dummy/initializers/raygun';
import { module, test } from 'qunit';
import destroyApp from '../../helpers/destroy-app';
import sinon from 'sinon';

const { initialize } = RaygunInitializer;

module('Unit | Initializer | tracking', {
  beforeEach() {
    Ember.run(() => {
      this.application = Ember.Application.create();
      this.application.deferReadiness();
    });
    this.stub = sinon.stub(window, 'rg4js');
  },
  afterEach() {
    this.stub.restore();
    delete this.stub;
    destroyApp(this.application);
  }
});

test('calls rg4js to set apiKey setting', function(assert) {
  initialize(this.application);
  assert.equal(this.stub.calledWith('apiKey'), true);
});

test('calls rg4js to set enableCrashReporting setting ', function(assert) {
  initialize(this.application);
  assert.equal(this.stub.calledWith('apiKey'), true);
});

test('can enable Pulse using tracking initializer', function(assert) {
  initialize(this.application);
  assert.equal(this.stub.calledWith('enablePulse'), true);
});

test('can use real user tracking instead of anonymous using enableUserTracking setting', function(assert) {
  initialize(this.application);
  assert.equal(this.stub.calledWith('setUser'), true);
});
