import { useState } from 'react'
import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import './App.css'

import Comp1 from './Components/comp1.jsx';
import ProfileCard from './Components/profileCard.jsx';
import StudentCard  from './Components/gamecard.jsx';
import Contador from './Components/Contador.jsx';
import Corazon from './Components/Corazon.jsx'
import GameCard from './Components/gamecard.jsx'

function App() {
  const games = [
    {id: 1, titol: "GTA V", plataforma: "PlayStation", any: "2026"},
    {id: 2, titol: "Portal 2", plataforma: "PC", any: "2011"},
    {id: 3, titol: "Dota 2", plataforma: "PC", any: "2013"},
    {id: 4, titol: "Crash Bandicoot", plataforma: "PlayStation", any: "1996"},
    {id: 5, titol: "Mario Kart", plataforma: "Nintendo Switch", any: "2017"}
  ]


  return (
    <>
     {games.map(game => (
      <GameCard
        key={game.id}
        titol={game.titol}
        plataforma={game.plataforma}
        any={game.any}
      />
     ))}

  </>

  )
}

export default App
