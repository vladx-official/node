'use strict';

// VladX: installs the Italian names of the standard library (see
// lib/internal/vladx/traduzioni.js). Runs for every realm (main thread and
// workers), after the Node.js and web globals have been set up.

const {
  ObjectDefineProperty,
  ObjectGetOwnPropertyDescriptor,
  ObjectHasOwn,
  ObjectKeys,
  StringPrototypeSplit,
} = primordials;

const { globali, tabelle } = require('internal/vladx/traduzioni');

function risolvi(percorso) {
  let obiettivo = globalThis;
  const parti = StringPrototypeSplit(percorso, '.');
  for (let i = 0; i < parti.length; i++) {
    if (obiettivo == null) return undefined;
    obiettivo = obiettivo[parti[i]];
  }
  return obiettivo;
}

function installaAlias(obiettivo, italiano, inglese) {
  if (ObjectHasOwn(obiettivo, italiano)) return;
  const descrittore = ObjectGetOwnPropertyDescriptor(obiettivo, inglese);
  if (descrittore === undefined) return;
  descrittore.enumerable = false;
  ObjectDefineProperty(obiettivo, italiano, descrittore);
}

function installaIstanza(obiettivo, italiano, inglese) {
  if (ObjectHasOwn(obiettivo, italiano)) return;
  ObjectDefineProperty(obiettivo, italiano, {
    __proto__: null,
    get() { return this[inglese]; },
    set(valore) { this[inglese] = valore; },
    enumerable: false,
    configurable: true,
  });
}

for (const { 0: percorso, 1: tipo, 2: nomi } of tabelle) {
  const obiettivo = risolvi(percorso);
  if (obiettivo == null) continue;
  const chiavi = ObjectKeys(nomi);
  for (let i = 0; i < chiavi.length; i++) {
    const italiano = chiavi[i];
    if (tipo === 'istanza') {
      installaIstanza(obiettivo, italiano, nomi[italiano]);
    } else {
      installaAlias(obiettivo, italiano, nomi[italiano]);
    }
  }
}

// Globals last, so that e.g. `Vettore` already has its Italian methods.
// Accessor globals (like `process`) are read dynamically.
{
  const chiavi = ObjectKeys(globali);
  for (let i = 0; i < chiavi.length; i++) {
    const italiano = chiavi[i];
    const inglese = globali[italiano];
    if (ObjectHasOwn(globalThis, italiano)) continue;
    const descrittore = ObjectGetOwnPropertyDescriptor(globalThis, inglese);
    if (descrittore === undefined) continue;
    if (descrittore.get !== undefined || descrittore.set !== undefined) {
      installaIstanza(globalThis, italiano, inglese);
    } else {
      ObjectDefineProperty(globalThis, italiano, {
        __proto__: null,
        value: descrittore.value,
        writable: true,
        enumerable: false,
        configurable: true,
      });
    }
  }
}
