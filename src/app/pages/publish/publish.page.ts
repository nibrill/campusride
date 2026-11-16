import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonButton,
  IonContent,
  IonDatetime,
  IonHeader,
  IonIcon,
  IonInput,
  IonSpinner,
  IonToolbar,
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { carSportOutline } from 'ionicons/icons';

import { AuthService } from '../../core/auth.service';
import { TripsService } from '../../core/trips.service';
import { UiService } from '../../core/ui.service';

/** Valor `YYYY-MM-DDTHH:mm` (hora local) para el selector de fecha. */
function localIso(offsetMinutes: number): string {
  const d = new Date(Date.now() + offsetMinutes * 60_000);
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 16);
}

@Component({
  selector: 'app-publish',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './publish.page.html',
  imports: [
    ReactiveFormsModule,
    IonButton,
    IonContent,
    IonDatetime,
    IonHeader,
    IonIcon,
    IonInput,
    IonSpinner,
    IonToolbar,
  ],
})
export class PublishPage {
  private readonly fb = inject(FormBuilder).nonNullable;
  private readonly auth = inject(AuthService);
  private readonly trips = inject(TripsService);
  private readonly router = inject(Router);
  private readonly ui = inject(UiService);

  protected readonly isDriver = computed(() => this.auth.user()?.role === 'driver');
  protected readonly busy = signal(false);
  protected readonly min = localIso(0);

  protected readonly form = this.fb.group({
    origin: ['', [Validators.required, Validators.minLength(3)]],
    destination: ['', [Validators.required, Validators.minLength(3)]],
    departureAt: [localIso(60), Validators.required],
    seats: [3, [Validators.required, Validators.min(1), Validators.max(8)]],
    price: [1500, [Validators.required, Validators.min(0), Validators.max(50000)]],
  });

  constructor() {
    addIcons({ carSportOutline });
  }

  protected async becomeDriver(): Promise<void> {
    try {
      await this.auth.setRole('driver');
    } catch (e) {
      await this.ui.error(e);
    }
  }

  protected async submit(): Promise<void> {
    const user = this.auth.user();
    if (!user || this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const v = this.form.getRawValue();
    this.busy.set(true);
    try {
      await this.trips.create(user, {
        origin: v.origin.trim(),
        destination: v.destination.trim(),
        departureAt: new Date(v.departureAt).toISOString(),
        seats: Number(v.seats),
        price: Number(v.price),
      });
      await this.ui.toast('Viaje publicado', 'success');
      this.form.patchValue({ origin: '', destination: '' });
      this.form.markAsUntouched();
      await this.router.navigateByUrl('/app/mis-viajes');
    } catch (e) {
      await this.ui.error(e);
    } finally {
      this.busy.set(false);
    }
  }
}
