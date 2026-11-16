export type Role = 'passenger' | 'driver';

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  role: Role;
}

export interface Trip {
  id: string;
  driverId: string;
  driverName: string;
  origin: string;
  destination: string;
  /** Fecha y hora de salida en formato ISO 8601. */
  departureAt: string;
  seats: number;
  /** Precio por asiento en CLP. */
  price: number;
  /** UIDs de los pasajeros con reserva. */
  passengers: string[];
}

export type NewTrip = Pick<Trip, 'origin' | 'destination' | 'departureAt' | 'seats' | 'price'>;

export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  appId: string;
  storageBucket?: string;
  messagingSenderId?: string;
}

export class AppError extends Error {}
