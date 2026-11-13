import { SafeAreaView } from 'react-native-safe-area-context';

import Footer from '@/components/footer';
import GameList from '@/components/gamelist';
import Header from '@/components/header';

export default function HomeScreen() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Header />
      <GameList />
      <Footer />
    </SafeAreaView>
  );
}
