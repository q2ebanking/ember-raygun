import Ember from 'ember';
import RaygunInitializer from 'dummy/initializers/raygun';
import { module, test } from 'qunit';
import destroyApp from '../../helpers/destroy-app';
import sinon from 'sinon';

const { initialize } = RaygunInitializer;

module('Unit | Initializer | raygun', {
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
  assert.ok(this.stub.calledWith('apiKey'));
});

test('calls rg4js to set enableCrashReporting setting', function(assert) {
  initialize(this.application);
  assert.ok(this.stub.calledWith('apiKey'));
});

test('can enable Pulse using tracking initializer', function(assert) {
  initialize(this.application);
  assert.ok(this.stub.calledWith('enablePulse'));
});

test('can use real user tracking instead of anonymous using enableUserTracking setting', function(assert) {
  initialize(this.application);
  assert.equal(this.stub.calledWith('setUser'), true);
});

test('without stored Raygun user id, sends anonymous user info', function(assert) {
  initialize(this.application);
  const args = this.stub.args.filter(function(arg) { return arg[0] === 'setUser'})[0];
  assert.ok(args);
  assert.ok(args[1].isAnonymous);
});

test('with stored Raygun user id, sends active user info', function(assert) {
  window.localStorage.setItem('raygunUserId', '999');

  initialize(this.application);
  const args = this.stub.args.filter(function(arg) { return arg[0] === 'setUser'})[0];
  assert.ok(args);
  assert.equal(args[1].isAnonymous, false);
  assert.equal(args[1].identifier, '999');

  window.localStorage.removeItem('raygunUserId')
});
