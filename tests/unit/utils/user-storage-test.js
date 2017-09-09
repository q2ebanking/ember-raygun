import { getAnonymousId, removeAnonymousUserId, getUserId, removeUserId, setUserId } from 'ember-raygun/utils/user-storage';
import { module, test } from 'qunit';

module('Unit | Utility | user storage', {
  beforeEach: clearStorage,
  afterEach: clearStorage
});

test('gets an anonymous user id', function(assert) {
  window.localStorage.setItem('raygunAnonymousUserId', '123');
  let uuid = getAnonymousId();
  assert.equal(uuid, '123');
});

test('creates an anonymous user id', function(assert) {
  let uuid = getAnonymousId();
  assert.ok(uuid);
});

test('removes an anonymous user id', function(assert) {
  window.localStorage.setItem('raygunAnonymousUserId', '456');
  removeAnonymousUserId();
  assert.ok(!window.localStorage.getItem('raygunAnonymousUserId'));
});

test('gets an user id', function(assert) {
  window.localStorage.setItem('raygunUserId', '123');
  let uuid = getUserId();
  assert.equal(uuid, '123');
});

test('removes an user id', function(assert) {
  window.localStorage.setItem('raygunUserId', '456');
  removeUserId();
  assert.ok(!window.localStorage.getItem('raygunUserId'));
});

test('sets an user id', function(assert) {
  assert.ok(!window.localStorage.getItem('raygunUserId'));
  setUserId('789');
  assert.equal(window.localStorage.getItem('raygunUserId'), '789');
});

function clearStorage() {
  window.localStorage.removeItem('raygunAnonymousUserId');
  window.localStorage.removeItem('raygunUserId');
}
