/* eslint-disable @typescript-eslint/no-unused-vars */
// video tal como lo devuelve el back, con las URLs ya cargadas
export interface Video {
  id: number;
  nombre: string;
  descripcion: string;
  url_video: string;
  url_miniatura: string;
  // estos dos son las claves foráneas a zona muscular y nivel
  zona_muscular_id: number;
  nivel_id: number;
  createdAt: string;
  updatedAt: string; 
}

// filtros que acepta el endpoint GET /video, todos opcionales
export interface FilterVideoDto {
  nivel_id?: number;
  zona_muscular_id?: number;
  nombre?: string;
  descripcion?: string;
}

// esto lo dejé de cuando el store vivía acá, ahora se usa BaseVideoState
interface VideoState {
  videos: Video[];
  currentVideo: Video | null;
  loading: boolean;
  error: string | null;
  filters: FilterVideoDto;
}

// datos necesarios para crear un video, sin id ni fechas
export interface CreateVideoDto {
  nombre: string;
  descripcion: string;
  url_video: string;
  url_miniatura: string;
  zona_muscular_id: number;
  nivel_id: number;
}