import isTruthyStringBoolean from 'ember-raygun/utils/is-truthy-string-boolean';
import { module, test } from 'qunit';

module('Unit | Utility | is truthy string boolean');

test('is not false when value is not string or boolean', function(assert) {
  [null, undefined, {}, 1, 0, new Date()].forEach((actual) => {
    let result = isTruthyStringBoolean(actual);
    assert.equal(result, false);
  });
});

test('is true when value is true', function(assert) {
  const val = true;
  const result = isTruthyStringBoolean(val);
  assert.equal(result, true);
});

test('is true when value is a string with the characters "true"', function(assert) {
  let val = 'true';
  let result = isTruthyStringBoolean(val);
  assert.equal(result, true);
  val = 'True';
  result = isTruthyStringBoolean(val);
  assert.equal(result, true);
  val = 'TRUE';
  result = isTruthyStringBoolean(val);
  assert.equal(result, true);
});

test('is false when value is false', function(assert) {
  let val = false;
  const result = isTruthyStringBoolean(val);
  assert.equal(result, false);
});

test('is false when value is a string with the characters "false"', function(assert) {
  let val = 'false';
  let result = isTruthyStringBoolean(val);
  assert.equal(result, false);
  val = 'False';
  result = isTruthyStringBoolean(val);
  assert.equal(result, false);
  val = 'FALSE';
  result = isTruthyStringBoolean(val);
  assert.equal(result, false);
});
