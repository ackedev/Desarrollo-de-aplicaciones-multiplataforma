import { useContext } from 'react';
import { Text } from 'react-native';
import { PlacesContext } from '../context/PlacesContext';
import { colors } from '../constants/colors';

export default function ConnectionStatus() {
  const { xarxa, senseConnexio } = useContext(PlacesContext);
  const tipus = { wifi: 'Wi-Fi', cellular: 'Datos móviles', ethernet: 'Ethernet' }[xarxa.type];
  const missatge = senseConnexio
    ? 'Sin conexión · Tus lugares guardados siguen disponibles'
    : xarxa.isConnected === true
      ? `Conectado${tipus ? ` · ${tipus}` : ''}`
      : 'Comprobando conexión…';

  return (
    <Text accessibilityLiveRegion="polite" style={{ backgroundColor: '#EAF3FF', color: colors.text, padding: 8, textAlign: 'center', fontSize: 13 }}>
      {missatge}
    </Text>
  );
}
