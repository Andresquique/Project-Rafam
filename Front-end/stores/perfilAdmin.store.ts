/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from 'zustand';
import { PerfilAdmin, UpdatePerfilAdminDto, FilterPerfilesAdminDto } from '../types/perfilAdmin.types';
import { perfilAdminApi } from '../api/perfilAdmin.api';

interface PerfilAdminState {
  // lista de perfiles que se muestra en la tabla
  perfiles: PerfilAdmin[];
  isLoadingPerfiles: boolean;
  perfilesError: string | null;

  // paginación y filtros que se mandan al back
  currentPage: number;
  totalPerfiles: number;
  limit: number;
  filters: FilterPerfilesAdminDto;

  fetchAllPerfiles: (filters?: FilterPerfilesAdminDto) => Promise<void>;
  fetchPerfilById: (id: number) => Promise<PerfilAdmin | null>;
  updatePerfil: (id: number, data: UpdatePerfilAdminDto) => Promise<PerfilAdmin>; // Cambiado a Promise<PerfilAdmin>
  deletePerfil: (id: number) => Promise<void>;

  setFilters: (filters: FilterPerfilesAdminDto) => Promise<void>; // Cambiado a Promise<void>
  setCurrentPage: (page: number) => Promise<void>; // Cambiado a Promise<void>
  clearFilters: () => Promise<void>; // Nueva función para limpiar filtros
}

// este store no usa persist, así que la tabla arranca vacía cada vez que se recarga
export const usePerfilAdminStore = create<PerfilAdminState>((set, get) => ({
  perfiles: [],
  isLoadingPerfiles: false,
  perfilesError: null,

  currentPage: 1,
  totalPerfiles: 0,
  limit: 10,
  filters: {},

  fetchAllPerfiles: async (filters?: FilterPerfilesAdminDto) => {
    set({ isLoadingPerfiles: true, perfilesError: null });
    try {
      const perfiles = await perfilAdminApi.fetchAllPerfiles(filters);
      set({ 
        perfiles: perfiles, 
        isLoadingPerfiles: false,
        // Actualizar filtros actuales si se proporcionaron
        ...(filters && { filters })
      });
    } catch (error: any) {
      const errorMsg = error.message || error.response?.data?.message || 'Error al cargar perfiles.';
      set({ isLoadingPerfiles: false, perfilesError: errorMsg, perfiles: [] });
      throw new Error(errorMsg); 
    }
  },

  fetchPerfilById: async (id: number): Promise<PerfilAdmin | null> => {
    set({ isLoadingPerfiles: true, perfilesError: null });
    try {
      const perfil = await perfilAdminApi.fetchPerfilById(id);
      set({ isLoadingPerfiles: false });
      return perfil;
    } catch (error: any) {
      const errorMsg = error.message || error.response?.data?.message || `Error al cargar perfil ${id}.`;
      set({ isLoadingPerfiles: false, perfilesError: errorMsg });
      throw new Error(errorMsg); 
    }
  },

  updatePerfil: async (id: number, data: UpdatePerfilAdminDto) => {
    set({ isLoadingPerfiles: true, perfilesError: null });
    try {
      const updatedPerfil = await perfilAdminApi.updatePerfil(id, data);
      set((state) => ({
        // acá comparo contra credencialesId porque el id que llega es el de la credencial
        perfiles: state.perfiles.map((p) => (p.credencialesId === id ? updatedPerfil : p)),
        isLoadingPerfiles: false,
      }));
      // No usar alert aquí, mejor retornar success para manejar en el componente
      return updatedPerfil;
    } catch (error: any) {
      const errorMsg = error.message || error.response?.data?.message || `Error al actualizar perfil ${id}.`;
      set({ isLoadingPerfiles: false, perfilesError: errorMsg });
      throw new Error(errorMsg); 
    }
  },

  deletePerfil: async (id: number) => {
    set({ isLoadingPerfiles: true, perfilesError: null });
    try {
      await perfilAdminApi.deletePerfil(id);
      set((state) => ({
        // sacamos el perfil de la lista sin volver a pedir todo de nuevo
        perfiles: state.perfiles.filter((p) => p.credencialesId !== id),
        isLoadingPerfiles: false,
        totalPerfiles: Math.max(0, state.totalPerfiles - 1) // Actualizar total
      }));
      // No usar alert aquí, mejor retornar success para manejar en el componente
    } catch (error: any) {
      const errorMsg = error.message || error.response?.data?.message || `Error al eliminar perfil ${id}.`;
      set({ isLoadingPerfiles: false, perfilesError: errorMsg });
      throw new Error(errorMsg); 
    }
  },

  setFilters: async (filters: FilterPerfilesAdminDto) => {
    // si no mandan página o límite, arrancamos en la 1 y usamos el limit del store
    const newFilters = { ...filters, page: filters.page || 1, limit: filters.limit || get().limit };
    set({ 
      filters: newFilters, 
      currentPage: newFilters.page || 1 
    });
    
    // Ejecutar la búsqueda con los nuevos filtros
    await get().fetchAllPerfiles(newFilters);
  },

  setCurrentPage: async (page: number) => {
    const currentFilters = get().filters;
    const newFilters = { ...currentFilters, page, limit: get().limit };
    
    set({ currentPage: page });
    await get().fetchAllPerfiles(newFilters);
  },

  clearFilters: async () => {
    set({ 
      filters: {}, 
      currentPage: 1 
    });
    await get().fetchAllPerfiles();
  },
}));