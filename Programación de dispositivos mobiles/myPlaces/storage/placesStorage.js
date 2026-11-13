import AsyncStorage from '@react-native-async-storage/async-storage';

export async function desarLlocs(llocs) {
    await AsyncStorage.setItem('llocs', JSON.stringify(llocs));
}

export async function carregarLlocs() {
    const text = await AsyncStorage.getItem('llocs');

    return text ? JSON.parse(text) : [];
}