// Interfaz para la entidad Credencial 
export interface PerfilAdminCredencial {
  id: number;
  email: string;
  rol: string;
}

// Interfaz para la entidad Nivel
export interface PerfilAdminNivel {
  id: number;
  nombre: string;
}

// Interfaz para el objeto Perfil completo 
export interface PerfilAdmin {
  id: number; 
  nombre: string | null;
  fecha_nacimiento: string | null;
  nivel_actual_id: number;
  credencialesId: number; 
  rol: string; 
  fecha_ultima_evaluacion: string | null; 

  credencial?: PerfilAdminCredencial;
  nivel_actual?: PerfilAdminNivel;
}

export interface UpdateAdminCredencialDto {
  email?: string;
  password?: string;
}

// DTO para actualizar un perfil por parte del administrador
export interface UpdatePerfilAdminDto {
  nombre?: string;
  fecha_nacimiento?: string;
  nivel_actual_id?: number;
  rol?: string;
  credencial?: UpdateAdminCredencialDto;
}

// Interfaces para respuestas paginadas
export interface PaginatedPerfilesAdminResponse {
  data: PerfilAdmin[];
  total: number;
  page: number;
  limit: number;
}

// Filtros para perfiles (para administradores)
export interface FilterPerfilesAdminDto {
  page?: number;
  limit?: number;
  nombre?: string;
  email?: string; 
  nivel_id?: number;
}