# Simulacro TS - Eventos

Aplicación frontend para gestionar eventos con autenticación, categorías, favoritos y rutas protegidas. El proyecto está desarrollado con React + TypeScript + Vite y usa la API del backend para crear, listar, editar y eliminar eventos.

## Requisitos previos

Antes de correr el proyecto necesitas tener instalado:

- Node.js 18 o superior
- npm
- Un backend corriendo con la API del proyecto

## Variables de entorno

Crea un archivo `.env` en la raíz del proyecto con la URL de tu API:

```bash
VITE_API_URL=http://localhost:3000
```

Si no defines esta variable, el proyecto usa por defecto:

```bash
http://localhost:3000
```

## Cómo correrlo localmente

1. Instala las dependencias:

```bash
npm install
```

2. Inicia el proyecto en modo desarrollo:

```bash
npm run dev
```

3. Abre la app en el navegador:

```bash
http://localhost:5173
```

4. Si quieres compilar para producción:

```bash
npm run build
```

5. Para previsualizar la build:

```bash
npm run preview
```

## Estructura principal

- `src/pages` → páginas de la aplicación
- `src/components` → componentes reutilizables
- `src/context` → contexto de autenticación
- `src/services` → llamadas a la API
- `src/lib` → configuración de Axios y utilidades auxiliares
- `src/routes` → enrutamiento de la app
- `src/types` → tipos TypeScript del dominio

## Token de sesión: localStorage

El token se guarda en `localStorage` mediante la utilidad `tokenStorage` ubicada en `src/lib/tokenStorage.ts`.

```ts
export const TOKEN_KEY = "accessToken";

export const tokenStorage = {
  get: (): string | null => localStorage.getItem(TOKEN_KEY),
  set: (token: string): void => localStorage.setItem(TOKEN_KEY, token),
  remove: (): void => localStorage.removeItem(TOKEN_KEY),
};
```

### ¿Por qué localStorage?

Elegimos `localStorage` porque:

- la sesión debe mantenerse aunque el usuario recargue la página,
- el usuario no necesita cerrar la sesión al refrescar,
- la app requiere que el token siga disponible para peticiones autenticadas en la navegación normal del proyecto.

Usar `sessionStorage` sería válido para sesiones temporales, pero aquí la app necesita persistencia más amplia durante la experiencia del usuario.

## Peticiones HTTP y autenticación

La librería utilizada para las peticiones HTTP es `axios`.

Se configura en `src/lib/api.ts`:

```ts
import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:3000",
});
```

### Interceptor de autenticación

Se implementó un interceptor de request para agregar el token a cada petición:

```ts
api.interceptors.request.use((config) => {
  const token = tokenStorage.get();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

También se manejó un interceptor de respuesta para cerrar sesión automáticamente si el backend responde con `401`:

```ts
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      tokenStorage.remove();
      window.location.href = "auth/login";
    }
    return Promise.reject(error);
  }
);
```

Esto permite:

- enviar el token en todas las peticiones autenticadas,
- detectar sesiones expiradas,
- limpiar el token y redirigir al login cuando el backend rechaza la autenticación.

## Funcionalidades principales

- Login y registro
- Listado de eventos
- Filtros por búsqueda y categoría
- Detalle de un evento
- Creación y edición de eventos
- Eliminación de eventos
- Gestión de favoritos
- Rutas protegidas para usuarios autenticados

## Nota final

Este proyecto está preparado para ejecutarse localmente con un backend que exponga la API definida en el JSON de OpenAPI, usando el puerto configurado con `VITE_API_URL`.
