import assert from 'node:assert/strict';
import { test } from 'node:test';
import { cercarLlocsPropers, consultarResumWikipedia } from './properApi.js';

test('busca candidatos a 2 km y descarta artículos históricos aunque tengan coordenadas', async (t) => {
    const lloc = { pageid: 123, title: 'Fuente de Neptuno', lat: 52.519, lon: 13.407, dist: 150 };
    const historia = { ...lloc, pageid: 456, title: 'Segundo Imperio francés' };
    t.mock.method(globalThis, 'fetch', async (url) => {
        const peticio = new URL(url);
        let dades;
        if (peticio.searchParams.get('list') === 'geosearch') {
            assert.equal(peticio.searchParams.get('gscoord'), '52.52|13.405');
            assert.equal(peticio.searchParams.get('gsradius'), '2000');
            assert.equal(peticio.searchParams.get('gslimit'), '30');
            dades = { query: { geosearch: [historia, lloc] } };
        } else if (peticio.hostname === 'es.wikipedia.org') {
            dades = { query: { pages: [
                { pageid: 123, pageprops: { wikibase_item: 'Q123' } },
                { pageid: 456, pageprops: { wikibase_item: 'Q456' } },
            ] } };
        } else {
            assert.equal(peticio.hostname, 'www.wikidata.org');
            const tipus = (id) => ({ mainsnak: { datavalue: { value: { id } } } });
            dades = { entities: {
                Q123: { claims: { P31: [tipus('Q483453')] } },
                Q456: { claims: { P31: [tipus('Q3024240')] } },
                Q483453: { claims: { P279: [tipus('Q860861')] } },
                Q3024240: { claims: {} },
            } };
        }
        assert.equal(peticio.searchParams.get('origin'), '*');
        return { ok: true, json: async () => dades };
    });
    assert.deepEqual(await cercarLlocsPropers(52.52, 13.405), [lloc]);
});

test('informa si falla la clasificación y no devuelve artículos sin filtrar', async (t) => {
    t.mock.method(globalThis, 'fetch', async (url) => {
        if (!new URL(url).searchParams.has('list')) return { ok: false, status: 503 };
        return { ok: true, json: async () => ({ query: { geosearch: [
            { pageid: 123, title: 'París', lat: 48.85, lon: 2.35 },
        ] } }) };
    });
    await assert.rejects(cercarLlocsPropers(48.85, 2.35), /503/);
});

test('limita a diez lugares confirmados y omite los que no tienen clasificación', async (t) => {
    const llocs = Array.from({ length: 12 }, (_, i) => ({
        pageid: i + 1, title: `Museo ${i + 1}`, lat: 48.85, lon: 2.35,
    }));
    t.mock.method(globalThis, 'fetch', async (url) => {
        const params = new URL(url).searchParams;
        let dades;
        if (params.has('list')) dades = { query: { geosearch: llocs } };
        else if (params.get('prop') === 'pageprops') dades = { query: { pages: llocs.map((lloc) => ({
            pageid: lloc.pageid,
            pageprops: lloc.pageid === 1 ? {} : { wikibase_item: `Q${lloc.pageid}` },
        })) } };
        else dades = { entities: Object.fromEntries(llocs.slice(1).map((lloc) => [
            `Q${lloc.pageid}`, { claims: { P31: [{ mainsnak: { datavalue: { value: { id: 'Q33506' } } } }] } },
        ])) };
        return { ok: true, json: async () => dades };
    });
    assert.deepEqual(await cercarLlocsPropers(48.85, 2.35), llocs.slice(1, 11));
});

test('informa de errores HTTP de Wikidata', async (t) => {
    t.mock.method(globalThis, 'fetch', async (url) => {
        const peticio = new URL(url);
        if (peticio.hostname === 'www.wikidata.org') return { ok: false, status: 503 };
        const dades = peticio.searchParams.has('list')
            ? { query: { geosearch: [{ pageid: 123, title: 'Museo', lat: 48.85, lon: 2.35 }] } }
            : { query: { pages: [{ pageid: 123, pageprops: { wikibase_item: 'Q123' } }] } };
        return { ok: true, json: async () => dades };
    });
    await assert.rejects(cercarLlocsPropers(48.85, 2.35), /Wikidata.*503/);
});

test('acepta que no haya artículos cercanos', async (t) => {
    t.mock.method(globalThis, 'fetch', async () => ({
        ok: true, json: async () => ({ query: { geosearch: [] } }),
    }));
    assert.deepEqual(await cercarLlocsPropers(0, 0), []);
});

test('informa de un error HTTP de Wikipedia', async (t) => {
    t.mock.method(globalThis, 'fetch', async () => ({ ok: false, status: 503 }));
    await assert.rejects(cercarLlocsPropers(52.52, 13.405), /Wikipedia.*503/);
});

test('rechaza respuestas incompletas o errores de la API', async (t) => {
    for (const dades of [{ error: { code: 'badvalue' } }, { query: { geosearch: [{}] } }]) {
        t.mock.method(globalThis, 'fetch', async () => ({ ok: true, json: async () => dades }));
        await assert.rejects(cercarLlocsPropers(52.52, 13.405), /formato inesperado/);
        t.mock.restoreAll();
    }
});

test('consulta la introducción de un artículo como texto sin HTML', async (t) => {
    t.mock.method(globalThis, 'fetch', async (url) => {
        const params = new URL(url).searchParams;
        assert.equal(params.get('pageids'), '123');
        assert.equal(params.get('prop'), 'extracts');
        assert.equal(params.get('exintro'), '1');
        assert.equal(params.get('explaintext'), '1');
        assert.equal(params.get('origin'), '*');
        return { ok: true, json: async () => ({ query: { pages: [{ extract: ' Un monumento de París. ' }] } }) };
    });
    assert.equal(await consultarResumWikipedia(123), 'Un monumento de París.');
});

test('el resumen informa de fallos HTTP y de conexión', async (t) => {
    t.mock.method(globalThis, 'fetch', async () => ({ ok: false, status: 503 }));
    await assert.rejects(consultarResumWikipedia(123), /Wikipedia.*503/);
    t.mock.restoreAll();
    t.mock.method(globalThis, 'fetch', async () => { throw new Error('Sin conexión'); });
    await assert.rejects(consultarResumWikipedia(123), /Sin conexión/);
});

test('rechaza un resumen vacío, una página ausente o un formato incorrecto', async (t) => {
    for (const dades of [{ query: { pages: [{ extract: '  ' }] } }, {}, { query: { pages: [{ extract: 123 }] } }]) {
        t.mock.method(globalThis, 'fetch', async () => ({ ok: true, json: async () => dades }));
        await assert.rejects(consultarResumWikipedia(123), /No hay un resumen disponible/);
        t.mock.restoreAll();
    }
});

test('no consulta Wikipedia con un identificador inválido', async (t) => {
    const peticio = t.mock.method(globalThis, 'fetch');
    await assert.rejects(consultarResumWikipedia(NaN), /identificador/);
    assert.equal(peticio.mock.callCount(), 0);
});
