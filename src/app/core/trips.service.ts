import { Injectable, inject, signal } from '@angular/core';

import { Backend } from './backend';
import type { NewTrip, Trip, UserProfile } from './models';

@Injectable({ providedIn: 'root' })
export class TripsService {
  private readonly backend = inject(Backend);
  private readonly _trips = signal<Trip[]>([]);
  private readonly _loading = signal(false);

  readonly trips = this._trips.asReadonly();
  readonly loading = this._loading.asReadonly();

  async refresh(): Promise<void> {
    this._loading.set(true);
    try {
      this._trips.set(await this.backend.listTrips());
    } finally {
      this._loading.set(false);
    }
  }

  async create(user: UserProfile, trip: NewTrip): Promise<void> {
    await this.backend.createTrip(user, trip);
    await this.refresh();
  }

  async reserve(tripId: string, uid: string): Promise<void> {
    await this.backend.reserve(tripId, uid);
    await this.refresh();
  }

  async cancelReservation(tripId: string, uid: string): Promise<void> {
    await this.backend.cancelReservation(tripId, uid);
    await this.refresh();
  }

  async remove(tripId: string): Promise<void> {
    await this.backend.deleteTrip(tripId);
    await this.refresh();
  }
}
