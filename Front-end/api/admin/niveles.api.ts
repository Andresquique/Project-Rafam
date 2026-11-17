// niveles del gimnasio, se usan para los selects de los formularios
import apiClient from '../axios.client';

// lo mínimo que necesitamos del nivel: id y nombre
export interface Nivel {
  id: number;
  nombre: string;
}

export const nivelesApi = {
  // GET '/nivel' y devuelve la lista completa, sin paginar
  fetchAll: async (): Promise<Nivel[]> => {
    const response = await apiClient.get<Nivel[]>('/nivel');
    return response.data;
  },
};
