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
  // viene como string ISO, por eso no es Date
  fecha_nacimiento: string | null;
  nivel_actual_id: number;
  // este es el id que se usa para actualizar/eliminar desde el panel
  credencialesId: number; 
  rol: string; 
  fecha_ultima_evaluacion: string | null; 

  // estas dos vienen solo cuando el back las incluye en el detalle
  credencial?: PerfilAdminCredencial;
  nivel_actual?: PerfilAdminNivel;
}

// lo que se puede cambiar de la credencial desde el panel de admin
export interface UpdateAdminCredencialDto {
  email?: string;
  password?: string;
}

// DTO para actualizar un perfil por parte del administrador
// todo opcional porque se manda solo lo que se modificó
export interface UpdatePerfilAdminDto {
  nombre?: string;
  fecha_nacimiento?: string;
  nivel_actual_id?: number;
  rol?: string;
  credencial?: UpdateAdminCredencialDto;
}

// Interfaces para respuestas paginadas
// ojo que hoy la api devuelve un array pelado, esto quedó por si se pagina en el back
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