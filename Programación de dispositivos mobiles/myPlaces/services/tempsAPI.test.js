import assert from 'node:assert/strict';
import { test } from 'node:test';
import { consultarTemperatura } from './tempsAPI.js';

test('acepta temperaturas de cero y negativas', async (t) => {
    for (const temperatura of [0, -4.6]) {
        t.mock.method(globalThis, 'fetch', async () => ({
            ok: true, json: async () => ({ current: { temperature_2m: temperatura } }),
        }));
        assert.equal(await consultarTemperatura(40.4, -3.7), temperatura);
        t.mock.restoreAll();
    }
});

test('rechaza fallos HTTP y datos de temperatura ausentes', async (t) => {
    t.mock.method(globalThis, 'fetch', async () => ({ ok: false }));
    await assert.rejects(consultarTemperatura(40.4, -3.7), /No se pudo consultar/);
    t.mock.restoreAll();
    t.mock.method(globalThis, 'fetch', async () => ({ ok: true, json: async () => ({}) }));
    await assert.rejects(consultarTemperatura(40.4, -3.7), /temperatura válida/);
});
