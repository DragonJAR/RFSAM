import { test } from 'node:test';
import assert from 'node:assert/strict';
import { checkControl } from './validate.mjs';

const registries = {
  bsamKeys: new Set(['BSAM-EN-01']),
  resourceIds: new Set(['RFSAM-RES-06']),
  toolSlugs: new Set(['btlejack']),
};

function base(overrides = {}) {
  return {
    data: {
      id: 'RFSAM-BLE-AT-01', protocol: 'BLE', layer: 'AT', criticality: 'high',
      title: 'Hijack', reviewStatus: 'stub', confidence: 'low',
      attacks: [], references: [], bsam: [], resources: [], tools: [],
      ...overrides.data,
    },
    body: overrides.body ?? '## Mechanism\n\nx\n',
    file: 'rfsam-ble-at-01.md',
  };
}

test('a clean stub passes', () => {
  assert.deepEqual(checkControl(base(), registries), []);
});

test('id layer/protocol segment must match fields', () => {
  const errs = checkControl(base({ data: { layer: 'CR' } }), registries);
  assert.ok(errs.some((e) => /layer segment/i.test(e)));
});

test('attack refs must exist in references', () => {
  const errs = checkControl(base({ data: { attacks: [{ name: 'x', refs: ['ghost'], summary: 's' }] } }), registries);
  assert.ok(errs.some((e) => /unknown reference key 'ghost'/i.test(e)));
});

test('bsam, resource and tool refs must resolve', () => {
  const errs = checkControl(base({ data: { bsam: ['BSAM-XX-99'], resources: ['RFSAM-RES-99'], tools: ['ghosttool'] } }), registries);
  assert.equal(errs.filter((e) => /unknown/i.test(e)).length, 3);
});

test('verified controls need objective, a reference and zero open flags', () => {
  const errs = checkControl(base({
    data: { reviewStatus: 'verified', references: [] },
    body: '## Mechanism\n\n> [!FLAG] unsure\n',
  }), registries);
  assert.ok(errs.some((e) => /objective/i.test(e)));
  assert.ok(errs.some((e) => /at least one reference/i.test(e)));
  assert.ok(errs.some((e) => /unresolved \[!FLAG\]/i.test(e)));
});
