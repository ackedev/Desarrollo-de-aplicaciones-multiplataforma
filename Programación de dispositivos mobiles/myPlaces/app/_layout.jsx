import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { colors } from '../constants/colors';
import { PlacesProvider } from '../context/PlacesContext';
import { View } from 'react-native';
import BottomNavigation from '../components/BottomNavigation';
import ConnectionStatus from '../components/ConnectionStatus';

export default function Layout() {
  return (
    <PlacesProvider>
      <StatusBar style="light" />
      <View style={{ flex: 1 }}>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.blue },
          headerTintColor: colors.white,
          contentStyle: { backgroundColor: colors.white },
        }}
      >
        <Stack.Screen name="index" options={{ title: 'MyPlaces' }} />
        <Stack.Screen name="ciutats" options={{ title: 'Ciudades' }} />
        <Stack.Screen name="mis-ciudades" options={{ title: 'Mis ciudades' }} />
        <Stack.Screen name="afegir" options={{ title: 'Añadir lugar' }} />
        <Stack.Screen name="descobreix" options={{ title: 'Descubre' }} />
        <Stack.Screen name="detall/[id]" options={{ title: 'Detalle' }} />
      </Stack>
      </View>
      <ConnectionStatus />
      <BottomNavigation />
    </PlacesProvider>
  );
}
