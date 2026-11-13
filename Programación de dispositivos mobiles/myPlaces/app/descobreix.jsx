import { Text, View, Button, Linking, Platform, ScrollView } from 'react-native';
import { useState, useContext } from 'react';
import * as Location from 'expo-location';
import { cercarLlocsPropers } from '../services/properApi';
import { Link } from 'expo-router';
import { PlacesContext } from '../context/PlacesContext';
import { colors } from '../constants/colors';


export default function Descobreix() {
    const [missatge, setMissatge] = useState('');
    const [mostrarAjustos, setMostrarAjustos] = useState(false);
    const [ubicacio, setUbicacio] = useState(null);
    const [llocsPropers, setLlocsPropers] = useState([]);
    const [carregant, setCarregant] = useState(false);
    const { llocs, setLlocs, senseConnexio } = useContext(PlacesContext);


    async function obtenirUbicacio() {
        if (carregant) return;
        if (senseConnexio) {
            setMissatge('Sin conexión. Puedes seguir usando tus lugares guardados.');
            return;
        }
        setCarregant(true);
        setMostrarAjustos(false);
        setLlocsPropers([]);
        setUbicacio(null);
        setMissatge('Consultando ubicación…');

        try {
            const permis = await Location.requestForegroundPermissionsAsync();

            if (permis.status !== 'granted') {
                if (Platform.OS === 'web') {
                    setMissatge('Permite la ubicación en los ajustes de este sitio en tu navegador y vuelve a buscar.');
                } else if (!permis.canAskAgain) {
                    setMostrarAjustos(true);
                    setMissatge('Activa el permiso de ubicación en los ajustes de la app. Después vuelve aquí y pulsa Buscar cerca de mí.');
                } else {
                    setMissatge('Permiso denegado. Pulsa Buscar cerca de mí para volver a solicitarlo.');
                }
                return;
            }

            if (!await Location.hasServicesEnabledAsync()) {
                setMissatge('La localización del dispositivo está desactivada. Actívala en los ajustes y vuelve a buscar.');
                return;
            }

            let pos;
            try {
                pos = await Location.getCurrentPositionAsync({});
            } catch {
                setMissatge('No se pudo obtener la ubicación. Comprueba la localización del dispositivo y vuelve a buscar.');
                return;
            }

            setUbicacio(pos.coords);
            setMissatge('Buscando lugares cercanos…');
            const resultats = await cercarLlocsPropers(
                pos.coords.latitude,
                pos.coords.longitude
            );
            setLlocsPropers(resultats);
            setMissatge(resultats.length === 0
                ? 'No se encontraron lugares visitables confirmados a menos de 2 km.'
                : `Lugares encontrados: ${resultats.length}`);

        } catch (error) {
            setMissatge(error.message);

        }   finally {
            setCarregant(false);
        }
    }

    async function obrirAjustos() {
        try {
            await Linking.openSettings();
        } catch {
            setMissatge('No se pudieron abrir los ajustes. Ábrelos manualmente y revisa el permiso de ubicación de la app.');
        }
    }

    function guardarFavorit(lloc) {
    const favorit = {
        id: `wiki-es-${lloc.pageid}`,
        nom: lloc.title,
        descripcio: '',
        tipus: 'lloc',
        latitude: lloc.lat,
        longitude: lloc.lon,
    };

    setLlocs((actuals) => {
        if (actuals.some((actual) => actual.id === favorit.id)) {
            return actuals;
        }

        return [...actuals, favorit];
    });

    setMissatge('Lugar guardado en favoritos.');
    }


    return (
    <ScrollView contentContainerStyle={{ padding: 24, gap: 16, width: '100%', maxWidth: 760, alignSelf: 'center' }}>
        <Text accessibilityRole="header" style={{ color: colors.blue, fontSize: 28, fontWeight: 'bold' }}>Descubre</Text>
        <Text style={{ color: colors.text, fontSize: 16, lineHeight: 24 }}>Monumentos, museos, parques y otros lugares cercanos.</Text>
        <Button
            title={carregant ? 'Buscando…' : 'Buscar cerca de mí'}
            onPress={obtenirUbicacio}
            disabled={carregant || senseConnexio}
            color={colors.blue}
        />
        {ubicacio ? <Text>Latitud: {ubicacio.latitude.toFixed(5)} · Longitud: {ubicacio.longitude.toFixed(5)}</Text> : null}
        {missatge ? <Text accessibilityLiveRegion="polite">{missatge}</Text> : null}
        {mostrarAjustos ? <Button title="Abrir ajustes" onPress={obrirAjustos} color={colors.blue} /> : null}
        {llocsPropers.map((lloc) => (
            <View key={lloc.pageid} style={{ padding: 20, gap: 12, borderWidth: 1, borderColor: '#D7E5F4', borderRadius: 16 }}>
                <Text style={{ color: colors.blue, fontSize: 20, fontWeight: 'bold' }}>{lloc.title}</Text>

                <Button
                    title="Guardar favorito"
                    onPress={() => guardarFavorit(lloc)}
                    color={colors.blue}
                    disabled={llocs.some(
                        (actual) => actual.id === `wiki-es-${lloc.pageid}`
                    )}
                />
            </View>
        ))}
        <Link href="https://es.wikipedia.org/wiki/Wikipedia:Portada">
            Fuente: Wikipedia en español
        </Link>
        <Link href="https://www.wikidata.org/wiki/Wikidata:Main_Page" style={{ color: colors.blue }}>
            Clasificación de lugares: Wikidata
        </Link>
    </ScrollView>
    );
}
