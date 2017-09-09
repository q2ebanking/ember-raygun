import { moduleFor, test } from 'ember-qunit';
import sinon from 'sinon';

moduleFor('service:raygun', 'Unit | Service | raygun', {
  beforeEach() {
    clearStorage();
    this.stub = sinon.stub(window, 'rg4js');
    this.service = this.subject();
  },
  afterEach() {
    delete this.service;
    this.stub.restore();
    delete this.stub;
    clearStorage();
  }
});

test('sets anonymous user info using setUser without an id', function(assert) {
  assert.ok(this.service);

  assert.ok(!window.localStorage.getItem('raygunAnonymousUserId'));
  this.service.setUser();
  assert.ok(this.stub.called);
  assert.ok(this.stub.firstCall.calledWith('setUser'));
  assert.ok(this.stub.firstCall.args[1].identifier);
  assert.ok(this.stub.firstCall.args[1].isAnonymous);
  assert.ok(window.localStorage.getItem('raygunAnonymousUserId'));
});

test('sets anonymous user using setAnonymousUser method', function(assert) {
  const storedId = '123';
  window.localStorage.setItem('raygunUserId', storedId);
  this.service.setAnonymousUser();
  assert.ok(!window.localStorage.getItem('raygunUserId'));
  assert.ok(this.stub.called);
  assert.ok(this.stub.firstCall.calledWith('setUser'));
  assert.ok(this.stub.firstCall.args[1].identifier);
  assert.ok(this.stub.firstCall.args[1].isAnonymous);
});

test('sets real user info', function(assert) {
  const userId = '123';
  this.service.setUser(userId);
  assert.ok(this.stub.called);
  assert.ok(this.stub.firstCall.calledWith('setUser'));
  assert.equal(this.stub.firstCall.args[1].identifier, userId);
  assert.ok(!this.stub.firstCall.args[1].isAnonymous);
});

test('gets user id', function(assert) {
  const storedId = '456';
  window.localStorage.setItem('raygunUserId', storedId);
  const id = this.service.getUser();
  assert.equal(id, storedId);
  window.localStorage.removeItem('raygunUserId');
});

test('clears stored user id', function(assert) {
  const storedId = '789';
  window.localStorage.setItem('raygunUserId', storedId);
  this.service.clearUser();
  assert.ok(!window.localStorage.getItem('raygunUserId'));
});

test('tracks page view event', function(assert) {
  this.service.pageView('/flow/1');
  assert.ok(this.stub.called);
  assert.ok(this.stub.firstCall.calledWith('trackEvent'));
  assert.equal(this.stub.firstCall.args[1].type, 'pageView');
  assert.equal(this.stub.firstCall.args[1].path, '/flow/1');
});

function clearStorage() {
  window.localStorage.removeItem('raygunUserId');
  window.localStorage.removeItem('raygunAnonymousUserId');
}
