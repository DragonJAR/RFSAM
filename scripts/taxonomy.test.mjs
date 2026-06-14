import { test } from 'node:test';
import assert from 'node:assert/strict';
import { LAYER_IDS, PROTOCOL_IDS, parseControlId } from '../src/lib/taxonomy.js';

test('layer and protocol id sets', () => {
  assert.deepEqual(LAYER_IDS, ['IG', 'SP', 'PHY', 'LL', 'CR', 'AT', 'AP']);
  assert.ok(PROTOCOL_IDS.includes('BLE'));
  assert.ok(PROTOCOL_IDS.includes('ZIGBEE'));
  assert.equal(PROTOCOL_IDS.length, 14);
});

test('parseControlId splits a valid id', () => {
  assert.deepEqual(parseControlId('RFSAM-BLE-CR-01'), { protocol: 'BLE', layer: 'CR', nn: '01' });
});

test('parseControlId rejects a malformed id', () => {
  assert.equal(parseControlId('RFSAM-BLE-XX-01'), null);
  assert.equal(parseControlId('BLE-CR-01'), null);
  assert.equal(parseControlId('RFSAM-BLE-CR-1'), null);
});
