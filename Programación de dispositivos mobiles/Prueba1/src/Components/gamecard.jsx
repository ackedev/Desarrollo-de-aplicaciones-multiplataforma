export default function GameCard({titol, plataforma, any}){
    return (
        <div style={{
            backgroundColor: "#12355b",
            padding: "16px",
            margin: "12px",
            borderRadius: "8px",
            width: "250px"
        }}>
            <h1 style={{ color: "white" }}>{titol}</h1>
            <p style={{ color: "#b8bec7" }}>Plataforma: {plataforma}</p>
            <p style={{ color: "#b8bec7" }}>Año: {any}</p>
        </div>
    )
}
