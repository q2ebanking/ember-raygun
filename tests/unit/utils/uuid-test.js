import { uuid } from 'ember-raygun/utils/uuid';
import { module, test } from 'qunit';

module('Unit | Utility | uuid');

test('generate a uuid', function(assert) {
  let result = uuid();
  assert.equal(result.length, 36);
  assert.equal(result.split('-').length, 5);
});
