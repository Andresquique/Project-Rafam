// acá está la llamada del examen físico, el resto de la lógica vive en el store
import apiClient from './axios.client';
import { ResultadoExamenDto, ExamenResponse } from '../types/examenFisico.types';

export const examenFisicoApi = {

  // Función para actualizar un resultado de examen físico.
  // Realiza una petición POST a '/examen' con los datos del resultado del examen.
  // aunque se llame update, es un POST; el back devuelve el perfil nuevo y otro token
  update: async (userData: ResultadoExamenDto): Promise<ExamenResponse> => {
    const response = await apiClient.post<ExamenResponse>('/examen', userData);
    return response.data;
  },
};