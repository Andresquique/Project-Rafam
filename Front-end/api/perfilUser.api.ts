//Servicio API para la interacción con el perfil del usuario autenticado.

import { UserPayload } from '@/types/auth.types';
import { PerfilUser, UpdatePerfilUserDto } from '../types/perfilUser.types';
import apiClient from './axios.client';

export const perfilUserApi = {

  // Función para obtener el perfil del usuario autenticado.
  // Realiza una petición GET a '/perfil'.
  fetchMyProfile: async (): Promise<PerfilUser> => {
    const response = await apiClient.get<PerfilUser>('/perfil');
    return response.data; 
  },

  // Función para actualizar el perfil del usuario autenticado.
  // Realiza una petición PATCH a '/perfil' con los datos actualizados.
  updateMyProfile: async (data: UpdatePerfilUserDto): Promise<PerfilUser> => {
    const response = await apiClient.patch<PerfilUser>('/perfil', data);
    return response.data; 
  },

  // Función para eliminar el perfil del usuario autenticado.
  // Realiza una petición DELETE a '/perfil'.
  deleteMyProfile: async (): Promise<void> => {
    await apiClient.delete('/perfil');
  },
  
  // Función para obtener la fecha del examen de un usuario.
  // Realiza una petición GET a '/examen' con los parámetros del usuario.
  getExamDate: async (user: UserPayload | null): Promise<void | null> => {
    await apiClient.get<void>('/examen', { params: user });
  },
  
  // Función para obtener el examen de un nuevo usuario.
  // Realiza una petición GET a '/examen/nuevo' con los parámetros del usuario.
  getExamNewUser: async (user: UserPayload | null): Promise<void | null> => {
    await apiClient.get<void>('/examen/nuevo', { params: user });
  },
  
};