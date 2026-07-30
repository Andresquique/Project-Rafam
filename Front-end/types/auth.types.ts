
export interface LoginDto {
  email : string
  password : string
}

export interface RegisterDto {
  email : string
  password : string
}

// Interfaz para la respuesta del login/registro (solo el token de acceso)
export interface AuthResponse {
  access_token: string; 
}

// Interfaz para el payload del JWT 
export interface UserPayload {
  userId: number;
  email: string;
  rol: string;
  nivel_actual_id: number;
  iat?: number;
  exp?: number;
}

export interface PerfilFullDetails {
  id: number; 
  credencialesId: number; 
  nombre?: string;
  apellido?: string;
}