# Changelog

Todos los cambios relevantes de CampusRide. Formato basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/) y versionado [SemVer](https://semver.org/lang/es/).

## [1.2.0] - 2026-11-16

### Added
- Pruebas end-to-end con Playwright (login, reservas, publicación, búsqueda y mapa), ejecutadas en el CI.

### Changed
- Rediseño visual: paleta de una sola tinta, tipografía Inter empaquetada, línea de tiempo de ruta en las tarjetas y login en dos columnas.

## [1.1.0] - 2026-11-16

### Added
- Mapa de la ruta de cada viaje con Leaflet y OpenStreetMap (sin API key).
- PWA instalable con service worker y manifiesto.

## [1.0.0] - 2026-11-16

### Added
- Registro e inicio de sesión con roles de pasajero y conductor.
- Publicación, búsqueda, reserva y cancelación de viajes con control de cupo.
- Modo demo local y backend opcional con Firebase Auth y Firestore, con reglas de seguridad.
- Demo en GitHub Pages, CI y plantilla de repositorio.
