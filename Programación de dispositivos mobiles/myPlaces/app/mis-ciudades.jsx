import { useContext } from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import { Link } from 'expo-router';
import { PlacesContext } from '../context/PlacesContext';
import CityCard from '../components/CityCard';
import { colors } from '../constants/colors';

export default function MisCiudades() {
  const { llocs } = useContext(PlacesContext);
  const ciutats = llocs.filter((lloc) => lloc.tipus === 'ciutat');

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title} accessibilityRole="header">Mis ciudades</Text>
      <Text style={styles.description}>Tus ciudades y su temperatura actual.</Text>
      <Link href="/ciutats" style={styles.search}>+ Buscar y guardar ciudades</Link>
      {ciutats.length === 0 ? <Text style={styles.description}>Todavía no tienes ciudades guardadas.</Text> : null}
      {ciutats.map((ciutat) => <CityCard key={ciutat.id} lloc={ciutat} />)}
      <Link href="https://open-meteo.com/" style={styles.source}>Temperaturas de Open-Meteo</Link>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { width: '100%', maxWidth: 760, alignSelf: 'center', padding: 24, gap: 16 },
  title: { color: colors.blue, fontSize: 28, fontWeight: 'bold' },
  description: { color: colors.text, fontSize: 16, lineHeight: 24 },
  search: { color: colors.white, backgroundColor: colors.blue, padding: 16, borderRadius: 12, fontSize: 16, textAlign: 'center' },
  source: { color: colors.blue, fontSize: 14, paddingVertical: 8 },
});
