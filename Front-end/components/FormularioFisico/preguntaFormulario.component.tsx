"use client";
import Image from "next/image";
import { useEffect, useState } from "react";

type Opcion = {
  label: string;
  value: string;
  id:string
};

type PreguntaFormularioProps = {
  nombre: string;
  pregunta: string;
  opciones: Opcion[];
  onChange: (nombre: string, valor: string) => void;
};

export default function PreguntaFormulario({
  nombre,
  pregunta,
  opciones,
  onChange,
}: PreguntaFormularioProps) {
  const [mostrarImagen, setMostrarImagen] = useState(true);

  useEffect(() => {
    setMostrarImagen(true);
  }, [nombre]);

  return (
    <div className="mb-6 p-4 rounded-xl bg-white border border-rafam-blue shadow-sm transition-all hover:shadow-md focus-within:ring-2 focus-within:ring-rafam-blue/40">
      <div className="flex items-start gap-4">
        <div className="relative w-12 h-12 flex-shrink-0">
          {mostrarImagen && (
            <Image
              src={`/formulario/${nombre}.png`}
              alt={nombre}
              fill
              className="object-contain"
              onError={() => setMostrarImagen(false)}
            />
          )}
        </div>
        <div className="flex flex-col gap-3 flex-1 text-left">
          <p className="font-semibold text-rafam-blue">
            {pregunta}
          </p>
          <div className="flex flex-col gap-2.5 items-start">
            {opciones.map((opcion) => (
              <label
                key={opcion.id}
                className="flex items-center cursor-pointer text-gray-700 hover:text-rafam-blue transition-colors"
              >
                <input
                  type="radio"
                  name={nombre}
                  value={opcion.value}
                  onChange={(e) =>
                    onChange(e.target.name, e.target.value)
                  }
                  className="mr-3 w-4 h-4 accent-rafam-blue focus:ring-2 focus:ring-rafam-blue/40"
                />
                <span className="text-sm sm:text-base">{opcion.label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}