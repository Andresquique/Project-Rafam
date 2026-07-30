/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { ResultadoExamenDto, ExamenResponse } from '../types/examenFisico.types';
import { examenFisicoApi } from '../api/examenFisico.api';
import { useAuthStore } from './auth.store';

interface ExamenState {
  result: ExamenResponse | null;
  isLoading: boolean;
  error: string | null;
  clearError: () => void;
  clearResult: () => void;
  updateExamen: (resultadoExamen: ResultadoExamenDto) => Promise<void>;
}

export const useExamenStore = create<ExamenState>()(
  persist(
    (set, get) => ({
      result: null,
      isLoading: false,
      error: null,

      //Envía los resultados de un examen físico a la API para su actualización.
      updateExamen: async (resultadoExamen: ResultadoExamenDto) => {
        set({ isLoading: true, error: null });
        try {
          const resultado = await examenFisicoApi.update(resultadoExamen);
          set({ result: resultado, isLoading: false });

          // Actualizar el token y usuario en el store de auth
          const authStore = useAuthStore.getState();
          authStore.updateAuthData({
            access_token: resultado.access_token,
            user: {
              userId: resultado.perfil.credencial.id,
              email: resultado.perfil.credencial.email,
              rol: resultado.perfil.rol,
              nivel_actual_id: resultado.perfil.nivel_actual_id,
            },
          });

        } catch (err: any) {
          const errorMessage = err.response?.data?.message || err.message || 'Error desconocido al actualizar examen.';
          console.error('Error en updateExamen:', err);
          set({ error: errorMessage, isLoading: false });
          throw new Error(errorMessage);
        }
      },

      clearError: () => set({ error: null }),
      
      clearResult: () => set({ result: null }),
    }),
    
    //Configuración de persistencia
    {
      name: 'examen-storage'
    }
  )
);