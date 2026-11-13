import { useContext, useState } from 'react';
import { Button, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Link } from 'expo-router';
import { colors } from '../constants/colors';
import { PlacesContext } from '../context/PlacesContext';
import { cercarCiutats } from '../services/ciutatsApi';

export default function Ciutats() {
  const { llocs, setLlocs, senseConnexio } = useContext(PlacesContext);
  const [nom, setNom] = useState('');
  const [resultats, setResultats] = useState([]);
  const [carregant, setCarregant] = useState(false);
  const [cercat, setCercat] = useState(false);
  const [error, setError] = useState('');

  async function cercar() {
    if (carregant) return;
    if (senseConnexio) {
      setError('Sin conexión. Vuelve a buscar cuando tengas Internet.');
      return;
    }
    if (nom.trim().length < 2) {
      setError('Escribe al menos 2 caracteres para buscar.');
      return;
    }
    setCarregant(true);
    setError('');
    setResultats([]);
    setCercat(false);

    try {
      const ciutats = await cercarCiutats(nom);
      setResultats(ciutats);
      setCercat(true);
    } catch {
      setError('No se pudo buscar. Comprueba tu conexión y vuelve a intentarlo.');
    } finally {
      setCarregant(false);
    }
  }

  function guardar(ciutat) {
    setLlocs((actuals) => {
      if (actuals.some((lloc) => lloc.id === ciutat.id)) return actuals;
      return [...actuals, ciutat];
    });
  }

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <Text accessibilityRole="header" style={styles.title}>Buscar ciudades</Text>
      <TextInput
        style={styles.input}
        placeholder="Por ejemplo, Palma"
        accessibilityLabel="Ciudad que quieres buscar"
        value={nom}
        onChangeText={setNom}
        editable={!carregant}
        onSubmitEditing={cercar}
        returnKeyType="search"
      />
      <Button title="Buscar" onPress={cercar} disabled={carregant || senseConnexio} color={colors.blue} />
      {carregant ? <Text>Cargando ciudades…</Text> : null}
      {error ? (
        <View>
          <Text accessibilityRole="alert">{error}</Text>
          <Button title="Reintentar" onPress={cercar} disabled={carregant || senseConnexio} color={colors.blue} />
        </View>
      ) : null}
      {cercat && resultats.length === 0 ? <Text>No se encontraron ciudades.</Text> : null}

      {resultats.map((ciutat) => {
        const guardada = llocs.some((lloc) => lloc.id === ciutat.id);

        return (
          <View key={ciutat.id} style={styles.resultat}>
            <Text style={styles.name}>{ciutat.nom}</Text>
            <Text style={styles.description}>{ciutat.descripcio}</Text>
            <Button
              title={guardada ? 'Guardada' : 'Guardar ciudad'}
              disabled={guardada}
              onPress={() => guardar(ciutat)}
              color={colors.blue}
            />
          </View>
        );
      })}

      <Link href="https://open-meteo.com/en/docs/geocoding-api" style={styles.source}>
        Datos de Open-Meteo y GeoNames
      </Link>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24, gap: 16, backgroundColor: colors.white },
  title: { color: colors.blue, fontSize: 28, fontWeight: 'bold' },
  input: { borderWidth: 1, borderColor: colors.blue, padding: 12, fontSize: 18, color: colors.text },
  resultat: { gap: 8, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.blue },
  name: { color: colors.blue, fontSize: 22, fontWeight: 'bold' },
  description: { color: colors.text, fontSize: 18 },
  source: { color: colors.blue, fontSize: 14 },
});
