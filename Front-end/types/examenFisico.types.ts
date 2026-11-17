// lo único que manda el formulario del examen son los puntos obtenidos
export interface ResultadoExamenDto {
  puntos: number;
}

// respuesta del examen: perfil actualizado + token nuevo con el nivel que corresponda
export interface ExamenResponse {
  perfil: {
    id: number;
    credencial: {
      id: number;
      email: string;
    };
    rol: string;
    nivel_actual_id: number;
    fecha_ultima_evaluacion: string | null;
  };
  access_token: string;
}