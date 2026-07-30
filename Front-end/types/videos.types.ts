/* eslint-disable @typescript-eslint/no-unused-vars */
export interface Video {
  id: number;
  nombre: string;
  descripcion: string;
  url_video: string;
  url_miniatura: string;
  zona_muscular_id: number;
  nivel_id: number;
  createdAt: string;
  updatedAt: string; 
}

export interface FilterVideoDto {
  nivel_id?: number;
  zona_muscular_id?: number;
  nombre?: string;
  descripcion?: string;
}

interface VideoState {
  videos: Video[];
  currentVideo: Video | null;
  loading: boolean;
  error: string | null;
  filters: FilterVideoDto;
}

export interface CreateVideoDto {
  nombre: string;
  descripcion: string;
  url_video: string;
  url_miniatura: string;
  zona_muscular_id: number;
  nivel_id: number;
}