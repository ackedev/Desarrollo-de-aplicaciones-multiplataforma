export default function ProfileCard() {
    const nom = "Jaume"
    const cicle = "Desenvolupament d'Aplicaciones Multiplataforma"
    const curs = "2n"
    const data = "21/03/2003" 

    return (
        <div style={{ backgroundColor: '#dbeafe', textAlign: 'left', border: '1px solid black', padding: '16px', margin: '10px', borderRadius: '8px' }}>
            <h1>{nom}</h1>
            <h2>Cicle: {cicle}</h2>
            <h3>Curs: {curs}</h3>
            <h4>Data de naixement: {data}</h4>
        </div>
    )

}
