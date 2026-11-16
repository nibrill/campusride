import type { Routes } from '@angular/router';

import { authGuard, guestGuard } from './core/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () => import('./pages/login/login.page').then((m) => m.LoginPage),
  },
  {
    path: 'app',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/tabs/tabs.page').then((m) => m.TabsPage),
    children: [
      {
        path: 'viajes',
        loadComponent: () => import('./pages/trips/trips.page').then((m) => m.TripsPage),
      },
      {
        path: 'viajes/:id',
        loadComponent: () => import('./pages/trip-map/trip-map.page').then((m) => m.TripMapPage),
      },
      {
        path: 'publicar',
        loadComponent: () => import('./pages/publish/publish.page').then((m) => m.PublishPage),
      },
      {
        path: 'mis-viajes',
        loadComponent: () => import('./pages/mine/mine.page').then((m) => m.MinePage),
      },
      {
        path: 'perfil',
        loadComponent: () => import('./pages/profile/profile.page').then((m) => m.ProfilePage),
      },
      { path: '', redirectTo: 'viajes', pathMatch: 'full' },
    ],
  },
  { path: '', redirectTo: 'app', pathMatch: 'full' },
  { path: '**', redirectTo: 'app' },
];
