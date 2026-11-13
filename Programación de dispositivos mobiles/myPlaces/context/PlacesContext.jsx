import { createContext, useEffect, useState } from 'react';
import { Text } from 'react-native';
import { carregarLlocs, desarLlocs } from '../storage/placesStorage';
import { useNetInfo } from '@react-native-community/netinfo';


export const PlacesContext = createContext(null);

export function PlacesProvider({ children }) {
    const [llocs, setLlocs] = useState([]);
    const [carregat, setCarregat] = useState(false);
    const [error, setError] = useState('');
    const xarxa = useNetInfo();
    const senseConnexio = xarxa.isConnected === false || xarxa.isInternetReachable === false;

    useEffect(() => {
        async function carregar() {
            try {
                const llocsDesats = await carregarLlocs();
                setLlocs(llocsDesats);
                setCarregat(true);
            } catch {
                setError('No se pudieron cargar los lugares. Recarga para reintentar.');
            }
        }

        carregar();
    }, []);

    useEffect(() => {
        if (!carregat) return;

        async function desar() {
            try {
                await desarLlocs(llocs);
                setError('');
            } catch {
                setError('No se pudieron guardar los cambios. Siguen disponibles en esta sesión.');
            }
        }

        desar();
    }, [llocs, carregat]);

    if (!carregat) {
        return <Text accessibilityRole="alert">{error || 'Cargando lugares…'}</Text>;
    }

    return (
        <PlacesContext.Provider value={{ llocs, setLlocs, xarxa, senseConnexio }}>
            {error ? <Text accessibilityRole="alert">{error}</Text> : null}
            {children}
        </PlacesContext.Provider>
    );
}
