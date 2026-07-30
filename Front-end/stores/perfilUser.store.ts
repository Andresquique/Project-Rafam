/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from 'zustand';
import { PerfilUser, UpdatePerfilUserDto } from '../types/perfilUser.types';
import { perfilUserApi } from '../api/perfilUser.api';
import { UserPayload } from '@/types/auth.types';

interface PerfilUserState {
  myProfile: PerfilUser | null;
  isLoadingMyProfile: boolean;
  myProfileError: string | null;

  getExamenFecha: (user: UserPayload | null) => Promise<void>
  getExamenNuevoUsuario: (user: UserPayload | null) => Promise<void>
  fetchMyProfile: () => Promise<void>;
  updateMyProfile: (data: UpdatePerfilUserDto) => Promise<void>;
  deleteMyProfile: () => Promise<void>;
}

export const usePerfilUserStore = create<PerfilUserState>((set) => ({
  myProfile: null,
  isLoadingMyProfile: false,
  myProfileError: null,

  fetchMyProfile: async () => {
    set({ isLoadingMyProfile: true, myProfileError: null });
    try {
      const profile = await perfilUserApi.fetchMyProfile();
      set({ myProfile: profile, isLoadingMyProfile: false });
    } catch (error: any) {
      console.error('Error fetching my profile:', error);
      set({ myProfileError: error.message || 'Error al cargar mi perfil.', isLoadingMyProfile: false });
    }
  },

  updateMyProfile: async (updateData: UpdatePerfilUserDto) => {
  set({ isLoadingMyProfile: true, myProfileError: null });
  try {
    const updated = await perfilUserApi.updateMyProfile(updateData);
    set({ myProfile: updated, isLoadingMyProfile: false });
  } catch (error: any) {
    const errorMsg = error.message || error.response?.data?.message || 'Error inesperado al actualizar perfil';
    set({ isLoadingMyProfile: false, myProfileError: errorMsg });
    throw new Error(errorMsg); 
  }
},

  deleteMyProfile: async () => {
  set({ isLoadingMyProfile: true, myProfileError: null });
  try {
    await perfilUserApi.deleteMyProfile();
    set({ myProfile: null, isLoadingMyProfile: false });
    window.alert('Perfil eliminado con éxito.');
  } catch (error: any) {
    const errorMsg = error.message || error.response?.data?.message || 'Error inesperado al eliminar perfil';
    set({ isLoadingMyProfile: false, myProfileError: errorMsg });
    throw new Error(errorMsg); 
  }
},
  
  getExamenFecha: async (user: UserPayload | null) => {
    try {
      await perfilUserApi.getExamDate(user);
    } 
    catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al iniciar el formulario fisico.';
      throw new Error(errorMessage);
    }
  },
  
  getExamenNuevoUsuario: async (user: UserPayload | null) => {
    try {
      await perfilUserApi.getExamNewUser(user);
    } 
    catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al iniciar el formulario fisico.';
      throw new Error(errorMessage);
    }
  },
}));