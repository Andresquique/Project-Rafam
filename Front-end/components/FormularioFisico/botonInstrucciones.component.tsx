//Componente de botón para abrir eel modal de instrucciones.
// Por ahora es una versión media provisoria: muestra las instrucciones por consola.
// OJO que instrucciones acá es el objeto de props, no el string, así que el log no muestra el texto.
export default function BotonInstrucciones(instrucciones : String) {
    return(
        <button type="button" onClick={() => openInstructions(instrucciones)} 
        className="rounded-lg bg-rafam-blue px-8 py-3 text-lg font-bold text-primary-foreground transition-colors hover:bg-rafam-blue-dark">
        Instrucciones
        </button>
    )
}

function openInstructions(instrucciones: String) {
  // pendiente: esto debería abrir un modal de verdad, por ahora solo imprime
  console.log(instrucciones);
}
