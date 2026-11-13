export async function consultarTemperatura(latitude, longitude) {

const resposta = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m`
);

if (!resposta.ok) {
    throw new Error('No se pudo consultar la temperatura.');
}
    const dades = await resposta.json();
    const temperatura = dades.current?.temperature_2m;

    if (!Number.isFinite(temperatura)) {
        throw new Error('La API no devolvió una temperatura válida.');
    }

    return temperatura;

}
