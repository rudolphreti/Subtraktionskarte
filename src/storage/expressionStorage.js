import { defaultExpressions } from '../domain/expressions.js';

const storageKey = 'subtraktionskarte:expressions:v1';
const schemaVersion = 1;

function isValidStoredState(value) {
  return (
    value &&
    value.version === schemaVersion &&
    Array.isArray(value.expressions) &&
    value.expressions.every((expression) => typeof expression === 'string')
  );
}

export function loadExpressions(storage = window.localStorage) {
  const fallback = [...defaultExpressions];

  try {
    const rawValue = storage.getItem(storageKey);
    if (!rawValue) {
      return fallback;
    }

    const parsedValue = JSON.parse(rawValue);
    return isValidStoredState(parsedValue) ? parsedValue.expressions : fallback;
  } catch {
    return fallback;
  }
}

export function saveExpressions(expressions, storage = window.localStorage) {
  const safeExpressions = Array.isArray(expressions)
    ? expressions.filter((expression) => typeof expression === 'string')
    : [];

  storage.setItem(
    storageKey,
    JSON.stringify({
      version: schemaVersion,
      expressions: safeExpressions,
    }),
  );
}
