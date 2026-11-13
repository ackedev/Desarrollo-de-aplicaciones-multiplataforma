const tipusVisitables = {
    Q570116: 'atracción turística',
    Q33506: 'museo',
    Q4989906: 'monumento',
    Q22698: 'parque',
    Q1107656: 'jardín',
    Q41176: 'edificio',
    Q12518: 'torre',
    Q174782: 'plaza',
    Q12280: 'puente',
    Q24354: 'teatro',
    Q16560: 'palacio',
    Q23413: 'castillo',
    Q16970: 'iglesia',
    Q2977: 'catedral',
    Q860861: 'escultura',
    Q179700: 'estatua',
    Q839954: 'yacimiento arqueológico',
};

function idsPropietat(entitat, propietat) {
    const afirmacions = entitat?.claims?.[propietat] ?? [];
    if (!Array.isArray(afirmacions)) throw new Error('Wikidata devolvió un formato inesperado.');
    return afirmacions.map((afirmacio) => afirmacio.mainsnak?.datavalue?.value?.id)
        .filter((id) => typeof id === 'string' && /^Q\d+$/.test(id));
}

async function consultarEntitats(ids) {
    const entitats = {};
    for (let i = 0; i < ids.length; i += 50) {
        const resposta = await fetch(
            `https://www.wikidata.org/w/api.php?action=wbgetentities&ids=${encodeURIComponent(ids.slice(i, i + 50).join('|'))}&props=claims&format=json&origin=*`
        );
        if (!resposta.ok) throw new Error(`Wikidata devolvió HTTP ${resposta.status}`);
        const dades = await resposta.json();
        if (!dades?.entities || typeof dades.entities !== 'object' || Array.isArray(dades.entities)) {
            throw new Error('Wikidata devolvió un formato inesperado.');
        }
        Object.assign(entitats, dades.entities);
    }
    return entitats;
}

export async function cercarLlocsPropers(latitude, longitude) {
    const resposta = await fetch(
        `https://es.wikipedia.org/w/api.php?action=query&list=geosearch&gscoord=${encodeURIComponent(`${latitude}|${longitude}`)}&gsradius=2000&gslimit=30&format=json&origin=*`
    );

    if (!resposta.ok) {
        throw new Error(`Wikipedia devolvió HTTP ${resposta.status}`);
    }

    const dades = await resposta.json();
    const llocs = dades?.query?.geosearch;

    if (!Array.isArray(llocs) || llocs.some((lloc) =>
        !Number.isInteger(lloc?.pageid) || typeof lloc.title !== 'string' ||
        !Number.isFinite(lloc.lat) || !Number.isFinite(lloc.lon)
    )) {
        throw new Error('Wikipedia devolvió un formato inesperado.');
    }

    if (llocs.length === 0) return [];

    const propietats = await fetch(
        `https://es.wikipedia.org/w/api.php?action=query&prop=pageprops&ppprop=wikibase_item&pageids=${encodeURIComponent(llocs.map((lloc) => lloc.pageid).join('|'))}&format=json&formatversion=2&origin=*`
    );
    if (!propietats.ok) throw new Error(`Wikipedia devolvió HTTP ${propietats.status}`);
    const pagines = (await propietats.json())?.query?.pages;
    if (!Array.isArray(pagines)) throw new Error('Wikipedia devolvió un formato inesperado.');

    const idsPerPagina = new Map(pagines.map((pagina) => [pagina.pageid, pagina.pageprops?.wikibase_item]));
    const ids = [...new Set([...idsPerPagina.values()].filter((id) => typeof id === 'string' && /^Q\d+$/.test(id)))];
    const entitats = await consultarEntitats(ids);
    const tipus = [...new Set(Object.values(entitats).flatMap((entitat) => idsPropietat(entitat, 'P31')))];
    const classes = await consultarEntitats(tipus.filter((id) => !tipusVisitables[id]));

    // shortcut: solo tipos y subtipos inmediatos; ampliar si faltan categorías de lugares.
    return llocs.filter((lloc) => {
        const entitat = entitats[idsPerPagina.get(lloc.pageid)];
        return idsPropietat(entitat, 'P31').some((tipus) =>
            tipusVisitables[tipus] || idsPropietat(classes[tipus], 'P279').some((pare) => tipusVisitables[pare])
        );
    }).slice(0, 10);
}

export async function consultarResumWikipedia(pageid) {
    if (!Number.isInteger(pageid) || pageid <= 0) {
        throw new Error('El identificador de Wikipedia no es válido.');
    }

    const resposta = await fetch(
        `https://es.wikipedia.org/w/api.php?action=query&prop=extracts&pageids=${pageid}&exintro=1&explaintext=1&exchars=1000&format=json&formatversion=2&origin=*`
    );

    if (!resposta.ok) {
        throw new Error(`Wikipedia devolvió HTTP ${resposta.status}`);
    }

    const dades = await resposta.json();
    const resum = dades?.query?.pages?.[0]?.extract;

    if (typeof resum !== 'string' || !resum.trim()) {
        throw new Error('No hay un resumen disponible para este artículo.');
    }

    return resum.trim();
}
