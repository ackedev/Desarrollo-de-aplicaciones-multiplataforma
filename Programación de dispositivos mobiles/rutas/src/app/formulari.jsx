import { useState } from 'react';
import { router } from 'expo-router';
import { ScrollView, StyleSheet, Text, TextInput, Button } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Header from '../components/header';
import Footer from '../components/footer';
import { llocs } from '../data/llocs';


export default function Formulari() {
  const [id, setId] = useState('');
  const [nom, setNom] = useState('');
  const [categoria, setCategoria] = useState('');
  const [comentari, setComentari] = useState('');

  function enviarFormulario() {

    const nuevoLugar = {
      id: id,
      nombre: nom,
      categoria: categoria,
      descripcion: comentari,
    }

    llocs.push(nuevoLugar);

    console.log('Estos son tus datos:', nuevoLugar)} 

    router.push({
      pathname: '/detall/[id]',
      params: {id: nuevoLugar.id },
    });

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: 'white' }}
      edges={['bottom', 'left', 'right']}
    >
      <Header />
      <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.formulario}>
        <Text>ID</Text>
        <TextInput 
          value={id}
          onChangeText={setId}
          style={styles.campo}
          placeholder="Introduce el ID"
        />

        <Text>Nombre</Text>
        <TextInput
          value={nom}
          onChangeText={setNom}
          style={styles.campo}
          placeholder="Nom del lloc"
        />

        <Text>Categoría</Text>
        <TextInput
          value={categoria}
          onChangeText={setCategoria}
          style={styles.campo}
          placeholder="Introduce la categoría"
        />

        <Text>Comentario</Text>
        <TextInput
          value={comentari}
          onChangeText={setComentari}
          style={[styles.campo, styles.comentario]}
          placeholder="Escribe un comentario"
          multiline
          textAlignVertical="top"
        />

        <Button title="Enviar" onPress={enviarFormulario} />

      </ScrollView>
      <Footer />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  formulario: { padding: 20, gap: 10 },
  campo: {
    borderWidth: 1,
    borderColor: '#777',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#222',
  },
  comentario: { minHeight: 120 },
});



