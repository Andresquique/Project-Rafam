"use client";
import Image from "next/image";
import { useEffect, useState } from "react";

type Opcion = {
  label: string;
  value: string;
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
    <div className="mb-6 p-4 rounded-xl bg-white border border-rafam-blue shadow-sm transition-all hover:shadow-md">
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
          <p className="font-semibold text-[#1A365D]">
            {pregunta}
          </p>
          <div className="flex flex-col gap-2.5 items-start">
            {opciones.map((opcion) => (
              <label
                key={opcion.value}
                className="flex items-center cursor-pointer text-gray-700 hover:text-[#164280] transition-colors"
              >
                <input
                  type="radio"
                  name={nombre}
                  value={opcion.value}
                  onChange={(e) =>
                    onChange(e.target.name, e.target.value)
                  }
                  className="mr-3 w-4 h-4 text-[#164280] accent-[#164280] focus:ring-[#164280]"
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