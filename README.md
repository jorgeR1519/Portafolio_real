# Portafolio Web Full Stack

Portafolio personal desarrollado con `FastAPI` en el backend y `React + Vite + TypeScript` en el frontend.

Incluye:

- seccion de perfil profesional
- proyectos cargados desde una API propia
- paginacion de proyectos de 4 en 4
- cambio de tema dia/noche
- seccion de certificaciones
- formulario de contacto conectado a `FastAPI`
- enlace a blog tecnico con writeups de Hack The Box

## Stack

- Backend: `FastAPI`, `Pydantic`, `Uvicorn`
- Frontend: `React`, `Vite`, `TypeScript`
- Estilo: interfaz tipo terminal/hacker con ventanas separadas

## Estructura

```text
Portafolio_real/
|-- Backend/
|   |-- app/
|   |-- requirements.txt
|   `-- venv/
|-- Frontend/
|   |-- src/
|   |-- package.json
|   `-- vite.config.ts
`-- README.md
```

## Ejecutar en local

### 1. Backend

```powershell
cd Backend
.\venv\Scripts\activate
uvicorn app.main:app --reload
```

Backend disponible en:

```text
http://127.0.0.1:8000
```

### 2. Frontend

```powershell
cd Frontend
npm install
npm run dev
```

Frontend disponible en:

```text
http://127.0.0.1:5173
```

## Build de produccion

```powershell
cd Frontend
npm run build
```

## Endpoints principales

- `GET /` estado general de la API
- `GET /health` health check
- `GET /api/projects` lista de proyectos
- `POST /api/contact` recepcion del formulario de contacto

## Contenido del portafolio

- GitHub: `https://github.com/jorgeR1519`
- Blog HTB: `https://jorger1519.github.io/`
- Certificacion destacada: `eJPTv2 (2025)`

## Estado actual

- frontend validado con `tsc`, `lint` y `build`
- backend listo para exponer proyectos y contacto
- proyectos mostrados con iconos de tecnologias y paginacion
