const test = require('node:test');
const assert = require('node:assert/strict');
const { makeFolderName, isSafeFolderName } = require('../dist/utils/folderName.util');
test('folder names are readable, distinct across case, and safe for SMB paths', () => {
  assert.equal(makeFolderName('Budi Santoso', 'budi@example.test', []), 'Google Drive - Budi Santoso');
  assert.equal(makeFolderName('Budi Santoso', 'budi@example.test', ['google drive - budi santoso']), 'Google Drive - Budi Santoso (2)');
  const safe = makeFolderName('../A:B/C', 'budi@example.test', []);
  assert.ok(isSafeFolderName(safe));
  assert.ok(!isSafeFolderName('../other')); assert.ok(!isSafeFolderName('name.'));
});
