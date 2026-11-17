
// lo que manda el formulario de login
export interface LoginDto {
  email : string
  password : string
}

// lo mismo pero para el registro, hoy el back pide solo email y password
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
  // id de la credencial, no del perfil (ojo con eso al comparar)
  userId: number;
  email: string;
  rol: string;
  nivel_actual_id: number;
  // iat y exp los agrega el JWT solo, por eso son opcionales
  iat?: number;
  exp?: number;
}

// datos extra del perfil que a veces devuelve el back
export interface PerfilFullDetails {
  id: number; 
  credencialesId: number; 
  nombre?: string;
  apellido?: string;
}