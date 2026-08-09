"use client";

import PreguntaFormulario from "./preguntaFormulario.component";
import { useState } from 'react';

type FormularioProps = {
  onSubmit: (puntuacion: number) => void;
};

export function Formulario({ onSubmit }: FormularioProps) {
  function calcularTotal() {
    const total = Object.values(respuestas).reduce(
      (suma, valor) => suma + Number(valor),
      0
    );
    return total
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
        <div className="w-full h-auto rounded-[24px] bg-white border-2 border-yellow-300 p-5 sm:p-6 shadow-[0_12px_40px_rgba(22,66,128,0.08)]">
          <form onSubmit={submitForm}>
            <section className="flex flex-col w-full mx-auto">
              <h3 className="text-xl font-bold text-[#164280] pb-1 flex items-center mb-2">
                1. Prueba de Balance
              </h3>
              <div className="w-full">
                <PreguntaFormulario
                  nombre={Nombres.piesParalelos}
                  pregunta="A. Pararse con los pies uno al lado del otro (¿Mantuvo la posición al menos por 10 segundos?)"
                  opciones={[
                    { label: "No (0 puntos)", value: "0"},
                    { label: "Sí (1 punto)", value: "1"},
                  ]}
                  onChange={cambiaRadioButton}
                />
                {(Nombres.piesParalelos in respuestas && Number(respuestas[Nombres.piesParalelos]) >= 1) && (
                  <PreguntaFormulario
                    nombre={Nombres.pieAdelantado}
                    pregunta="B. Pararse en posición semi-tándem (¿Mantuvo la posición al menos por 10 segundos?)"
                    opciones={[
                      { label: "No (0 puntos)", value: "0"},
                      { label: "Sí (1 punto)", value: "1"},
                    ]}
                    onChange={cambiaRadioButton}
                  />
                )}
                {(Nombres.pieAdelantado in respuestas && Number(respuestas[Nombres.pieAdelantado]) >= 1) && (
                  <PreguntaFormulario
                    nombre={Nombres.piesEnLinea}
                    pregunta="C. Pararse en posición tándem (¿Mantuvo la posición? Seleccione puntos según tiempo)"
                    opciones={[
                      { label: "Mantuvo menos de 3 seg o no lo intenta (0 puntos)", value: "0"},
                      { label: "Mantuvo de 3 a 9.99 segundos (1 punto)", value: "1"},
                      { label: "Mantuvo 10 segundos (2 puntos)", value: "2"},
                    ]}
                    onChange={cambiaRadioButton}
                  />
                )}
              </div>
            
              <h3 className="text-xl font-bold text-[#164280] pb-1 flex items-center mt-3 mb-2">
                2. Velocidad de marcha
              </h3>
              <div className="w-full">
                <PreguntaFormulario
                  nombre={Nombres.calificacionDeLaMedicionMenor}
                  pregunta="Calificación de la medición menor (mejor tiempo):"
                  opciones={[
                    { label: "No logró completarlo (0 puntos)", value: "0"},
                    { label: "> 8 segundos (1 punto)", value: "1"},
                    { label: "6 a 8 segundos (2 puntos)", value: "2"},
                    { label: "4 a 6 segundos (3 puntos)", value: "3"},
                    { label: "< 4 segundos (4 puntos)", value: "4"},
                  ]}
                  onChange={cambiaRadioButton}
                />
              </div>
            
              <h3 className="text-xl font-bold text-[#164280] flex items-center mt-3 mb-2">
                3. Levantarse Cinco Veces de una Silla
              </h3>
              <div className="w-full">
                <PreguntaFormulario
                  nombre={Nombres.sentado}
                  pregunta="A. Prueba previa: ¿El paciente se levanta sin apoyarse en los brazos?"
                  opciones={[
                    { label: "No (0 puntos)", value: "0"},
                    { label: "Sí (1 punto)", value: "1"},
                  ]}
                  onChange={cambiaRadioButton}
                />
                {(Nombres.sentado in respuestas && Number(respuestas[Nombres.sentado]) >= 1) && (
                  <PreguntaFormulario
                    nombre={Nombres.parado}
                    pregunta="B. Tiempo requerido para levantarse cinco veces (segundos):"
                    opciones={[
                      { label: "Incapaz o tarda > 60 seg (0 puntos)", value: "0"},
                      { label: "16.7 a 60 seg (1 punto)", value: "1"},
                      { label: "13.7 a 16.69 seg (2 puntos)", value: "2"},
                      { label: "11.2 a 13.69 seg (3 puntos)", value: "3"},
                      { label: "≤ 11.19 seg (4 puntos)", value: "4"},
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
                  className="rounded-xl bg-[#164280] px-6 py-2.5 text-white font-medium hover:bg-[#0f2d57] transition-colors shadow-md"
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