import type { FirebaseConfig } from '../app/core/models';

export const environment: { production: boolean; firebase?: FirebaseConfig } = {
  production: true,
  firebase: undefined,
};
