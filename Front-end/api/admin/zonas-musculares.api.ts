import apiClient from '../axios.client';

export interface ZonaMuscular {
  id: number;
  nombre: string;
}

export const zonasMuscularesApi = {
  fetchAll: async (): Promise<ZonaMuscular[]> => {
    const response = await apiClient.get<ZonaMuscular[]>('/zona-muscular');
    return response.data;
  },
};
