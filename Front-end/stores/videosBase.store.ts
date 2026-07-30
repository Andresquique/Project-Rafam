/* eslint-disable @typescript-eslint/no-explicit-any */
// stores/base/videoBase.store.ts
import { getVideos, getVideoById } from '../api/videos.api';
import { Video, FilterVideoDto } from '../types/videos.types';

// Estado base compartido
export interface BaseVideoState {
  videos: Video[];
  currentVideo: Video | null;
  loading: boolean;
  error: string | null;
  filters: FilterVideoDto;
}

// Acciones base compartidas
export interface BaseVideoActions {
  fetchVideos: (filters?: FilterVideoDto) => Promise<void>;
  fetchVideoById: (id: number) => Promise<void>;
  setFilters: (filters: FilterVideoDto) => void;
  clearFilters: () => Promise<void>;
  searchVideos: (searchTerm: string) => Promise<void>;
  filterByLevel: (nivel_id?: number) => Promise<void>;
  filterByZone: (zona_muscular_id?: number) => Promise<void>;
  applyFilters: (filters: FilterVideoDto) => Promise<void>;
  clearError: () => void;
  clearCurrentVideo: () => void;
}

// Estado inicial compartido
export const initialVideoState: BaseVideoState = {
  videos: [],
  currentVideo: null,
  loading: false,
  error: null,
  filters: {},
};

export const createBaseVideoActions = (set: any, get: any): BaseVideoActions => ({
  fetchVideos: async (filters?: FilterVideoDto) => {
    set({ loading: true, error: null });
    try {
      const filtersToUse = filters || get().filters;
      const fetchedVideos = await getVideos(filtersToUse);
      set({ 
        videos: fetchedVideos, 
        loading: false,
        filters: filtersToUse
      });
    } catch (err: any) {
      set({ 
        error: err.message || 'Error al buscar videos', 
        loading: false 
      });
      console.error('Error cargando los videos:', err);
    }
  },

  fetchVideoById: async (id: number) => {
    set({ loading: true, error: null });
    try {
      const video = await getVideoById(id);
      set({ 
        currentVideo: video, 
        loading: false 
      });
    } catch (err: any) {
      set({ 
        error: err.message || `Error al obtener video con ID ${id}`, 
        loading: false 
      });
      console.error(`Error cargando video ${id}:`, err);
    }
  },

  setFilters: (filters: FilterVideoDto) => {
  set({ filters });
  return get().fetchVideos(filters); // Return the promise
},

  clearFilters: async () => {
    set({ filters: {} });
    await get().fetchVideos({});
  },

  searchVideos: async (searchTerm: string) => {
    const filters: FilterVideoDto = {
      ...get().filters,
      nombre: searchTerm || undefined,
      descripcion: searchTerm || undefined
    };
    await get().fetchVideos(filters);
  },

  filterByLevel: async (nivel_id?: number) => {
    const filters: FilterVideoDto = {
      ...get().filters,
      nivel_id: nivel_id || undefined
    };
    set({ filters });
    await get().fetchVideos(filters);
  },

  filterByZone: async (zona_muscular_id?: number) => {
    const filters: FilterVideoDto = {
      ...get().filters,
      zona_muscular_id: zona_muscular_id || undefined
    };
    set({ filters });
    await get().fetchVideos(filters);
  },

  applyFilters: async (filters: FilterVideoDto) => {
    set({ filters });
    await get().fetchVideos(filters);
  },

  clearError: () => {
    set({ error: null });
  },

  clearCurrentVideo: () => {
    set({ currentVideo: null });
  },
});