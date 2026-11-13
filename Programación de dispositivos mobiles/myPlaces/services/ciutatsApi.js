export async function cercarCiutats(nom) {
  if (nom.trim().length < 2) {
    throw new Error('Escribe al menos 2 caracteres para buscar.');
  }

  const resposta = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(nom.trim())}&count=10&language=es`
  );
  if (!resposta.ok) throw new Error('No se pudieron consultar las ciudades.');

  const dades = await resposta.json();
  const resultats = dades.results ?? [];
  if (!Array.isArray(resultats)) throw new Error('La API devolvió un formato inesperado.');

  return resultats.map((ciutat) => {
    if (!ciutat || !Number.isFinite(ciutat.id) || typeof ciutat.name !== 'string' ||
        !Number.isFinite(ciutat.latitude) || !Number.isFinite(ciutat.longitude)) {
      throw new Error('La API devolvió un formato inesperado.');
    }

    return {
      id: `ciutat-${ciutat.id}`,
      nom: ciutat.name,
      descripcio: [ciutat.admin1, ciutat.country].filter(Boolean).join(', '),
      tipus: 'ciutat',
      latitude: ciutat.latitude,
      longitude: ciutat.longitude,
    };
  });
}
