export const defaultExpressions = ['12 - 4 = 8', '9 - 3 = 6', '7 - 5 = 2'];

export function formatExpressionsAsTextList(expressions) {
  if (!Array.isArray(expressions)) {
    return '';
  }

  return expressions
    .map((expression) => String(expression).trim())
    .filter(Boolean)
    .join(', ');
}

export function parseExpressionsTextList(text) {
  return String(text)
    .split(',')
    .map((expression) => expression.trim())
    .filter(Boolean);
}
