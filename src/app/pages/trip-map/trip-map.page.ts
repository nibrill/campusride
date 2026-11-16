import { DecimalPipe } from '@angular/common';
import type { ElementRef } from '@angular/core';
import { ChangeDetectionStrategy, Component, computed, effect, inject, input, viewChild } from '@angular/core';
import { IonBackButton, IonButtons, IonContent, IonHeader, IonToolbar } from '@ionic/angular';
import type { Map as LeafletMap } from 'leaflet';

import { distanceKm, findPlace } from '../../core/places';
import { TripsService } from '../../core/trips.service';
import { TripCardComponent } from '../trips/trip-card.component';

@Component({
  selector: 'app-trip-map',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DecimalPipe, IonBackButton, IonButtons, IonContent, IonHeader, IonToolbar, TripCardComponent],
  template: `
    <ion-header class="ion-no-border">
      <ion-toolbar>
        <ion-buttons slot="start"
          ><ion-back-button defaultHref="/app/viajes" text="Viajes"></ion-back-button
        ></ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <h1 class="page-title">Ruta del viaje</h1>
      @if (trip(); as t) {
        @if (route(); as r) {
          <p class="page-subtitle">
            Aprox. {{ r.km | number: '1.0-1' }} km en línea recta · ubicaciones referenciales.
          </p>
        } @else {
          <p class="page-subtitle">No reconocemos el origen o el destino, así que no podemos dibujar la ruta.</p>
        }
        <div
          #map
          class="map"
          [hidden]="!route()"
          role="img"
          [attr.aria-label]="'Mapa de ' + t.origin + ' a ' + t.destination"
        ></div>
        <app-trip-card [trip]="t" [showMapLink]="false" />
      } @else {
        <p class="page-subtitle">No encontramos este viaje.</p>
      }
    </ion-content>
  `,
  styles: `
    .map {
      height: 320px;
      margin: 0 16px;
      border-radius: 18px;
      border: 1px solid var(--cr-border);
      overflow: hidden;
      z-index: 0;
    }
  `,
})
export class TripMapPage {
  /** Parámetro de ruta `:id`. */
  readonly id = input.required<string>();

  private readonly trips = inject(TripsService);
  private readonly mapEl = viewChild<ElementRef<HTMLDivElement>>('map');
  private map?: LeafletMap;

  protected readonly trip = computed(() => this.trips.trips().find((t) => t.id === this.id()) ?? null);
  protected readonly route = computed(() => {
    const t = this.trip();
    const from = t && findPlace(t.origin);
    const to = t && findPlace(t.destination);
    return from && to ? { from, to, km: distanceKm(from, to) } : null;
  });

  constructor() {
    if (!this.trips.trips().length) void this.trips.refresh();
    effect(() => {
      const el = this.mapEl()?.nativeElement;
      const r = this.route();
      if (el && r) void this.draw(el, r);
    });
  }

  private async draw(el: HTMLDivElement, r: NonNullable<ReturnType<typeof this.route>>): Promise<void> {
    // Leaflet es CommonJS: según el empaquetador, la API llega en `default` o en el módulo mismo.
    const mod = await import('leaflet');
    const L = mod.default ?? mod;
    this.map?.remove();
    const map = L.map(el, { zoomControl: false, attributionControl: true });
    this.map = map;
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);
    const from: [number, number] = [r.from.lat, r.from.lng];
    const to: [number, number] = [r.to.lat, r.to.lng];
    L.polyline([from, to], { color: '#4f46e5', weight: 4, dashArray: '8 8' }).addTo(map);
    const dot = { radius: 9, weight: 3, color: '#fff', fillOpacity: 1 };
    L.circleMarker(from, { ...dot, fillColor: '#4f46e5' })
      .addTo(map)
      .bindTooltip(`Origen: ${r.from.name}`);
    L.circleMarker(to, { ...dot, fillColor: '#0d9488' })
      .addTo(map)
      .bindTooltip(`Destino: ${r.to.name}`);
    map.fitBounds([from, to], { padding: [40, 40] });
    // El contenedor cambia de tamaño al terminar la transición de página de Ionic.
    setTimeout(() => map.invalidateSize(), 350);
  }
}
