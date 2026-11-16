import { Injectable, inject } from '@angular/core';
import { ToastController } from '@ionic/angular';

import { AppError } from './models';

@Injectable({ providedIn: 'root' })
export class UiService {
  private readonly toasts = inject(ToastController);

  async toast(message: string, color: 'success' | 'danger' | 'medium' = 'medium'): Promise<void> {
    const t = await this.toasts.create({ message, color, duration: 2600, position: 'top' });
    await t.present();
  }

  /** Muestra un error legible sin exponer detalles técnicos. */
  async error(e: unknown): Promise<void> {
    await this.toast(e instanceof AppError ? e.message : 'Ocurrió un error inesperado.', 'danger');
  }
}
