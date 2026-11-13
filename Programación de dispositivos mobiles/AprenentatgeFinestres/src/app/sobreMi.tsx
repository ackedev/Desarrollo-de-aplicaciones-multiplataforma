import { router } from 'expo-router';
import { Button, View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Footer from '@/components/footer';
import Header from '@/components/header';

export default function SobreMI() {
    return(
        <SafeAreaView style={{flex:1, alignItems:'center', alignContent:'center', gap:16}}>
            <header />
            <Text> Esta pagina estará toda mi información</Text>
            <Button 
                title="Prem aquí per anar enrerre"
                onPress={() => router.push('/segundaPagina')}
                /> 
            <Button 
                title="Prem aquí per anar al inici"
                onPress={() => router.push('/')}
                />
            <footer />

        </SafeAreaView>
    )

}