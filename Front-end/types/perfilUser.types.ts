// Interfaces para la entidad Credencial 
export interface PerfilUserCredencial {
  id: number;
  email: string;
  rol: string; 
}

// Interfaces para la entidad Nivel 
export interface PerfilUserNivel {
  id: number;
  nombre: string;
}

// Interfaz para el objeto Perfil completo
export interface PerfilUser {
  id: number; 
  nombre: string | null;
  fecha_nacimiento: string | null; 
  nivel_actual_id: number;
  credencialesId: number; 
  rol: string; 
  fecha_ultima_evaluacion: string | null; 
  credencial?: PerfilUserCredencial;
  nivel_actual?: PerfilUserNivel;
}

// Interfaz para la actualización de credenciales
export interface UpdateUserCredencialDto {
  email?: string;
  password?: string;
}

// DTO para actualizar el perfil del usuario
export interface UpdatePerfilUserDto {
  nombre?: string;
  fecha_nacimiento?: string; 
  nivel_actual_id?: number;
  credencial?: UpdateUserCredencialDto; 
}