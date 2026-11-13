import { Button, ScrollView, Text, View } from 'react-native';
import { Link, useLocalSearchParams, useRouter } from 'expo-router';
import { useContext, useState } from 'react';
import { PlacesContext } from '../../context/PlacesContext';
import { colors } from '../../constants/colors';
import CityCard from '../../components/CityCard';
import { consultarResumWikipedia } from '../../services/properApi';

export default function Detall() {
    const [carregant, setCarregant] = useState(false);
    const [error, setError] = useState('');
    const { id } = useLocalSearchParams();
    const { llocs, setLlocs, senseConnexio } = useContext(PlacesContext);
    const router = useRouter();

    function eliminar() {
        setLlocs((actuals) => actuals.filter((lloc) => lloc.id !== id));
        router.replace(lloc?.tipus === 'ciutat' ? '/mis-ciudades' : '/');
    }
    
    const lloc = llocs.find((lloc) => lloc.id === id);
    const esWikipedia = lloc?.id.startsWith('wiki-es-');
    const pageid = esWikipedia ? Number(lloc.id.slice('wiki-es-'.length)) : null;

    async function carregarResum() {
        if (senseConnexio) {
            setError('Sin conexión. Vuelve a intentarlo cuando tengas Internet.');
            return;
        }
        setCarregant(true);
        setError('');

        try {
            const resum = await consultarResumWikipedia(pageid);
            setLlocs((actuals) => actuals.map((actual) =>
                actual.id === id ? { ...actual, descripcio: resum } : actual
            ));
        } catch (error) {
            setError(error.message);
        } finally {
            setCarregant(false);
        }
    }

    if (!lloc) {
        return <Text> Lugar no encontrado</Text>
    }

    return (
        <ScrollView contentContainerStyle={{ padding: 24, gap: 12, backgroundColor: colors.white }}>
            
            {lloc.tipus === 'ciutat' ? <CityCard lloc={lloc} mostrarEnllac={false} /> : (
                <View style={{ gap: 12 }}>
                    <Text style={{ color: colors.blue, fontSize: 26, fontWeight: 'bold' }}>{lloc.nom}</Text>
                    <Text style={{ color: colors.text, fontSize: 17, lineHeight: 26 }}>{lloc.descripcio}</Text>
                </View>
            )}

            {esWikipedia && (
                <View style={{ gap: 12 }}>
                    <Button
                        title="Ampliar información"
                        onPress={carregarResum}
                        disabled={carregant || senseConnexio}
                        color={colors.blue}
                    />
                    {carregant ? <Text>Consultando Wikipedia…</Text> : null}
                    {error ? <Text accessibilityRole="alert">{error}</Text> : null}
                    <Link href={`https://es.wikipedia.org/?curid=${pageid}`} style={{ color: colors.blue }}>
                        Leer en Wikipedia
                    </Link>
                    <Link href="https://creativecommons.org/licenses/by-sa/4.0/" style={{ color: colors.blue }}>
                        Texto de Wikipedia · CC BY-SA 4.0
                    </Link>
                </View>
            )}

            {lloc.tipus === 'ciutat' ? <Text>Temperatura de Open-Meteo</Text> : null}

            <Button title="Eliminar lugar" onPress={eliminar} color={colors.blue} />
        </ScrollView>
    );
}
