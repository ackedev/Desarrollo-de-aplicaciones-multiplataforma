import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Button } from 'react-native';

import Footer from '@/components/footer';
import Header from '@/components/header';

export default function HomeScreen() {
  return (
    <SafeAreaView 
        style={{ 
          flex: 1,
          paddingTop:10,
          gap: 16 }}>
      <Header />
  
        <text> Este texto se usará para probar que soy el mejor del mundo </text>
    
      <Button 

        title="Ir a la segunda página"
        onPress={() => router.push('/segundaPagina')}
        />    

      <Footer />

    </SafeAreaView>

  );
};