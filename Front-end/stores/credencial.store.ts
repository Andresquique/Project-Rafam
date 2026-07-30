/* eslint-disable @typescript-eslint/no-explicit-any */
// src/stores/credencial.store.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { credencialApi } from '../api/credencial.api'; // Importa tu API de credenciales
import { Credencial } from '../types/credencial.types';

// Define la interfaz de estado para el store de credenciales.
interface CredencialState {
  currentCredencial: Credencial | null;
  isLoading: boolean;
  error: string | null;

  // Acciones para interactuar con las credenciales
  createCredencial: (data: Credencial) => Promise<Credencial | null>;
  fetchCredencialById: (id: number) => Promise<Credencial | null>;
  fetchCredencialByEmail: (email:string) => Promise<Credencial | null>;
  updateCredencial: (id: number, data: Credencial) => Promise<Credencial | null>;
  deleteCredencial: (id: number) => Promise<void>;
  
  setLoading: (loading: boolean) => void;
  setError: (errorMessage: string | null) => void;
  clearCredencial: () => void;
}

export const useCredencialStore = create<CredencialState>()(
  persist(
    (set) => ({ 
      currentCredencial: null,
      isLoading: false,
      error: null,

      //Crea una nueva credencial enviando los datos a la API.
      createCredencial: async (data) => {
        set({ isLoading: true, error: null });
        try {
          const newCredencial = await credencialApi.create(data);
          set({ currentCredencial: newCredencial, isLoading: false });
          return newCredencial;
        } catch (err: any) {
          const errorMessage = err.response?.data?.message || err.message || 'Error desconocido al crear credencial.';
          console.error('Error en createCredencial (credencial.store):', err);
          set({ error: errorMessage, isLoading: false });
          throw new Error(errorMessage);
        }
      },

      //Obtiene una credencial por su ID desde la API.
      fetchCredencialById: async (id) => {
        set({ isLoading: true, error: null });
        try {
          const credencial = await credencialApi.getById(id);
          set({ currentCredencial: credencial, isLoading: false });
          return credencial;
        } catch (err: any) {
          const errorMessage = err.response?.data?.message || err.message || 'Error desconocido al obtener credencial.';
          console.error('Error en fetchCredencialById (credencial.store):', err);
          set({ error: errorMessage, isLoading: false });
          throw new Error(errorMessage);
        }
      },

      //Obtiene una credencial por su dirección de correo electrónico desde la API.
      fetchCredencialByEmail: async (email) => {
        set({ isLoading: true, error: null });
        try {
          const credencial = await credencialApi.getByEmail(email);
          set({ currentCredencial: credencial, isLoading: false });
          return credencial;
        } catch (err: any) {
          const errorMessage = err.response?.data?.message || err.message || 'Error desconocido al obtener credencial.';
          console.error('Error en fetchCredencialByEmail (credencial.store):', err);
          set({ error: errorMessage, isLoading: false });
          throw new Error(errorMessage);
        }
      },

      //Actualiza una credencial existente por su ID con los nuevos datos.
      updateCredencial: async (id, data) => {
        set({ isLoading: true, error: null });
        try {
          const updatedCredencial = await credencialApi.update(id, data);
          set({ currentCredencial: updatedCredencial, isLoading: false });
          return updatedCredencial;
        } catch (err: any) {
          const errorMessage = err.response?.data?.message || err.message || 'Error desconocido al actualizar credencial.';
          console.error('Error en updateCredencial (credencial.store):', err);
          set({ error: errorMessage, isLoading: false });
          throw new Error(errorMessage);
        }
      },

      //Elimina una credencial por su ID de la API.
      deleteCredencial: async (id) => {
        set({ isLoading: true, error: null });
        try {
          await credencialApi.delete(id);
          set({ currentCredencial: null, isLoading: false }); // Limpia la credencial del store al eliminarla
        } catch (err: any) {
          const errorMessage = err.response?.data?.message || err.message || 'Error desconocido al eliminar credencial.';
          console.error('Error en deleteCredencial (credencial.store):', err);
          set({ error: errorMessage, isLoading: false });
          throw new Error(errorMessage);
        }
      },

      setLoading: (loading: boolean) => set({ isLoading: loading }),
      setError: (errorMessage: string | null) => set({ error: errorMessage }),
      clearCredencial: () => set({ currentCredencial: null, error: null, isLoading: false }),
    }),

    //Configuración de persistencia
    {
      name: 'credencial-storage', 
      storage: createJSONStorage(() => localStorage),
      partialize: () => ({
      }),
    }
  )
);