import { Backend } from './backend';
import type { NewTrip, Role, Trip, UserProfile } from './models';
import { AppError } from './models';

interface StoredUser extends UserProfile {
  passwordHash: string;
}

const KEYS = { users: 'campusride.users', trips: 'campusride.trips', session: 'campusride.session' };

async function hash(text: string): Promise<string> {
  const bytes = new TextEncoder().encode(text);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, '0')).join('');
}

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown): void {
  localStorage.setItem(key, JSON.stringify(value));
}

function inHours(hours: number): string {
  const d = new Date(Date.now() + hours * 3_600_000);
  d.setMinutes(Math.round(d.getMinutes() / 15) * 15, 0, 0);
  return d.toISOString();
}

function strip(user: StoredUser): UserProfile {
  return { uid: user.uid, name: user.name, email: user.email, role: user.role };
}

/** Modo demo: todo se guarda en localStorage, sin necesidad de servidor. */
export class LocalBackend extends Backend {
  readonly mode = 'demo' as const;
  private seeding?: Promise<void>;

  private seed(): Promise<void> {
    this.seeding ??= (async () => {
      if (read<StoredUser[]>(KEYS.users, []).length) return;
      const passwordHash = await hash('demo1234');
      write(KEYS.users, [
        { uid: 'u-driver', name: 'Camila Rojas', email: 'conductor@demo.cl', role: 'driver', passwordHash },
        { uid: 'u-pasajero', name: 'Diego Fuentes', email: 'pasajero@demo.cl', role: 'passenger', passwordHash },
      ] satisfies StoredUser[]);
      if (!read<Trip[]>(KEYS.trips, []).length) {
        write(KEYS.trips, [
          {
            id: 't1',
            driverId: 'u-driver',
            driverName: 'Camila Rojas',
            origin: 'Maipú',
            destination: 'Campus San Joaquín',
            departureAt: inHours(20),
            seats: 3,
            price: 1500,
            passengers: [],
          },
          {
            id: 't2',
            driverId: 'u-driver',
            driverName: 'Camila Rojas',
            origin: 'Campus San Joaquín',
            destination: 'Puente Alto',
            departureAt: inHours(28),
            seats: 4,
            price: 1800,
            passengers: [],
          },
          {
            id: 't3',
            driverId: 'u-other',
            driverName: 'Matías Soto',
            origin: 'Ñuñoa',
            destination: 'Campus Casa Central',
            departureAt: inHours(44),
            seats: 2,
            price: 1200,
            passengers: [],
          },
        ] satisfies Trip[]);
      }
    })();
    return this.seeding;
  }

  private users(): StoredUser[] {
    return read<StoredUser[]>(KEYS.users, []);
  }

  async restoreSession(): Promise<UserProfile | null> {
    await this.seed();
    const uid = read<string | null>(KEYS.session, null);
    const user = this.users().find((u) => u.uid === uid);
    return user ? strip(user) : null;
  }

  async signIn(email: string, password: string): Promise<UserProfile> {
    await this.seed();
    const user = this.users().find((u) => u.email === email.trim().toLowerCase());
    if (!user || user.passwordHash !== (await hash(password))) {
      throw new AppError('Correo o contraseña incorrectos.');
    }
    write(KEYS.session, user.uid);
    return strip(user);
  }

  async signUp(name: string, email: string, password: string, role: Role): Promise<UserProfile> {
    await this.seed();
    const normalized = email.trim().toLowerCase();
    const users = this.users();
    if (users.some((u) => u.email === normalized)) {
      throw new AppError('Ya existe una cuenta con ese correo.');
    }
    const user: StoredUser = {
      uid: crypto.randomUUID(),
      name: name.trim(),
      email: normalized,
      role,
      passwordHash: await hash(password),
    };
    write(KEYS.users, [...users, user]);
    write(KEYS.session, user.uid);
    return strip(user);
  }

  async signOut(): Promise<void> {
    localStorage.removeItem(KEYS.session);
  }

  async resetPassword(): Promise<void> {
    // En modo demo no se envían correos.
  }

  async updateRole(uid: string, role: Role): Promise<UserProfile> {
    const users = this.users();
    const user = users.find((u) => u.uid === uid);
    if (!user) throw new AppError('Usuario no encontrado.');
    user.role = role;
    write(KEYS.users, users);
    return strip(user);
  }

  async listTrips(): Promise<Trip[]> {
    await this.seed();
    return read<Trip[]>(KEYS.trips, []).sort((a, b) => a.departureAt.localeCompare(b.departureAt));
  }

  async createTrip(user: UserProfile, trip: NewTrip): Promise<void> {
    const trips = read<Trip[]>(KEYS.trips, []);
    trips.push({ ...trip, id: crypto.randomUUID(), driverId: user.uid, driverName: user.name, passengers: [] });
    write(KEYS.trips, trips);
  }

  async reserve(tripId: string, uid: string): Promise<void> {
    const trips = read<Trip[]>(KEYS.trips, []);
    const trip = trips.find((t) => t.id === tripId);
    if (!trip) throw new AppError('El viaje ya no existe.');
    if (trip.driverId === uid) throw new AppError('No puedes reservar tu propio viaje.');
    if (trip.passengers.includes(uid)) throw new AppError('Ya reservaste este viaje.');
    if (trip.passengers.length >= trip.seats) throw new AppError('No quedan asientos disponibles.');
    trip.passengers.push(uid);
    write(KEYS.trips, trips);
  }

  async cancelReservation(tripId: string, uid: string): Promise<void> {
    const trips = read<Trip[]>(KEYS.trips, []);
    const trip = trips.find((t) => t.id === tripId);
    if (trip) trip.passengers = trip.passengers.filter((p) => p !== uid);
    write(KEYS.trips, trips);
  }

  async deleteTrip(tripId: string): Promise<void> {
    write(
      KEYS.trips,
      read<Trip[]>(KEYS.trips, []).filter((t) => t.id !== tripId),
    );
  }
}
