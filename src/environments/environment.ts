import type { FirebaseConfig } from '../app/core/models';

/**
 * Si `firebase` es `undefined`, la app corre en modo demo (datos locales en el navegador).
 * Para usar Firebase, completa tus credenciales (ver `environment.example.ts`).
 */
export const environment: { production: boolean; firebase?: FirebaseConfig } = {
  production: false,
  firebase: undefined,
};
