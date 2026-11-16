import type { Auth } from 'firebase/auth';
import type { Firestore } from 'firebase/firestore';

import { Backend } from './backend';
import type { FirebaseConfig, NewTrip, Role, Trip, UserProfile } from './models';
import { AppError } from './models';

const AUTH_ERRORS: Record<string, string> = {
  'auth/invalid-credential': 'Correo o contraseña incorrectos.',
  'auth/user-not-found': 'Correo o contraseña incorrectos.',
  'auth/wrong-password': 'Correo o contraseña incorrectos.',
  'auth/email-already-in-use': 'Ya existe una cuenta con ese correo.',
  'auth/weak-password': 'La contraseña debe tener al menos 6 caracteres.',
  'auth/too-many-requests': 'Demasiados intentos. Inténtalo más tarde.',
};

function toAppError(e: unknown): AppError {
  if (e instanceof AppError) return e;
  const code = (e as { code?: string }).code ?? '';
  return new AppError(AUTH_ERRORS[code] ?? 'Ocurrió un error inesperado. Inténtalo nuevamente.');
}

/** Implementación con Firebase Authentication + Cloud Firestore (el SDK se carga bajo demanda). */
export class FirebaseBackend extends Backend {
  readonly mode = 'firebase' as const;
  private sdk?: Promise<{ auth: Auth; db: Firestore }>;

  constructor(private readonly config: FirebaseConfig) {
    super();
  }

  private init() {
    this.sdk ??= (async () => {
      const [{ initializeApp }, { getAuth }, { getFirestore }] = await Promise.all([
        import('firebase/app'),
        import('firebase/auth'),
        import('firebase/firestore'),
      ]);
      const app = initializeApp(this.config);
      return { auth: getAuth(app), db: getFirestore(app) };
    })();
    return this.sdk;
  }

  private async profile(uid: string): Promise<UserProfile> {
    const { db } = await this.init();
    const { doc, getDoc } = await import('firebase/firestore');
    const snap = await getDoc(doc(db, 'users', uid));
    if (!snap.exists()) throw new AppError('Perfil no encontrado.');
    return { ...(snap.data() as Omit<UserProfile, 'uid'>), uid };
  }

  async restoreSession(): Promise<UserProfile | null> {
    const { auth } = await this.init();
    await auth.authStateReady();
    return auth.currentUser ? this.profile(auth.currentUser.uid) : null;
  }

  async signIn(email: string, password: string): Promise<UserProfile> {
    try {
      const { auth } = await this.init();
      const { signInWithEmailAndPassword } = await import('firebase/auth');
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      return await this.profile(user.uid);
    } catch (e) {
      throw toAppError(e);
    }
  }

  async signUp(name: string, email: string, password: string, role: Role): Promise<UserProfile> {
    try {
      const { auth, db } = await this.init();
      const { createUserWithEmailAndPassword } = await import('firebase/auth');
      const { doc, setDoc } = await import('firebase/firestore');
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      const data = { name: name.trim(), email: email.trim().toLowerCase(), role };
      await setDoc(doc(db, 'users', user.uid), data);
      return { uid: user.uid, ...data };
    } catch (e) {
      throw toAppError(e);
    }
  }

  async signOut(): Promise<void> {
    const { auth } = await this.init();
    await auth.signOut();
  }

  async resetPassword(email: string): Promise<void> {
    try {
      const { auth } = await this.init();
      const { sendPasswordResetEmail } = await import('firebase/auth');
      await sendPasswordResetEmail(auth, email);
    } catch (e) {
      throw toAppError(e);
    }
  }

  async updateRole(uid: string, role: Role): Promise<UserProfile> {
    const { db } = await this.init();
    const { doc, updateDoc } = await import('firebase/firestore');
    await updateDoc(doc(db, 'users', uid), { role });
    return this.profile(uid);
  }

  async listTrips(): Promise<Trip[]> {
    const { db } = await this.init();
    const { collection, getDocs, orderBy, query } = await import('firebase/firestore');
    const snap = await getDocs(query(collection(db, 'trips'), orderBy('departureAt')));
    return snap.docs.map((d) => ({ ...(d.data() as Omit<Trip, 'id'>), id: d.id }));
  }

  async createTrip(user: UserProfile, trip: NewTrip): Promise<void> {
    const { db } = await this.init();
    const { addDoc, collection } = await import('firebase/firestore');
    await addDoc(collection(db, 'trips'), {
      ...trip,
      driverId: user.uid,
      driverName: user.name,
      passengers: [],
    });
  }

  async reserve(tripId: string, uid: string): Promise<void> {
    const { db } = await this.init();
    const { doc, runTransaction } = await import('firebase/firestore');
    const ref = doc(db, 'trips', tripId);
    await runTransaction(db, async (tx) => {
      const snap = await tx.get(ref);
      if (!snap.exists()) throw new AppError('El viaje ya no existe.');
      const trip = snap.data() as Trip;
      if (trip.driverId === uid) throw new AppError('No puedes reservar tu propio viaje.');
      if (trip.passengers.includes(uid)) throw new AppError('Ya reservaste este viaje.');
      if (trip.passengers.length >= trip.seats) throw new AppError('No quedan asientos disponibles.');
      tx.update(ref, { passengers: [...trip.passengers, uid] });
    });
  }

  async cancelReservation(tripId: string, uid: string): Promise<void> {
    const { db } = await this.init();
    const { arrayRemove, doc, updateDoc } = await import('firebase/firestore');
    await updateDoc(doc(db, 'trips', tripId), { passengers: arrayRemove(uid) });
  }

  async deleteTrip(tripId: string): Promise<void> {
    const { db } = await this.init();
    const { deleteDoc, doc } = await import('firebase/firestore');
    await deleteDoc(doc(db, 'trips', tripId));
  }
}
