//Componente de botón para abrir eel modal de instrucciones.
export default function BotonInstrucciones(instrucciones : String) {
    return(
        <button type="button" onClick={() => openInstructions(instrucciones)} 
        className="rounded-lg bg-rafam-blue px-8 py-3 text-lg font-bold text-primary-foreground transition-colors hover:bg-rafam-blue-dark">
        Instrucciones
        </button>
    )
}

function openInstructions(instrucciones: String) {
  console.log(instrucciones);
}
