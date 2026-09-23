# Dashboard de prácticas profesionales

Proyecto React + Vite para un dashboard institucional con módulo de asistencias integrado al menú principal.

## Estado del proyecto

- Dashboard principal con KPI, gráficos, alertas y resumen.
- Navegación lateral con la opción Asistencias.
- Módulo de asistencias funcional en modo prototipo para estudiante, supervisor y asesor académico.
- Datos localizados en estado React, sin backend ni persistencia real.

## Estructura relevante

- `src/App.jsx`: dashboard principal y activación del módulo según el menú.
- `src/Asistencias.jsx`: interfaz de asistencias con flujo RF1–RF3.
- `src/Asistencias.css`: estilos del módulo.
- `src/INTEGRACION.md`: guía de integración y limitaciones del prototipo.

## Cómo ejecutar

```bash
npm install
npm run dev
```

## Nota importante

Este repositorio es un prototipo frontend académico. Para pasar a producción, se requiere backend, autenticación, base de datos, servicio de geolocalización y configuración PWA real.
