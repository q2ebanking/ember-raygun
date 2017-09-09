import Ember from 'ember';
import { initialize } from 'dummy/instance-initializers/tracking';
import { module, test } from 'qunit';
import destroyApp from '../../helpers/destroy-app';
import sinon from 'sinon';

module('Unit | Instance Initializer | tracking', {
  beforeEach() {
    Ember.run(() => {
      this.application = Ember.Application.create();
      this.appInstance = this.application.buildInstance();
      const router = this.appInstance.lookup('router:main');
      this.stub = sinon.stub(router, 'on');
    });
  },
  afterEach() {
    this.stub.restore();
    Ember.run(this.appInstance, 'destroy');
    destroyApp(this.application);
    delete this.stub;
    delete this.appInstance;
    delete this.application;
  }
});

test('calls router.on to subscribe to didTransition event', function(assert) {
  initialize(this.appInstance);
  assert.equal(this.stub.called, true);
  assert.equal(this.stub.calledWith('didTransition'), true);
});
