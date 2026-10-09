import { useState } from "react";

export default function Corazon (){
    const [fav, setFav] = useState(false)

    console.log(fav);

    return (
        <>
        <h1>Pokemon Escaldado </h1>
        <h2>Game Freak</h2>

        
        <button onClick={() => setFav(!fav)}>
            Like: {fav ? "❤️" : "♡"}
        </button>
        </>
    );
}
