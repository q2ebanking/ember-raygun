import Ember from 'ember';
import { initialize } from 'dummy/instance-initializers/raygun';
import { module, test } from 'qunit';
import destroyApp from '../../helpers/destroy-app';
import sinon from 'sinon';
import RSVP from 'rsvp';

let adapterException;

module('Unit | Instance Initializer | raygun', {
  beforeEach() {
    Ember.run(() => {
      this.application = Ember.Application.create();
      this.appInstance = this.application.buildInstance();
    });
    setupRg4jsStub.call(this);
    setupFilter.call(this);
    Ember.onerror = undefined;
    adapterException = Ember.Test.adapter.exception;
    Ember.Test.adapter.exception = () => null;
  },
  afterEach() {
    Ember.Test.adapter.exception = adapterException;
    Ember.onerror = undefined;
    teardownRg4jsStub.call(this);
    teardownFilter.call(this);
    Ember.run(this.appInstance, 'destroy');
    destroyApp(this.application);
  }
});

test('it sets up raygun error handling with a filter to use Ember.onerror', function(assert) {
  enableRaygun.call(this);

  initialize(this.appInstance);

  const error = new Error('onerror test');
  Ember.onerror(error);
  assert.ok(this.filterSpy.calledOnce);
  assert.ok(this.rg4jsStub.calledOnce);
  assert.ok(this.rg4jsStub.calledWith('send'));
  assert.equal(this.rg4jsStub.firstCall.args[1].error, error);
});

test('it sets up raygun error handling with a filter to use Ember.RVSP.on("error")', function(assert) {
  let done = assert.async();
  enableRaygun.call(this);

  initialize(this.appInstance);

  let error = new Error('RSVP test');
  error.name = 'RSVP test';
  RSVP.reject(error, 'test error');

  Ember.run.next(() => {
    assert.ok(this.filterSpy.called);
    assert.ok(this.rg4jsStub.called);
    assert.ok(this.rg4jsStub.calledWith('send'));
    assert.equal(this.rg4jsStub.firstCall.args[1].error, error);
    done();
  });
});

test('it sets up raygun error handling with a filter to use Ember.Logger.error', function(assert) {
  enableRaygun.call(this);

  initialize(this.appInstance);

  const error = new Error('Logger.error test');
  Ember.Logger.error(error);
  assert.ok(this.filterSpy.calledOnce);
  assert.ok(this.rg4jsStub.calledOnce);
  assert.ok(this.rg4jsStub.calledWith('send'));
  assert.equal(this.rg4jsStub.firstCall.args[1].error, error);
});

test('Ember.Logger.error does not send to raygun when sent a string (stack)', function(assert) {
  enableRaygun.call(this);

  initialize(this.appInstance);

  const error = 'Logger.error stack info';
  Ember.Logger.error(error);
  assert.equal(this.filterSpy.called, false);
  assert.equal(this.rg4jsStub.called, false);
});

test('when disabled Ember.onerror is undefined', function(assert) {
  enableRaygun.call(this, false);
  initialize(this.appInstance);
  // Ember.onerror is defined when raygun config is enabled
  assert.equal(Ember.onerror, undefined);
});

test('when disabled Ember.Logger does not send error to raygun', function(assert) {
  enableRaygun.call(this, false);
  initialize(this.appInstance);

  let error = new Error('RSVP test');
  error.name = 'RSVP test';

  Ember.Logger.error(error);
  assert.equal(this.filterSpy.called, false);
});

test('when disabled RSVP.reject does not send error to raygun', function(assert) {
  let done = assert.async();
  enableRaygun.call(this, false);

  initialize(this.appInstance);

  let error = new Error('RSVP test');
  error.name = 'RSVP test';

  RSVP.reject(error, 'test error');
  Ember.run.next(() => {
    assert.equal(this.filterSpy.called, false);
    done();
  });
});

function enableRaygun(enabled = true) {
  this.appInstance.register('config:environment', {
    raygun: {
      enabled: enabled,
      apiKey: 'secret',
    }
  });
}

function setupFilter() {
  this.filterSpy = sinon.spy(function(error) { return error; });
  this.appInstance.register('util:raygun-error-filter', this.filterSpy);
}

function teardownFilter() {
  delete this.filterSpy;
}

function setupRg4jsStub() {
  this.rg4jsStub = sinon.stub(window, 'rg4js');
}

function teardownRg4jsStub() {
  this.rg4jsStub.restore();
  delete this.rg4jsStub;
}
