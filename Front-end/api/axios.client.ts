// src/api/axios.client.ts
import axios from 'axios'; 

const FRONTEND_URL = process.env.BACKEND_URL || 'http://localhost:4000/api/v1';


// Configuración de la instancia de Axios.
// Establece la URL base para todas las peticiones y los encabezados por defecto.
// Habilita el envío de cookies con las credenciales.
const apiClient = axios.create({
  baseURL: FRONTEND_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

//token de acceso
// Interceptor de peticiones de Axios.
// Se ejecuta antes de que se envíe cada petición.
apiClient.interceptors.request.use(
  (config) => {
    let accessToken: string | null = null;
    const authStorage = localStorage.getItem('auth-storage');

    // Intenta parsear el token de acceso desde el almacenamiento local.
    if (authStorage) {
      try {
        const parsedState = JSON.parse(authStorage);
        accessToken = parsedState.state?.accessToken || null;
      } catch (e) {
        console.error('Error de parseo de auth-storage desde localStorage:', e);
        accessToken = null;
      }
    }
    
    // Si existe un token de acceso, lo añade al encabezado de autorización.
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

//configuracion de estados
// Interceptor de respuestas de Axios.
// Se ejecuta después de que se recibe cada respuesta.
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;