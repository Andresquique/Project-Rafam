// src/api/axios.client.ts
// acá armamos una sola instancia de axios y después la reutilizan todas las api
import axios from 'axios'; 

// ojo que el nombre quedó medio raro: es FRONTEND_URL pero en realidad apunta al backend
const FRONTEND_URL = process.env.BACKEND_URL || 'http://localhost:4000/api/v1';


// acá configuro una sola vez la URL base y el Content-Type para todas las llamadas
// withCredentials lo puse porque el back también manda cookies, si no el navegador las ignora
const apiClient = axios.create({
  baseURL: FRONTEND_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// token de acceso: esto corre antes de mandar cada petición
apiClient.interceptors.request.use(
  (config) => {
    let accessToken: string | null = null;
    // el token vive en localStorage porque el store de auth usa persist con esta key
    const authStorage = localStorage.getItem('auth-storage');

    // leo el token guardado por el store de auth (si algo está mal escrito, no explota)
    if (authStorage) {
      try {
        const parsedState = JSON.parse(authStorage);
        // zustand persist guarda todo adentro de "state", por eso entramos así
        accessToken = parsedState.state?.accessToken || null;
      } catch (e) {
        console.error('Error de parseo de auth-storage desde localStorage:', e);
        accessToken = null;
      }
    }
    
    // Si existe un token de acceso, lo añade al encabezado de autorización.
    // ojo que este interceptor corre en cada request, por eso leemos el storage siempre
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// respuestas: por ahora solo deja pasar todo, por si después queremos manejar errores acá
// pendiente: si quisiéramos refrescar el token automático, iría en este interceptor
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;