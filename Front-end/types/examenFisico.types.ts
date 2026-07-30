export interface ResultadoExamenDto {
  puntos: number;
}

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