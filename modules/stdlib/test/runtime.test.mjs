import test from 'node:test';
import assert from 'node:assert/strict';
import { encode, validator, field, tuple, map, switchMap, of } from '../runtime.mjs';
import { lastValueFrom, toArray } from 'rxjs';

test('schema codecs preserve nested tuple fields and reject bad data without coercion', () => {
  const schema = {
    type: 'object',
    properties: {
      person: {
        type: 'object',
        properties: { first: { type: 'string' } },
        required: ['first'],
        additionalProperties: false,
      },
    },
    required: ['person'],
    additionalProperties: false,
  };
  const validate = validator(schema);
  const original = { person: { first: 'Dan' } };
  const valid = validate(original);
  assert.equal(valid.tag, 'ok');
  assert.equal(field(field(valid.value, 'person'), 'first'), 'Dan');
  assert.deepEqual(encode(valid.value), original);
  assert.deepEqual(original, { person: { first: 'Dan' } });
  assert.equal(validate({ person: { first: 42 } }).tag, 'error');
  assert.equal(validate({ person: { first: 'Dan', extra: true } }).tag, 'error');
  assert.deepEqual(encode(tuple(['__proto__'], ['safe'])), JSON.parse('{"__proto__":"safe"}'));
  assert.throws(() => encode(Infinity), /JSON encodable/);
});

test('stdlib operators delegate to RxJS and constants emit once', async () => {
  assert.deepEqual(await lastValueFrom(map((x) => x + 1, of(1)).pipe(toArray())), [2]);
  assert.deepEqual(await lastValueFrom(switchMap((x) => of(x, x), of('a')).pipe(toArray())), ['a', 'a']);
});
