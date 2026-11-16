import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import {
  IonButton,
  IonContent,
  IonHeader,
  IonIcon,
  IonLabel,
  IonSegment,
  IonSegmentButton,
  IonToolbar,
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { listOutline } from 'ionicons/icons';

import { AuthService } from '../../core/auth.service';
import type { Trip } from '../../core/models';
import { TripsService } from '../../core/trips.service';
import { UiService } from '../../core/ui.service';
import { TripCardComponent } from '../trips/trip-card.component';

type View = 'booked' | 'published';

@Component({
  selector: 'app-mine',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './mine.page.html',
  imports: [
    IonButton,
    IonContent,
    IonHeader,
    IonIcon,
    IonLabel,
    IonSegment,
    IonSegmentButton,
    IonToolbar,
    TripCardComponent,
  ],
})
export class MinePage {
  private readonly auth = inject(AuthService);
  private readonly tripsService = inject(TripsService);
  private readonly ui = inject(UiService);

  protected readonly view = signal<View>('booked');
  private readonly uid = computed(() => this.auth.user()?.uid ?? '');

  protected readonly booked = computed(() =>
    this.tripsService.trips().filter((t) => t.passengers.includes(this.uid())),
  );
  protected readonly published = computed(() => this.tripsService.trips().filter((t) => t.driverId === this.uid()));
  protected readonly list = computed(() => (this.view() === 'booked' ? this.booked() : this.published()));

  constructor() {
    addIcons({ listOutline });
  }

  ionViewWillEnter(): void {
    void this.tripsService.refresh();
  }

  protected async cancel(trip: Trip): Promise<void> {
    try {
      await this.tripsService.cancelReservation(trip.id, this.uid());
      await this.ui.toast('Reserva cancelada');
    } catch (e) {
      await this.ui.error(e);
    }
  }

  protected async remove(trip: Trip): Promise<void> {
    try {
      await this.tripsService.remove(trip.id);
      await this.ui.toast('Viaje eliminado');
    } catch (e) {
      await this.ui.error(e);
    }
  }
}
