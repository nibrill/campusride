import type { NewTrip, Role, Trip, UserProfile } from './models';

/** Contrato que implementan el modo demo (local) y Firebase. */
export abstract class Backend {
  abstract readonly mode: 'demo' | 'firebase';
  abstract restoreSession(): Promise<UserProfile | null>;
  abstract signIn(email: string, password: string): Promise<UserProfile>;
  abstract signUp(name: string, email: string, password: string, role: Role): Promise<UserProfile>;
  abstract signOut(): Promise<void>;
  abstract resetPassword(email: string): Promise<void>;
  abstract updateRole(uid: string, role: Role): Promise<UserProfile>;
  abstract listTrips(): Promise<Trip[]>;
  abstract createTrip(user: UserProfile, trip: NewTrip): Promise<void>;
  abstract reserve(tripId: string, uid: string): Promise<void>;
  abstract cancelReservation(tripId: string, uid: string): Promise<void>;
  abstract deleteTrip(tripId: string): Promise<void>;
}
