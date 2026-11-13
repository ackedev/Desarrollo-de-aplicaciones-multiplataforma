import { useContext, useEffect, useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { Link } from 'expo-router';
import { colors } from '../constants/colors';
import { PlacesContext } from '../context/PlacesContext';
import { consultarResumWikipedia } from '../services/properApi';

export default function PlaceCard({ lloc }) {
    const { setLlocs, senseConnexio } = useContext(PlacesContext);
    const [error, setError] = useState('');
    const [intent, setIntent] = useState(0);
    const necessitaResum = lloc.id.startsWith('wiki-es-') && (
        !lloc.descripcio || lloc.descripcio === 'Lugar cercano con artículo en Wikipedia en español'
    );

    useEffect(() => {
        if (!necessitaResum) return;
        if (senseConnexio) {
            setError('Sin conexión. La descripción se cargará cuando vuelva Internet.');
            return;
        }
        let actiu = true;
        setError('');

        async function carregarResum() {
            try {
                const resum = await consultarResumWikipedia(Number(lloc.id.slice('wiki-es-'.length)));
                if (!actiu) return;
                setLlocs((actuals) => actuals.map((actual) =>
                    actual.id === lloc.id ? { ...actual, descripcio: resum } : actual
                ));
            } catch {
                if (actiu) setError('No se pudo cargar la descripción. Puedes reintentar o abrir el detalle.');
            }
        }

        carregarResum();
        return () => { actiu = false; };
    }, [lloc.id, necessitaResum, setLlocs, intent, senseConnexio]);

    return (
    <View style={styles.container}>
        <Text style={styles.title}>{lloc.nom}</Text>
        {necessitaResum ? (
            <View style={{ gap: 8 }}>
                <Text style={styles.description} accessibilityRole={error ? 'alert' : undefined}>
                    {error || 'Cargando descripción…'}
                </Text>
                {error ? <Button title="Reintentar descripción" disabled={senseConnexio} onPress={() => setIntent(intent + 1)} color={colors.blue} /> : null}
            </View>
        ) : <Text style={styles.description} numberOfLines={3}>{lloc.descripcio}</Text>}

        <Link href={{ pathname: '/detall/[id]', params: { id: lloc.id } }} style={styles.link}>
        Ver detalle
        </Link>
    </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.white,
        padding: 20,
        gap: 12,
        borderWidth: 1,
        borderColor: '#D7E5F4',
        borderRadius: 16,
},
    title: {
        color: colors.blue,
        fontSize: 22,
        fontWeight: 'bold',
},
    description: {
    color: colors.text,
    fontSize: 16,
    lineHeight: 24,
},
    link: { color: colors.blue, fontSize: 16, paddingVertical: 6 },
});
