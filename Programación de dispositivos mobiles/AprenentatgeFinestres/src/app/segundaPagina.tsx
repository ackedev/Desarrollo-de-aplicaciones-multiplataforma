import { Text, View } from 'react-native';
import { router } from 'expo-router';
import { Button } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


export default function SegundaPagina(){
    return (       
        <SafeAreaView style={{flex:1, alignItems:'center', alignContent:'center'}}>

                <Text> Esta es la segunda pagina</Text>
                <Button 
                    title= "Hola que ase"
                    onPress={() => router.push('/')}
                    /> 

                <Button
                    title="Aquí vas a sobre mi"
                    onPress={() => router.push('/sobreMi')}
                    />
        </SafeAreaView>
    )
}