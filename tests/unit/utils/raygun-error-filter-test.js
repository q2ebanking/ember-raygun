import raygunErrorFilter from 'dummy/utils/raygun-error-filter';
import { module, test } from 'qunit';

module('Unit | Utility | raygun error filter');

test('filter xhr error per status value', function(assert) {
  let error = new Error('Error: API failure response');
  error.xhr = { status: 409 };
  let result = raygunErrorFilter(error);
  assert.equal(result, null);
});

test('filteringing non-xhr error', function(assert) {
  let error = new TypeError('Type failure');
  let result = raygunErrorFilter(error);
  assert.equal(result, error);
});
