// zonas musculares, mismo esquema simple que niveles
import apiClient from '../axios.client';

// igual que Nivel, solo id y nombre
export interface ZonaMuscular {
  id: number;
  nombre: string;
}

export const zonasMuscularesApi = {
  // GET '/zona-muscular', se usa para filtrar los videos
  fetchAll: async (): Promise<ZonaMuscular[]> => {
    const response = await apiClient.get<ZonaMuscular[]>('/zona-muscular');
    return response.data;
  },
};
