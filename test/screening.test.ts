// Run with "pnpm test". Guards the rules that keep unscreened donor names and comments off stream.
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { approvedComment, isScreened } from '../src/extension/util/screening.ts';

test('only completed, screened donations are shown', () => {
  const donation = (readstate: string, transactionstate = 'COMPLETED') => ({ readstate, transactionstate });
  assert.equal(isScreened(donation('PENDING')), false);
  assert.equal(isScreened(donation('FLAGGED')), false);
  assert.equal(isScreened(donation('READY', 'PENDING')), false);
  assert.equal(isScreened(donation('READY')), true);
  assert.equal(isScreened(donation('READ')), true);
});

test('only approved comments are shown', () => {
  assert.equal(approvedComment({ commentstate: 'PENDING', comment: 'Hello' }), null);
  assert.equal(approvedComment({ commentstate: 'DENIED', comment: 'Hello' }), null);
  assert.equal(approvedComment({ commentstate: 'APPROVED', comment: '  ' }), null);
  assert.equal(approvedComment({ commentstate: 'APPROVED', comment: ' Hello ' }), 'Hello');
});
