import { useState, useContext } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, View, TextInput, Text } from 'react-native';
import { PlacesContext } from '../context/PlacesContext';
import { useRouter } from 'expo-router';
import { colors } from '../constants/colors';



export default function Afegir () {
    const [nom, setNom] = useState ('');
    const [descripcio, setDescripcio] = useState ('');
    const [error, setError] = useState ('');
    const { setLlocs } = useContext(PlacesContext);
    const router = useRouter();


    function guardar() {
        if (nom.trim() === '') {
            setError('Escribe el nombre del lugar.');
            return;
        }
        
        setError('');

        const nouLloc = {
            id: `manual-${Date.now()}`,
            nom: nom.trim(),
            descripcio: descripcio.trim(),
        };

        setLlocs((actuals) => [...actuals, nouLloc]);
        router.replace('/');
    }



    return (
        
    <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={64}>
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
    <View style={styles.form}>
        <Text style={styles.title} accessibilityRole="header">Añadir lugar</Text>
        <Text style={styles.subtitle}>Guarda un sitio que quieras visitar o recordar.</Text>
        <Text style={styles.label}>Nombre del lugar</Text>
        <TextInput
            style={styles.input}
            placeholder="Por ejemplo, Parque del Retiro"
            placeholderTextColor="#60758A"
            accessibilityLabel="Nombre del lugar"
            value={nom}
            onChangeText={setNom}
        />
        <Text style={styles.label}>Descripción (opcional)</Text>
        <TextInput
            style={[styles.input, styles.description]}
            placeholder='¿Qué te gustaría recordar de este sitio?'
            placeholderTextColor="#60758A"
            accessibilityLabel='Descripción del lugar'
            value={descripcio}
            onChangeText={setDescripcio}
            multiline
        />
        {error ? <Text accessibilityRole="alert" style={styles.error}>{error}</Text> : null}
        <Pressable accessibilityRole="button" onPress={guardar} style={({ pressed }) => [styles.button, pressed && { opacity: 0.8 }]}>
            <Text style={styles.buttonText}>Guardar lugar</Text>
        </Pressable>
    </View>
    </ScrollView>
    </KeyboardAvoidingView>

    );
}

const styles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: colors.white },
    container: { flexGrow: 1, padding: 24 },
    form: { width: '100%', maxWidth: 600, alignSelf: 'center', gap: 12 },
    title: { color: colors.blue, fontSize: 28, fontWeight: 'bold' },
    subtitle: { color: colors.text, fontSize: 16, lineHeight: 24, marginBottom: 12 },
    label: { color: colors.text, fontSize: 16, fontWeight: '600', marginTop: 8 },
    input: { minHeight: 52, borderWidth: 1, borderColor: '#AFC6DE', borderRadius: 12, padding: 14, fontSize: 16, color: colors.text, backgroundColor: '#F5F9FF' },
    description: { minHeight: 144, textAlignVertical: 'top' },
    error: { color: colors.text, fontSize: 16, lineHeight: 24 },
    button: { minHeight: 52, backgroundColor: colors.blue, borderRadius: 12, alignItems: 'center', justifyContent: 'center', padding: 14, marginTop: 12 },
    buttonText: { color: colors.white, fontSize: 17, fontWeight: 'bold' },
});
