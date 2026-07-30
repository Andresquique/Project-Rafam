/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

import { LoginDto, RegisterDto, UserPayload } from '../types/auth.types';
import { authApi } from '../api/auth.api';

interface AuthState {
  accessToken: string | null;
  user: UserPayload | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  isInitialized: boolean; 

  login: (credentials: LoginDto) => Promise<void>;
  register: (userData: RegisterDto) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
  setLoading: (loading: boolean) => void;
  setError: (errorMessage: string | null) => void;
  hasPermission: (rolRequerido: string) => boolean;
  updateAuthData: (data: { access_token: string; user: UserPayload }) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      accessToken: null,
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      isInitialized: false,

      login: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
          const { access_token } = await authApi.login(credentials);
          set({ accessToken: access_token, isAuthenticated: true });

          const userPayload = await authApi.getProfile();
          set({ user: userPayload, isLoading: false });

        } catch (err: any) {
          const errorMessage = err.response?.data?.message || err.message || 'Error desconocido al iniciar sesión.';
          console.error('Error en login :', err);
          set({ error: errorMessage, isLoading: false, isAuthenticated: false, user: null });
          throw new Error(errorMessage);
        }
      },

      register: async (userData) => {
        set({ isLoading: true, error: null });
        try {
          const { access_token } = await authApi.register(userData);
          set({ accessToken: access_token, isAuthenticated: true });

          const userPayload = await authApi.getProfile();
          set({ user: userPayload, isLoading: false });

        } catch (err: any) {
          const errorMessage = err.response?.data?.message || err.message || 'Error desconocido al registrarse.';
          console.error('Error en register (auth.store):', err);
          set({ error: errorMessage, isLoading: false, isAuthenticated: false, user: null });
          throw new Error(errorMessage);
        }
      },

      logout: () => {
        set({ 
          accessToken: null, 
          user: null, 
          isAuthenticated: false, 
          error: null, 
          isLoading: false 
        });
      },

      checkAuth: async () => {
        const currentToken = get().accessToken;

        if (!currentToken) {
          set({ isAuthenticated: false, user: null, isLoading: false, isInitialized: true });
          return;
        }

        set({ isLoading: true, error: null });
        try {
          const userPayload = await authApi.getProfile();
          set({ 
            user: userPayload, 
            isAuthenticated: true, 
            isLoading: false, 
            isInitialized: true 
          });
        } catch (err: any) {
          console.error('Error al verificar autenticación (auth.store):', err);
          get().logout();
        }
      },

      setLoading: (loading: boolean) => set({ isLoading: loading }),
      setError: (errorMessage: string | null) => set({ error: errorMessage }),
      hasPermission: (rolRequerido: string) => {
        const currentUser = get().user;
        console.log(currentUser?.email)
        if (!currentUser) {
          return false;
        }
        // Verifica si el usuario tiene al menos uno de los roles requeridos
        return rolRequerido === currentUser.rol;
      },

      // Nueva función para actualizar datos de autenticación
      updateAuthData: (data: { access_token: string; user: UserPayload }) => {
        set({ 
          accessToken: data.access_token, 
          user: data.user,
          isAuthenticated: true,
          error: null 
        });
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        accessToken: state.accessToken,
        user: state.user,
      }),
      onRehydrateStorage: (state) => {
        return (state, error) => {
          if (error) {
            console.error('Failed to rehydrate auth store', error);
            state?.logout();
          } else if (state) {
            if (state.accessToken) {
              state.checkAuth();
            } else {
              state.isInitialized = true;
            }
          }
        };
      },
    }
  )
);

export type { LoginDto };