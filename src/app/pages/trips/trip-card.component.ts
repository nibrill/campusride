import { CurrencyPipe, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonIcon } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { arrowForward, mapOutline, peopleOutline, personCircleOutline, timeOutline } from 'ionicons/icons';

import type { Trip } from '../../core/models';

@Component({
  selector: 'app-trip-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CurrencyPipe, DatePipe, IonIcon, RouterLink],
  template: `
    <article class="cr-card">
      <ol class="route" aria-label="Ruta">
        <li>{{ trip().origin }}</li>
        <li>{{ trip().destination }}</li>
      </ol>
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
        @if (showMapLink()) {
          <li>
            <ion-icon name="map-outline" aria-hidden="true"></ion-icon>
            <a [routerLink]="['/app/viajes', trip().id]">Ver ruta en el mapa</a>
          </li>
        }
      </ul>
      <footer>
        <strong class="price">{{ trip().price | currency: 'CLP' : 'symbol-narrow' : '1.0-0' }}</strong>
        <ng-content />
      </footer>
    </article>
  `,
  styles: `
    .route {
      list-style: none;
      margin: 0;
      padding: 0;
      font-weight: 600;
      font-size: 1rem;
    }
    .route li {
      position: relative;
      padding: 0 0 14px 24px;
    }
    .route li:last-child {
      padding-bottom: 0;
    }
    .route li::before {
      content: '';
      position: absolute;
      left: 2px;
      top: 5px;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      border: 2px solid var(--ion-color-primary);
      background: var(--ion-color-primary);
    }
    .route li:last-child::before {
      background: var(--cr-surface);
    }
    .route li:first-child::after {
      content: '';
      position: absolute;
      left: 6px;
      top: 17px;
      bottom: -3px;
      border-left: 2px solid var(--cr-border);
    }
    .meta {
      list-style: none;
      margin: 16px 0 14px;
      padding: 14px 0 0;
      border-top: 1px solid var(--cr-border);
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
    .meta a {
      color: var(--ion-color-primary);
      font-weight: 600;
      text-decoration: none;
    }
    footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
    }
    .price {
      font-size: 1.25rem;
      color: var(--cr-text);
      font-weight: 650;
    }
  `,
})
export class TripCardComponent {
  readonly trip = input.required<Trip>();
  readonly showMapLink = input(true);
  readonly seatsLeft = computed(() => this.trip().seats - this.trip().passengers.length);

  constructor() {
    addIcons({ arrowForward, mapOutline, peopleOutline, personCircleOutline, timeOutline });
  }
}
