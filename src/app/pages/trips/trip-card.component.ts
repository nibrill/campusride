import { CurrencyPipe, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { IonIcon } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { arrowForward, peopleOutline, personCircleOutline, timeOutline } from 'ionicons/icons';

import type { Trip } from '../../core/models';

@Component({
  selector: 'app-trip-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CurrencyPipe, DatePipe, IonIcon],
  template: `
    <article class="cr-card">
      <header class="route">
        <span>{{ trip().origin }}</span>
        <ion-icon name="arrow-forward" aria-hidden="true"></ion-icon>
        <span>{{ trip().destination }}</span>
      </header>
      <ul class="meta">
        <li>
          <ion-icon name="time-outline" aria-hidden="true"></ion-icon>
          {{ trip().departureAt | date: "EEEE d 'de' MMM, HH:mm" }}
        </li>
        <li>
          <ion-icon name="person-circle-outline" aria-hidden="true"></ion-icon>
          {{ trip().driverName }}
        </li>
        <li>
          <ion-icon name="people-outline" aria-hidden="true"></ion-icon>
          {{ seatsLeft() }} de {{ trip().seats }} asientos libres
        </li>
      </ul>
      <footer>
        <strong class="price">{{ trip().price | currency: 'CLP' : 'symbol-narrow' : '1.0-0' }}</strong>
        <ng-content />
      </footer>
    </article>
  `,
  styles: `
    .route {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 8px;
      font-weight: 700;
      font-size: 1.05rem;
    }
    .route ion-icon {
      color: var(--ion-color-primary);
    }
    .meta {
      list-style: none;
      margin: 12px 0;
      padding: 0;
      display: grid;
      gap: 6px;
      color: var(--cr-muted);
      font-size: 0.9rem;
    }
    .meta li {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
    }
    .price {
      font-size: 1.25rem;
      color: var(--ion-color-secondary);
    }
  `,
})
export class TripCardComponent {
  readonly trip = input.required<Trip>();
  readonly seatsLeft = computed(() => this.trip().seats - this.trip().passengers.length);

  constructor() {
    addIcons({ arrowForward, peopleOutline, personCircleOutline, timeOutline });
  }
}
