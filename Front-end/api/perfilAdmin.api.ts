//Servicio API para la gestión de perfiles de usuario por parte del administrador.

import apiClient from './axios.client';
import { PerfilAdmin, UpdatePerfilAdminDto, FilterPerfilesAdminDto } from '../types/perfilAdmin.types';

export const perfilAdminApi = {
  
  // Función para obtener todos los perfiles de administrador, con filtros opcionales.
  // Realiza una petición GET a '/admin/perfil'.
  fetchAllPerfiles: async (query?: FilterPerfilesAdminDto): Promise<PerfilAdmin[]> => {
    const response = await apiClient.get<PerfilAdmin[]>('/admin/perfil', { params: query });
    return response.data;
  },
  
  // Función para obtener un perfil de administrador específico por su ID.
  // Realiza una petición GET a '/admin/perfil/:id'.
  fetchPerfilById: async (id: number): Promise<PerfilAdmin> => {
    const response = await apiClient.get<PerfilAdmin>(`/admin/perfil/${id}`);
    return response.data;
  },
  
  // Función para actualizar un perfil de administrador existente por su ID.
  // Realiza una petición PATCH a '/admin/perfil/:id' con los datos actualizados.
  updatePerfil: async (id: number, data: UpdatePerfilAdminDto): Promise<PerfilAdmin> => {
    const response = await apiClient.patch<PerfilAdmin>(`/admin/perfil/${id}`, data);
    return response.data;
  },

  // Función para eliminar un perfil de administrador por su ID.
  // Realiza una petición DELETE a '/admin/perfil/:id'.
  deletePerfil: async (id: number): Promise<void> => {
    await apiClient.delete(`/admin/perfil/${id}`);
  },
};