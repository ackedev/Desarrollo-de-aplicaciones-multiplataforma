import { ScrollView, StyleSheet, Text } from 'react-native';
import { colors } from '../constants/colors';
import PlaceCard from '../components/PlaceCard';
import { useContext } from 'react';
import { PlacesContext } from '../context/PlacesContext';

export default function Home() {
  const { llocs } = useContext(PlacesContext);
  const llocsGuardats = llocs.filter((lloc) => lloc.tipus !== 'ciutat');

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title} accessibilityRole="header">Mis lugares</Text>

      <Text style={styles.description}>Los sitios que quieres visitar o recordar.</Text>
      {llocsGuardats.length === 0 ? <Text style={styles.description}>Todavía no tienes lugares guardados. Añade uno o búscalo en Descubre.</Text> : null}

      {llocsGuardats.map((lloc) => (
        <PlaceCard key={lloc.id} lloc={lloc} />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    maxWidth: 760,
    alignSelf: 'center',
    backgroundColor: colors.white,
    padding: 24,
    gap: 16,
  },
  title: {
    color: colors.blue,
    fontSize: 28,
    fontWeight: 'bold',
  },
  description: { color: colors.text, fontSize: 16, lineHeight: 24 },
});
