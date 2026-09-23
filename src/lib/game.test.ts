import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildQuestions, levels } from './game.ts';
import { capitals, paths } from './map.ts';

test('every level builds 23 valid questions', () => {
  for (const level of levels) {
    const questions = buildQuestions(level);
    assert.equal(questions.length, 23);
    for (const q of questions) {
      assert.equal(q.options.length, level.options, q.province);
      assert.equal(new Set(q.options).size, q.options.length, q.province);
      assert.ok(q.options.includes(q.capital), q.province);
      assert.ok(paths[q.province], `missing map path for ${q.province}`);
      assert.ok(capitals[q.province], `missing capital point for ${q.province}`);
    }
  }
});
