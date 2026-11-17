/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from 'zustand';
import { BaseVideoState, BaseVideoActions, initialVideoState, createBaseVideoActions } from './videosBase.store'
import { CreateVideoDto } from '../types/videos.types';
import { createVideo, deleteVideo, editVideo } from '../api/videos.api';

interface AdminVideoState extends BaseVideoState {
  // flags separados para saber qué operación está en curso
  creating: boolean;
  updating: boolean;
  deleting: boolean;
}

// Acciones adicionales para admin
interface AdminVideoActions extends BaseVideoActions {
  editVideo: (id: number, infoVideo: Partial<CreateVideoDto>) => Promise<void>;
  createVideo: (videoData: any) => Promise<void>;
  deleteVideo: (id: number) => Promise<void>;
  clearCreating: () => void;
  clearUpdating: () => void;
  clearDeleting: () => void;
}

// Estado inicial extendido
const initialAdminState: AdminVideoState = {
  ...initialVideoState,
  creating: false,
  updating: false,
  deleting: false,
};

// Crear acciones adicionales de admin
// reusamos las acciones base y le sumamos el ABM de videos
const createAdminVideoActions = (set: any, get: any) => ({
  ...createBaseVideoActions(set, get), 
  
  // Actualizar la lista de videos
  editVideo: async (id: number, infoVideo: Partial<CreateVideoDto>) => {
    set({ updating: true, error: null });
    try {
      const updatedVideo = await editVideo(id, infoVideo);
      
      
      // en vez de recargar todo, reemplazamos el video en la lista que ya tenemos
      const currentVideos = get().videos;
      const updatedVideos = currentVideos.map((video: any) => 
        video.id === id ? updatedVideo : video
      );
      
      set({ 
        videos: updatedVideos,
        updating: false,
        currentVideo: get().currentVideo?.id === id ? updatedVideo : get().currentVideo
      });
      
      console.log('Video editado exitosamente:', updatedVideo);
    } catch (err: any) {
      set({ 
        error: err.message || `Error al editar video con ID ${id}`, 
        updating: false 
      });
      console.error(`Error editando video ${id}:`, err);
    }
  },

  // Agregar el nuevo video a la lista
  createVideo: async (videoData: any) => {
    set({ creating: true, error: null });
    try {
      const newVideo = await createVideo(videoData);
      
      
      // lo ponemos primero así aparece arriba de todo en la tabla
      const currentVideos = get().videos;
      set({ 
        videos: [newVideo, ...currentVideos],
        creating: false,
        currentVideo: newVideo
      });
      
      console.log('Video creado exitosamente:', newVideo);
    } catch (err: any) {
      set({ 
        error: err.message || 'Error al crear el video', 
        creating: false 
      });
      console.error('Error creando video:', err);
    }
  },

   // Remover el video de la lista
  deleteVideo: async (id: number) => {
    set({ deleting: true, error: null });
    try {
      await deleteVideo(id);
      
      // si el video borrado era el que se estaba viendo, limpiamos currentVideo
      const currentVideos = get().videos;
      const filteredVideos = currentVideos.filter((video: any) => video.id !== id);
      
      set({ 
        videos: filteredVideos,
        deleting: false,
        currentVideo: get().currentVideo?.id === id ? null : get().currentVideo
      });
      
      console.log(`Video con ID ${id} eliminado exitosamente`);
    } catch (err: any) {
      set({ 
        error: err.message || `Error al eliminar video con ID ${id}`, 
        deleting: false 
      });
      console.error(`Error eliminando video ${id}:`, err);
    }
  },

  clearCreating: () => {
    set({ creating: false });
  },

  clearUpdating: () => {
    set({ updating: false });
  },

  clearDeleting: () => {
    set({ deleting: false });
  },
});

// Store de admin que extiende el base
// no tiene persist, así que la lista se vuelve a pedir al entrar a la pantalla
export const useVideoAdminStore = create<AdminVideoState & AdminVideoActions>((set, get) => ({
  ...initialAdminState,
  ...createAdminVideoActions(set, get),
}));