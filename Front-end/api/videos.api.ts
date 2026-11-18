/* eslint-disable @typescript-eslint/no-explicit-any */
// todas las llamadas de videos salen de acá, las de admin van con el prefijo 'admin'
import axiosClient from './axios.client'; 
import { Video, FilterVideoDto, CreateVideoDto } from '../types/videos.types';

const VIDEO_BASE_URL = '/video'; 

// Obtener videos con filtros opcionales (coincide con el endpoint GET del controller)
// esta la usan tanto el store de usuario como el de admin
export const getVideos = async (filters?: FilterVideoDto): Promise<Video[]> => {

  // Filtrar parámetros undefined/null/vacíos antes de enviar
  // lo hice porque si mandábamos un filtro vacío el back lo tomaba como búsqueda literal
  try {

    const cleanFilters: Record<string, any> = {};
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          cleanFilters[key] = value;
        }
      });
    }

    // Los filtros se envían como query parameters
    const response = await axiosClient.get<Video[]>(VIDEO_BASE_URL, {
      params: cleanFilters 
    });
    
    console.log(`Se encontraron ${response.data.length} videos con filtros:`, cleanFilters);
    return response.data;
  } catch (error) {
    console.error('Error al buscar videos:', error);
    throw error; 
  }
};

// este endpoint devuelve todos los videos, sin filtrar por nivel; lo usa el admin
export const getAllVideos = async (): Promise<Video[]> => {
  try {
    const response = await axiosClient.get<Video[]>('admin' + VIDEO_BASE_URL);
    return response.data;
  } catch (error) {
    console.error('Error al buscar todos los videos:', error);
    throw error;
  }
};

// Obtener un video específico por ID
export const getVideoById = async (id: number): Promise<Video> => {
  try {
    const response = await axiosClient.get<Video>(`${VIDEO_BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener video con ID ${id}:`, error);
    throw error;
  }
};

// eliminar video por ID
// ruta de admin: '/admin/video/:id', armada concatenando como quedó
export const deleteVideo = async (id: number): Promise<Video> => {
  try {
    const response = await axiosClient.delete<Video>('admin' + VIDEO_BASE_URL + '/' + id);
    return response.data;
  } catch (error) {
    console.error(`Error al eliminar video con ID ${id}:`, error);
    throw error;
  }
};

// Crear video por ID
// POST a '/admin/video' con los datos del formulario
export const createVideo = async (videoACrear: CreateVideoDto): Promise<CreateVideoDto> => {
  try {
    const response = await axiosClient.post('admin' + VIDEO_BASE_URL, videoACrear);
    return response.data;
  } catch (error) {
    console.error(`Error al crear el video:`, error);
    throw error;
  }
};

// editar video por ID
// PATCH a '/admin/video/:id', mandamos solo los campos que cambiaron
export const editVideo = async (id : number, videoEditado: Partial<CreateVideoDto>): Promise<Partial<CreateVideoDto>> => {
  try {
    const response = await axiosClient.patch('admin' + VIDEO_BASE_URL + '/' + id, videoEditado);
    return response.data;
  } catch (error) {
    console.error(`Error al crear el video:`, error);
    throw error;
  }
}

