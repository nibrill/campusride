import { Injectable, computed, inject, signal } from '@angular/core';

import { Backend } from './backend';
import type { Role, UserProfile } from './models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly backend = inject(Backend);
  private readonly _user = signal<UserProfile | null>(null);
  private ready?: Promise<void>;

  readonly user = this._user.asReadonly();
  readonly isLoggedIn = computed(() => this._user() !== null);
  readonly mode = this.backend.mode;

  /** Restaura la sesión una sola vez al iniciar la app. */
  init(): Promise<void> {
    this.ready ??= this.backend.restoreSession().then((u) => this._user.set(u));
    return this.ready;
  }

  async signIn(email: string, password: string): Promise<void> {
    this._user.set(await this.backend.signIn(email, password));
  }

  async signUp(name: string, email: string, password: string, role: Role): Promise<void> {
    this._user.set(await this.backend.signUp(name, email, password, role));
  }

  async signOut(): Promise<void> {
    await this.backend.signOut();
    this._user.set(null);
  }

  resetPassword(email: string): Promise<void> {
    return this.backend.resetPassword(email);
  }

  async setRole(role: Role): Promise<void> {
    const current = this._user();
    if (current) this._user.set(await this.backend.updateRole(current.uid, role));
  }
}
