// src/api/credencial.api.ts
// CRUD básico de credenciales, todo pasa por axios.client
import apiClient from './axios.client';
import { Credencial } from '../types/credencial.types';

export const credencialApi = {

  // Función para crear una nueva credencial.
  // Realiza una petición POST a '/credencial' con los datos de la credencial.
  create: async (data: Credencial): Promise<Credencial> => {
    const response = await apiClient.post<Credencial>('/credencial', data);
    return response.data;
  },

  // Función para obtener una credencial por su ID.
  // Realiza una petición GET a '/credencial/:id'.
  getById: async (id: number): Promise<Credencial> => {
    const response = await apiClient.get<Credencial>(`/credencial/${id}`);
    return response.data;
  },

  // Función para obtener una credencial por su email.
  // Realiza una petición GET a '/credencial/:email'.
  // fijate que usa la misma ruta que getById, el back diferencia por el tipo de dato
  getByEmail: async (email: string): Promise<Credencial> => {
    const response = await apiClient.get<Credencial>(`/credencial/${email}`);
    return response.data;
  },

  // Función para actualizar una credencial existente por su ID.
  // Realiza una petición PATCH a '/credencial/:id' con los datos actualizados.
  update: async (id: number, data: Credencial): Promise<Credencial> => {
    const response = await apiClient.patch<Credencial>(`/credencial/${id}`, data);
    return response.data;
  },

  // Función para eliminar una credencial por su ID.
  // Realiza una petición DELETE a '/credencial/:id'.
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/credencial/${id}`);
  },
};