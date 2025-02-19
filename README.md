# Backend API para Gestión de Productos

## Descripción
API RESTful para gestión de productos utilizando Express, TypeScript y Supabase.

## Requisitos Previos
- Node.js (v18+)
- npm
- Cuenta de Supabase

## Instalación

1. Clonar el repositorio
```bash
git clone https://github.com/tu-usuario/backend-api-supabase.git
cd backend-api-supabase
```

2. Instalar dependencias
```bash
npm install
```

3. Configurar variables de entorno
Copiar `.env.example` a `.env` y completar con tus credenciales:
- `PORT`: Puerto del servidor
- `SUPABASE_URL`: URL de tu proyecto Supabase
- `SUPABASE_KEY`: Clave de Supabase
- `API_KEY`: Clave de autenticación para los endpoints
- `NODE_ENV`: Entorno de ejecución

## Scripts

- `npm run dev`: Iniciar servidor en modo desarrollo
- `npm start`: Iniciar servidor en producción
- `npm run build`: Compilar TypeScript
- `npm test`: Ejecutar pruebas

## Endpoints

### Productos

- `GET /productos`: Listar todos los productos
- `GET /productos/:id`: Obtener producto por ID
- `POST /productos`: Crear nuevo producto
- `PUT /productos/:id`: Actualizar producto
- `DELETE /productos/:id`: Eliminar producto

### Autenticación
Todos los endpoints requieren una clave API válida en el header `x-api-key`

## Pruebas
Ejecutar pruebas con:
```bash
.\test_endpoints.ps1
.\test_productos_api.ps1
```

## Despliegue en Netlify

1. Crear archivo `netlify.toml`:
```toml
[build]
  command = "npm run build"
  functions = "dist"
  publish = "dist"

[build.environment]
  NODE_VERSION = "18"
```

2. Configurar variables de entorno en Netlify
- Ir a Netlify > Site Settings > Build & Deploy > Environment
- Añadir variables: `SUPABASE_URL`, `SUPABASE_KEY`, `API_KEY`

## Contribuciones
Por favor, lee CONTRIBUTING.md para detalles sobre nuestro código de conducta.

## Licencia
Este proyecto está bajo Licencia MIT - ver LICENSE.md
