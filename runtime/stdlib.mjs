import Ajv from 'ajv';
import { identity, join } from 'ramda';
import { map as rxMap, switchMap as rxSwitchMap, of } from 'rxjs';

export { identity, join, of };
export const map = (fn, source) => source.pipe(rxMap(fn));
export const switchMap = (fn, source) => source.pipe(rxSwitchMap(fn));

// Значения кортежа — массив, имена полей — отдельный дескриптор.
// Полиморфная проекция пока находит индекс через layout; последующий backend
// сможет специализировать доступ до постоянного индекса.
const layout = Symbol('entropy.tuple.layout');
export function tuple(names, values) {
  Object.defineProperty(values, layout, { value: Object.freeze([...names]) });
  return Object.freeze(values);
}
export function field(value, name) {
  const index = value?.[layout]?.indexOf(name) ?? -1;
  if (index < 0) throw new TypeError(`Missing tuple field: ${name}`);
  return value[index];
}
export function encode(value) {
  if (Array.isArray(value)) {
    const names = value[layout];
    if (names) return Object.fromEntries(names.map((name, i) => [name, encode(value[i])]));
    return value.map(encode);
  }
  if (value === null || typeof value === 'string' || typeof value === 'boolean') return value;
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (value && (Object.getPrototypeOf(value) === Object.prototype || Object.getPrototypeOf(value) === null)) {
    return Object.fromEntries(Object.entries(value).map(([key, v]) => [key, encode(v)]));
  }
  throw new TypeError('Value is not JSON encodable');
}

const ajv = new Ajv({ allErrors: true, strict: true, coerceTypes: false, useDefaults: false, removeAdditional: false });
function codec(schema) {
  if (schema.type === 'string') return value => value;
  const names = Object.keys(schema.properties).sort();
  const children = names.map(name => codec(schema.properties[name]));
  return value => tuple(names, names.map((name, i) => children[i](value[name])));
}
export function validator(schema) {
  const check = ajv.compile(schema);
  const decode = codec(schema);
  return value => check(value)
    ? Object.freeze({ tag: 'ok', value: decode(value) })
    : Object.freeze({ tag: 'error', error: Object.freeze((check.errors ?? []).map(error => Object.freeze({
        path: error.instancePath,
        keyword: error.keyword,
        message: error.message,
      }))) });
}
export const validate = (schema, value) => schema(value);
export const fold = (onError, onValue, result) => result.tag === 'ok' ? onValue(result.value) : onError(result.error);
