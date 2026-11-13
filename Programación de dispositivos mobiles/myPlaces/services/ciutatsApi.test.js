import assert from 'node:assert/strict';
import { test } from 'node:test';
import { cercarCiutats } from './ciutatsApi.js';

test('convierte una ciudad de la API en un lugar con coordenadas', async (t) => {
  t.mock.method(globalThis, 'fetch', async () => ({
    ok: true,
    json: async () => ({
      results: [{ id: 2512989, name: 'Palma', country: 'España', latitude: 39.57, longitude: 2.65 }],
    }),
  }));

  assert.deepEqual(await cercarCiutats('Palma'), [{
    id: 'ciutat-2512989',
    nom: 'Palma',
    descripcio: 'España',
    tipus: 'ciutat',
    latitude: 39.57,
    longitude: 2.65,
  }]);
});

test('devuelve una lista vacía cuando la API no encuentra resultados', async (t) => {
  t.mock.method(globalThis, 'fetch', async () => ({ ok: true, json: async () => ({}) }));
  assert.deepEqual(await cercarCiutats('zzzzzzzz'), []);
});

test('rechaza una respuesta HTTP fallida', async (t) => {
  t.mock.method(globalThis, 'fetch', async () => ({ ok: false }));
  await assert.rejects(cercarCiutats('Palma'), /No se pudieron consultar las ciudades/);
});

test('rechaza resultados con formato incorrecto', async (t) => {
  t.mock.method(globalThis, 'fetch', async () => ({
    ok: true,
    json: async () => ({ results: [{ id: 1, name: 'Palma' }] }),
  }));
  await assert.rejects(cercarCiutats('Palma'), /formato inesperado/);
});

test('propaga un fallo de conexión para que la pantalla pueda informar', async (t) => {
  t.mock.method(globalThis, 'fetch', async () => { throw new Error('Sin conexión'); });
  await assert.rejects(cercarCiutats('Palma'), /Sin conexión/);
});
