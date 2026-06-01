import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  formatExpressionsAsTextList,
  parseExpressionsTextList,
} from '../src/domain/expressions.js';

describe('expression text list formatting', () => {
  it('formats expressions as a comma-separated txt list instead of JSON', () => {
    const expressions = ['12 - 4 = 8', '9 - 3 = 6', '7 - 5 = 2'];

    const result = formatExpressionsAsTextList(expressions);

    assert.equal(result, '12 - 4 = 8, 9 - 3 = 6, 7 - 5 = 2');
    assert.doesNotMatch(result, /^\[/);
    assert.doesNotMatch(result, /"12 - 4 = 8"/);
  });

  it('parses comma-separated txt expressions and trims whitespace', () => {
    const result = parseExpressionsTextList(
      '12 - 4 = 8,  9 - 3 = 6, , 7 - 5 = 2',
    );

    assert.deepEqual(result, ['12 - 4 = 8', '9 - 3 = 6', '7 - 5 = 2']);
  });
});
