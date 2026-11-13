import { useContext, useEffect, useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { Link } from 'expo-router';
import { consultarTemperatura } from '../services/tempsAPI';
import { colors } from '../constants/colors';
import { PlacesContext } from '../context/PlacesContext';

export default function CityCard({ lloc, mostrarEnllac = true }) {
  const { senseConnexio } = useContext(PlacesContext);
  const [temperatura, setTemperatura] = useState(null);
  const [error, setError] = useState('');
  const [intent, setIntent] = useState(0);

  useEffect(() => {
    let actiu = true;
    setTemperatura(null);
    setError('');
    if (senseConnexio) {
      setError('Sin conexión. La temperatura se actualizará cuando vuelva Internet.');
      return;
    }

    async function carregar() {
      try {
        const graus = await consultarTemperatura(lloc.latitude, lloc.longitude);
        if (actiu) setTemperatura(graus);
      } catch {
        if (actiu) setError('No se pudo actualizar la temperatura.');
      }
    }

    carregar();
    return () => { actiu = false; };
  }, [lloc.latitude, lloc.longitude, intent, senseConnexio]);

  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <View style={styles.info}>
          <Text style={styles.name}>{lloc.nom}</Text>
          <Text style={styles.description}>{lloc.descripcio}</Text>
        </View>
        <Text style={styles.temperature} accessibilityLabel={temperatura !== null
          ? `${Math.round(temperatura)} grados Celsius`
          : error ? 'Temperatura no disponible' : 'Cargando temperatura'}>
          {temperatura !== null ? `${Math.round(temperatura)} °C` : error ? '— °C' : '…'}
        </Text>
      </View>
      {error ? (
        <View>
          <Text accessibilityRole="alert" style={styles.description}>{error}</Text>
          <Button title="Reintentar" disabled={senseConnexio} onPress={() => setIntent(intent + 1)} color={colors.blue} />
        </View>
      ) : null}
      {mostrarEnllac ? (
        <Link href={{ pathname: '/detall/[id]', params: { id: lloc.id } }} style={styles.link}>
          Ver detalle
        </Link>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { padding: 20, gap: 12, borderWidth: 1, borderColor: '#D7E5F4', borderRadius: 16, backgroundColor: colors.white },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  info: { flex: 1, gap: 6 },
  name: { color: colors.blue, fontSize: 22, fontWeight: 'bold' },
  description: { color: colors.text, fontSize: 16, lineHeight: 24 },
  temperature: { color: colors.blue, fontSize: 36, fontWeight: 'bold' },
  link: { color: colors.blue, fontSize: 16, paddingVertical: 6 },
});
