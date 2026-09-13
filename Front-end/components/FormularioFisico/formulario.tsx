"use client";

import PreguntaFormulario from "./preguntaFormulario.component";
import { useState } from 'react';

type FormularioProps = {
  onSubmit: (puntuacion: number) => void;
};

function clamp(valor: number, min: number, max: number) {
  return Math.min(Math.max(valor, min), max);
}

export function Formulario({ onSubmit }: FormularioProps) {
  function calcularTotal() {
    const total = Object.values(respuestas).reduce(
      (suma, valor) => suma + Number(valor),
      0
    );
    return clamp(total, 0, 12)
  }

  const [respuestas, setRespuestas] = useState<Record<string, string>>({});

  function cambiaRadioButton(nombreBoton: string, valor: string) {
    setRespuestas((prev) => {
      const nuevas = {
        ...prev,
        [nombreBoton]: valor,
      };

      if (nombreBoton === Nombres.piesParalelos && valor === "0") {
        delete nuevas[Nombres.pieAdelantado];
        delete nuevas[Nombres.piesEnLinea];
      }

      if (nombreBoton === Nombres.pieAdelantado && valor === "0") {
        delete nuevas[Nombres.piesEnLinea];
      }

      return nuevas;
    });
  }

  function submitForm() {
    onSubmit(calcularTotal());
  }

  const Nombres = {
    piesParalelos: "PiesParalelos",
    pieAdelantado: "PieAdelantado",
    piesEnLinea: "PiesEnLinea",
    calificacionDeLaMedicionMenor: "calificacionDeLaMedicionMenor",
    sentado: "sentado",
    parado: "parado",
  } as const;

  return (
    <div className="min-h-screen flex flex-col items-center">
      <main className="w-full max-w-4xl px-4 py-4 flex justify-center">
        <div className="w-full h-auto rounded-[24px] bg-white border-2 border-rafam-yellow p-5 sm:p-6 shadow-[0_12px_40px_rgba(22,66,128,0.08)]">
          <form onSubmit={submitForm}>
            <section className="flex flex-col w-full mx-auto">
              <h3 className="text-xl font-bold text-rafam-blue pb-1 flex items-center mb-2">
                1. Prueba de Balance
              </h3>
              <div className="w-full">
                <PreguntaFormulario
                  nombre={Nombres.piesParalelos}
                  pregunta="A. Pararse con los pies uno al lado del otro (¿Mantuvo la posición al menos por 10 segundos?)"
                  opciones={[
                    { label: "No (0 puntos)", value: "0", id:"No pies paralelos"},
                    { label: "Sí (1 punto)", value: "1", id:"Sí pies paralelos"},
                  ]}
                  onChange={cambiaRadioButton}
                />
                {(Nombres.piesParalelos in respuestas && Number(respuestas[Nombres.piesParalelos]) >= 1) && (
                  <PreguntaFormulario
                    nombre={Nombres.pieAdelantado}
                    pregunta="B. Pararse en posición semi-tándem (¿Mantuvo la posición al menos por 10 segundos?)"
                    opciones={[
                      { label: "No (0 puntos)", value: "0", id:"No pie adelantado"},
                      { label: "Sí (1 punto)", value: "1", id:"Sí pie adelantado"},
                    ]}
                    onChange={cambiaRadioButton}
                  />
                )}
                {(Nombres.pieAdelantado in respuestas && Number(respuestas[Nombres.pieAdelantado]) >= 1) && (
                  <PreguntaFormulario
                    nombre={Nombres.piesEnLinea}
                    pregunta="C. Pararse en posición tándem (¿Mantuvo la posición? Seleccione puntos según tiempo)"
                    opciones={[
                      { label: "Mantuvo menos de 3 seg o no lo intenta (0 puntos)", value: "0", id:"<3 seg pies en linea"},
                      { label: "Mantuvo de 3 a 9.99 segundos (1 punto)", value: "1", id:">3 <9.99 pies en linea"},
                      { label: "Mantuvo 10 segundos (2 puntos)", value: "2", id:"10 seg pies en linea"},
                    ]}
                    onChange={cambiaRadioButton}
                  />
                )}
              </div>
            
              <h3 className="text-xl font-bold text-rafam-blue pb-1 flex items-center mt-3 mb-2">
                2. Velocidad de marcha
              </h3>
              <div className="w-full">
                <PreguntaFormulario
                  nombre={Nombres.calificacionDeLaMedicionMenor}
                  pregunta="Calificación de la medición menor (mejor tiempo):"
                  opciones={[
                    { label: "No logró completarlo (0 puntos)", value: "0", id:"No logró completar velocidad de marcha"},
                    { label: "> 8 segundos (1 punto)", value: "1", id:">8 seg velocidad de marcha"},
                    { label: "6 a 8 segundos (2 puntos)", value: "2", id:">6 <8 seg velocidad de marcha"},
                    { label: "4 a 6 segundos (3 puntos)", value: "3", id:">4 <6 seg velocidad de marcha"},
                    { label: "< 4 segundos (4 puntos)", value: "4", id:"<4 seg velocidad de marcha"},
                  ]}
                  onChange={cambiaRadioButton}
                />
              </div>
            
              <h3 className="text-xl font-bold text-rafam-blue flex items-center mt-3 mb-2">
                3. Levantarse Cinco Veces de una Silla
              </h3>
              <div className="w-full">
                <PreguntaFormulario
                  nombre={Nombres.sentado}
                  pregunta="A. Prueba previa: ¿El paciente se levanta sin apoyarse en los brazos?"
                  opciones={[
                    { label: "No", value: "0", id:"No sentado"},
                    { label: "Sí", value: "1", id:"Si sentado"},
                  ]}
                  onChange={cambiaRadioButton}
                />
                {(Nombres.sentado in respuestas && Number(respuestas[Nombres.sentado])) && (
                  <PreguntaFormulario
                    nombre={Nombres.parado}
                    pregunta="B. Tiempo requerido para levantarse cinco veces (segundos):"
                    opciones={[
                      { label: "Incapaz o tarda > 60 seg (0 puntos)", value: "0", id: ">60 seg parado" },
                      { label: "16.7 a 60 seg (1 punto)", value: "1", id: ">16.7 <60 seg parado" },
                      { label: "13.7 a 16.69 seg (2 puntos)", value: "2", id: ">13.7 <16.69 seg parado" },
                      { label: "11.2 a 13.69 seg (3 puntos)", value: "3", id: ">11.2 <13.69 seg parado" },
                      { label: "≤ 11.19 seg (4 puntos)", value: "4", id: "<=11.19 seg parado" },
                    ]}
                    onChange={cambiaRadioButton}
                  />
                )}
              </div>

              {/* Contenedor del botón alineado sin margen superior exagerado */}
              <div className="flex justify-center items-center mt-1 pt-2">
                <button
                  type="button"
                  onClick={submitForm}
                  className="rounded-lg bg-rafam-blue px-10 py-3 text-lg font-bold text-rafam-yellow transition-colors hover:bg-rafam-blue-dark focus:outline-none focus:ring-2 focus:ring-rafam-blue/40"
                >
                  Calcular puntaje
                </button>
              </div>
            </section>
          </form>
        </div>
      </main>
    </div>
  );
}