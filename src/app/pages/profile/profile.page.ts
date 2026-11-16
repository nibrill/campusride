import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { IonButton, IonContent, IonHeader, IonLabel, IonSegment, IonSegmentButton, IonToolbar } from '@ionic/angular';

import { AuthService } from '../../core/auth.service';
import type { Role } from '../../core/models';
import { UiService } from '../../core/ui.service';

@Component({
  selector: 'app-profile',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IonButton, IonContent, IonHeader, IonLabel, IonSegment, IonSegmentButton, IonToolbar],
  template: `
    <ion-header [translucent]="true"><ion-toolbar></ion-toolbar></ion-header>
    <ion-content>
      <h1 class="page-title">Perfil</h1>
      @if (auth.user(); as user) {
        <section class="cr-card">
          <div class="avatar" aria-hidden="true">{{ user.name.charAt(0).toUpperCase() }}</div>
          <h2>{{ user.name }}</h2>
          <p class="mail">{{ user.email }}</p>
          <ion-segment [value]="user.role" (ionChange)="setRole($any($event).detail.value)">
            <ion-segment-button value="passenger"><ion-label>Pasajero</ion-label></ion-segment-button>
            <ion-segment-button value="driver"><ion-label>Conductor</ion-label></ion-segment-button>
          </ion-segment>
        </section>
      }
      @if (auth.mode === 'demo') {
        <p class="page-subtitle">Modo demo: tus datos se guardan solo en este navegador.</p>
      }
      <div class="actions">
        <ion-button color="danger" fill="outline" expand="block" (click)="logout()">Cerrar sesión</ion-button>
      </div>
    </ion-content>
  `,
  styles: `
    section {
      text-align: center;
    }
    .avatar {
      display: inline-grid;
      place-items: center;
      width: 72px;
      height: 72px;
      border-radius: 50%;
      color: #fff;
      font-size: 1.8rem;
      font-weight: 700;
      background: var(--cr-gradient);
    }
    h2 {
      margin: 12px 0 2px;
    }
    .mail {
      margin: 0 0 16px;
      color: var(--cr-muted);
    }
    .actions {
      margin: 16px;
    }
  `,
})
export class ProfilePage {
  protected readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly ui = inject(UiService);

  protected async setRole(role: Role): Promise<void> {
    if (role === this.auth.user()?.role) return;
    try {
      await this.auth.setRole(role);
      await this.ui.toast(role === 'driver' ? 'Ahora eres conductor' : 'Ahora eres pasajero', 'success');
    } catch (e) {
      await this.ui.error(e);
    }
  }

  protected async logout(): Promise<void> {
    await this.auth.signOut();
    await this.router.navigateByUrl('/login', { replaceUrl: true });
  }
}
