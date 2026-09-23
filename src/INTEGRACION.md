# Integrar el módulo de Asistencias en tu dashboard

## 1. Copia los archivos
Copia `src/Asistencias.jsx` y `src/Asistencias.css` a la carpeta `src` de tu proyecto React.

## 2. Importa el módulo en tu `App.jsx`
Añade junto a los imports:
```jsx
import Asistencias from "./Asistencias";
```
Si tu archivo está en otra carpeta, ajusta la ruta.

## 3. Muestra el módulo cuando el menú Asistencias esté activo
En el contenido principal de tu dashboard, donde actualmente se renderiza siempre el dashboard, usa una condición. Conserva tu header y sidebar existentes:

```jsx
{active === "Asistencias" ? (
  <Asistencias />
) : (
  /* aquí deja el contenido actual del dashboard */
)}
```

El comentario debe sustituirse por el JSX actual que contiene los KPI, gráficas, alertas y resumen. No borres esos componentes.

## 4. PWA
Este módulo es una interfaz responsive que puede abrirse desde móvil. Para instalarla como PWA, el proyecto también necesita manifest, iconos, service worker y HTTPS en despliegue. Si tu proyecto usa Vite:

```bash
npm install -D vite-plugin-pwa
```

Después configura `VitePWA` en `vite.config.js` y enlaza el manifest. La configuración exacta depende de tu `vite.config.js` y `main.jsx` existentes; evita reemplazarlos sin revisar tu proyecto.

## 5. Limitaciones de este prototipo
- Usa datos ficticios y estado local React: al recargar se reinician.
- Los botones Validar/Rechazar solo actualizan el estado local.
- No hay autenticación real ni permisos de servidor.
- La ubicación es opcional y solo obtiene coordenadas del navegador; no prueba presencia ni se envía a servidor.
- El cálculo de horas usa datos de demostración; faltan reglas institucionales para turnos, pausas, tolerancias, correcciones y ausencias.
- No está conectado a tu dashboard KPI ni a una API todavía.

## 6. Siguiente etapa de backend
Una vez aprobado el flujo visual, diseñar endpoints y tablas. Ejemplo conceptual:
- `POST /api/attendance/check-in`
- `GET /api/attendance/my`
- `GET /api/attendance/pending` (supervisor)
- `PATCH /api/attendance/:id/validate`
- `PATCH /api/attendance/:id/reject`
- `GET /api/advisor/attendance-summary`

El backend debe obtener la identidad desde la sesión/token, validar asignaciones y permisos, evitar duplicados y registrar auditoría. No confiar en un `studentId` enviado libremente por el cliente.
