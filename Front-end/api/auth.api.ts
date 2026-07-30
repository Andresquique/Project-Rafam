// src/api/auth.api.ts
import apiClient from './axios.client';
import {
  LoginDto,
  RegisterDto,
  AuthResponse,
  UserPayload,
} from '../types/auth.types';


export const authApi = {
  // Función para registrar un nuevo usuario.
  // Realiza una petición POST a '/auth/register' con los datos del usuario.
  register: async (userData: RegisterDto): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/register', userData);
    return response.data;
  },

  // Función para iniciar sesión de un usuario.
  // Realiza una petición POST a '/auth/login' con las credenciales del usuario.
  login: async (credentials: LoginDto): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
    return response.data;
  },

  // Función para obtener el perfil del usuario autenticado.
  // Realiza una petición GET a '/auth/me'.
  getProfile: async (): Promise<UserPayload> => {
    const response = await apiClient.get<UserPayload>('/auth/me');
    return response.data;
  },

  // Función para enviar un código de recuperación de contraseña al email.
  // Realiza una petición POST a '/auth/forgot-password' con el email del usuario.
  forgotPassword: async (email: string): Promise<{ message: string }> => {
    const response = await apiClient.post<{ message: string }>('/auth/forgot-password', { email });
    return response.data;
  },

  // Función para cerrar la sesión del usuario.
  // Actualmente solo imprime un mensaje en la consola.
  logout: async (): Promise<void> => {
    console.log('logout action');
  },
};