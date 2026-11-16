import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import {
  IonButton,
  IonContent,
  IonHeader,
  IonIcon,
  IonRefresher,
  IonRefresherContent,
  IonSearchbar,
  IonSpinner,
  IonToolbar,
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { carSportOutline } from 'ionicons/icons';

import { AuthService } from '../../core/auth.service';
import type { Trip } from '../../core/models';
import { TripsService } from '../../core/trips.service';
import { UiService } from '../../core/ui.service';

import { TripCardComponent } from './trip-card.component';

@Component({
  selector: 'app-trips',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './trips.page.html',
  imports: [
    IonButton,
    IonContent,
    IonHeader,
    IonIcon,
    IonRefresher,
    IonRefresherContent,
    IonSearchbar,
    IonSpinner,
    IonToolbar,
    TripCardComponent,
  ],
})
export class TripsPage {
  private readonly auth = inject(AuthService);
  private readonly tripsService = inject(TripsService);
  private readonly ui = inject(UiService);

  protected readonly query = signal('');
  protected readonly loading = this.tripsService.loading;
  protected readonly uid = computed(() => this.auth.user()?.uid ?? '');

  /** Viajes futuros que coinciden con la búsqueda. */
  protected readonly visible = computed(() => {
    const q = this.query().trim().toLowerCase();
    const now = Date.now() - 30 * 60_000;
    return this.tripsService
      .trips()
      .filter((t) => new Date(t.departureAt).getTime() >= now)
      .filter((t) => !q || `${t.origin} ${t.destination} ${t.driverName}`.toLowerCase().includes(q));
  });

  constructor() {
    addIcons({ carSportOutline });
  }

  ionViewWillEnter(): void {
    void this.tripsService.refresh();
  }

  protected status(t: Trip): 'mine' | 'booked' | 'full' | 'open' {
    if (t.driverId === this.uid()) return 'mine';
    if (t.passengers.includes(this.uid())) return 'booked';
    return t.passengers.length >= t.seats ? 'full' : 'open';
  }

  protected async refresh(event: CustomEvent): Promise<void> {
    await this.tripsService.refresh();
    await (event.target as HTMLIonRefresherElement).complete();
  }

  protected async reserve(trip: Trip): Promise<void> {
    try {
      await this.tripsService.reserve(trip.id, this.uid());
      await this.ui.toast('¡Asiento reservado!', 'success');
    } catch (e) {
      await this.ui.error(e);
    }
  }
}
