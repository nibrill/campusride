import type { FirebaseConfig } from '../app/core/models';

// Copia este valor en `firebase` dentro de environment.ts / environment.prod.ts
// con los datos de tu proyecto (Firebase Console → Configuración del proyecto).
export const firebase: FirebaseConfig = {
  apiKey: 'TU_API_KEY',
  authDomain: 'tu-proyecto.firebaseapp.com',
  projectId: 'tu-proyecto',
  appId: 'TU_APP_ID',
};
