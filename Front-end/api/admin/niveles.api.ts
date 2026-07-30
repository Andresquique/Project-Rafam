import apiClient from '../axios.client';

export interface Nivel {
  id: number;
  nombre: string;
}

export const nivelesApi = {
  fetchAll: async (): Promise<Nivel[]> => {
    const response = await apiClient.get<Nivel[]>('/nivel');
    return response.data;
  },
};
