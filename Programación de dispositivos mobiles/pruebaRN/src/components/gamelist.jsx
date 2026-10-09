import { ScrollView } from 'react-native';

import GameCard from './gamecard';

export default function GameList() {
  const games = [
    {
      id: 1,
      titol: 'GTA V',
      plataforma: 'PlayStation',
      any: '2013',
      imatge: require('../../assets/images/gtav_logo.webp'),
    },
    {
      id: 2,
      titol: 'Portal 2',
      plataforma: 'PC',
      any: '2011',
      imatge: require('../../assets/images/portal2_logo.webp'),
    },
    {
      id: 3,
      titol: 'Dota 2',
      plataforma: 'PC',
      any: '2013',
      imatge: require('../../assets/images/dota2_logo.webp'),
    },
    {
      id: 4,
      titol: 'Crash Bandicoot',
      plataforma: 'PlayStation',
      any: '1996',
      imatge: require('../../assets/images/crashbandicoot96_logo.webp'),
    },
    {
      id: 5,
      titol: 'Mario Kart',
      plataforma: 'Nintendo Switch',
      any: '2017',
      imatge: require('../../assets/images/mariokart_logo.webp'),
    },
    {
      id: 6,
      titol: 'Valorant',
      plataforma: 'PC',
      any: '2020',
      imatge: require('../../assets/images/valorant_logo.webp'),
    },
  ];

  return (
    <ScrollView contentContainerStyle={{ alignItems: 'center', paddingVertical: 12 }}>
      {games.map((game) => (
        <GameCard
          key={game.id}
          titol={game.titol}
          plataforma={game.plataforma}
          any={game.any}
          imatge={game.imatge}
        />
      ))}
    </ScrollView>
  );
}
