<div align="center">

# 🚗 CampusRide

**Viajes compartidos entre estudiantes universitarios · Carpooling for university students**

![Ionic](https://img.shields.io/badge/Ionic-9-3880ff?logo=ionic&logoColor=white)
![Angular](https://img.shields.io/badge/Angular-22-dd0031?logo=angular&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-opcional-ffca28?logo=firebase&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178c6?logo=typescript&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-green)

[🇪🇸 Español](#-español) · [🇬🇧 English](#-english)

</div>

---

## 🇪🇸 Español

CampusRide conecta a conductores y pasajeros que comparten trayecto hacia el campus. Los conductores publican viajes con origen, destino, horario, cupos y precio; los pasajeros buscan y reservan asiento en segundos.

> Proyecto universitario rediseñado desde cero (antes *TelLevoApp*): nueva arquitectura, interfaz moderna y backend intercambiable.

### ✨ Características

- Registro e inicio de sesión con validaciones y recuperación de contraseña.
- Roles **pasajero** y **conductor**, intercambiables desde el perfil.
- Publicación de viajes con selector de fecha/hora, cupos y precio en CLP.
- Búsqueda en vivo, reservas y cancelaciones con control de cupo (sin sobrerreservas).
- Pestaña «Mis viajes» para ver reservas y viajes publicados.
- Modo claro/oscuro automático y diseño *mobile-first*.
- **Modo demo** sin configuración: los datos viven en el navegador. Con credenciales, usa **Firebase Auth + Firestore**.

### 🧱 Arquitectura

```
src/app
├── core/            # Modelos, servicios, guards y backends
│   ├── backend.ts           # Contrato abstracto
│   ├── local.backend.ts     # Modo demo (localStorage)
│   └── firebase.backend.ts  # Firebase Auth + Firestore (carga perezosa)
└── pages/           # login · tabs · trips · publish · mine · profile
```

Angular 22 con componentes *standalone*, *signals*, `OnPush`, control de flujo `@if/@for`, rutas con *lazy loading* y TypeScript estricto. El SDK de Firebase solo se descarga si lo configuras.

### 🚀 Inicio rápido

```bash
git clone https://github.com/nibrill/campusride.git
cd campusride
npm install
npm start
```

Abre `http://localhost:4200` y usa las cuentas de ejemplo (`pasajero@demo.cl` / `conductor@demo.cl`, contraseña `demo1234`).

### 🔥 Usar Firebase (opcional)

1. Crea un proyecto en [Firebase Console](https://console.firebase.google.com), activa **Authentication (correo/contraseña)** y **Firestore**.
2. Completa `firebase` en `src/environments/environment.ts` siguiendo `environment.example.ts`.
3. Publica las reglas de seguridad incluidas:

```bash
npx firebase-tools deploy --only firestore:rules
```

> Las claves web de Firebase no son secretos, pero no las compartas con reglas abiertas. Las reglas de este repo restringen cada operación al usuario autenticado.

### 📱 App móvil (Android / iOS)

```bash
npm run build
npx cap add android
npx cap sync && npx cap open android
```

### 🛠 Scripts

| Comando | Descripción |
| --- | --- |
| `npm start` | Servidor de desarrollo |
| `npm run build` | Compilación de producción |
| `npm test` | Pruebas unitarias (Vitest) |
| `npm run lint` | ESLint |

### 🗺 Próximos pasos

Mapa con rutas, notificaciones push, calificaciones de conductores y chat entre pasajeros.

---

## 🇬🇧 English

CampusRide connects drivers and riders who share a commute to campus. Drivers publish trips (origin, destination, time, seats, price); riders search and book a seat in seconds.

> A university project rebuilt from scratch (formerly *TelLevoApp*) with a clean architecture, a modern UI and a swappable backend.

### ✨ Features

- Sign up / sign in with validation and password reset.
- **Passenger** and **driver** roles, switchable from the profile.
- Trip publishing with date/time picker, seat count and price (CLP).
- Live search, bookings and cancellations with seat-capacity checks.
- "My trips" tab for bookings and published trips.
- Automatic light/dark theme, mobile-first design.
- **Zero-config demo mode** (data stored in the browser); plug in credentials to use **Firebase Auth + Firestore**.

### 🚀 Quick start

```bash
git clone https://github.com/nibrill/campusride.git
cd campusride
npm install
npm start
```

Sign in with the demo accounts (`pasajero@demo.cl` / `conductor@demo.cl`, password `demo1234`).

### 🔥 Firebase (optional)

Fill in the `firebase` block in `src/environments/environment.ts` (see `environment.example.ts`) and deploy the included Firestore rules with `npx firebase-tools deploy --only firestore:rules`.

### 📄 License

[MIT](LICENSE) © Nicolás Brill
