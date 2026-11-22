'use strict';

// VladX: Italian keywords for .vlx files, Italian standard library names,
// and plain JavaScript left untouched.

require('../common');
const assert = require('assert');
const { spawnSyncAndExitWithoutError } = require('../common/child_process');
const fixtures = require('../common/fixtures');

// .vlx programs run (keywords, modules, classes, async, stdlib names).
for (const file of ['ciao.vlx', 'biblioteca.vlx', 'valuta.vlx']) {
  spawnSyncAndExitWithoutError(process.execPath, [fixtures.path('vladx', file)]);
}

// eval from VladX code is VladX; the Function constructor takes JavaScript.
spawnSyncAndExitWithoutError(process.execPath, [fixtures.path('vladx', 'valuta.vlx')], {
  stdout: 'eval VladX: 2\nFunction JS: 7\n',
});

// A .vlx module can be required from JavaScript.
assert.strictEqual(require(fixtures.path('vladx', 'valuta.vlx')).valore, 'da vlx');

// Italian words are plain identifiers in JavaScript.
{
  const se = 1, per = 2, funzione = 3;
  assert.strictEqual(se + per + funzione, 6);
}

// Italian standard library names are aliases of the same functions.
assert.strictEqual(Array.prototype.mappa, Array.prototype.map);
assert.strictEqual(console.stampa, console.log);
assert.strictEqual(Matematica, Math);
assert.strictEqual([1, 2, 3].lunghezza, 3);
assert.deepStrictEqual(Object.keys([1]), ['0']);
