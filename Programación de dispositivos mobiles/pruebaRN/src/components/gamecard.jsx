import { useState } from 'react';
import { Image, Pressable, Text } from 'react-native';

export default function GameCard({ titol, plataforma, any, imatge }) {
  const [seleccionada, setSeleccionada] = useState(false);

  return (
    <Pressable
      onPress={() => setSeleccionada(!seleccionada)}
      style={{
        backgroundColor: seleccionada ? '#081c33' : '#12355b',
        padding: 16,
        margin: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: 'black',
        width: '90%',
      }}>
      <Image source={imatge} style={{ width: '100%', height: 120, resizeMode: 'contain' }} />
      <Text style={{ color: 'white', fontSize: 32, fontWeight: 'bold' }}>{titol}</Text>
      <Text style={{ color: '#b8bec7' }}>Plataforma: {plataforma}</Text>
      <Text style={{ color: '#b8bec7' }}>Año: {any}</Text>
    </Pressable>
  );
}
