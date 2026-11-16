import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonButton,
  IonContent,
  IonIcon,
  IonInput,
  IonInputPasswordToggle,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonSpinner,
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { carSportOutline } from 'ionicons/icons';

import { AuthService } from '../../core/auth.service';
import type { Role } from '../../core/models';
import { UiService } from '../../core/ui.service';

type Mode = 'login' | 'register';

@Component({
  selector: 'app-login',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './login.page.html',
  styleUrl: './login.page.scss',
  imports: [
    ReactiveFormsModule,
    IonButton,
    IonContent,
    IonIcon,
    IonInput,
    IonInputPasswordToggle,
    IonLabel,
    IonSegment,
    IonSegmentButton,
    IonSpinner,
  ],
})
export class LoginPage {
  private readonly fb = inject(FormBuilder).nonNullable;
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly ui = inject(UiService);

  protected readonly mode = signal<Mode>('login');
  protected readonly busy = signal(false);
  protected readonly isDemo = this.auth.mode === 'demo';

  protected readonly form = this.fb.group({
    name: [''],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    role: ['passenger' as Role],
  });

  constructor() {
    addIcons({ carSportOutline });
  }

  protected setMode(mode: Mode): void {
    this.mode.set(mode);
    const name = this.form.controls.name;
    name.setValidators(mode === 'register' ? [Validators.required, Validators.minLength(2)] : []);
    name.updateValueAndValidity();
  }

  protected useDemo(email: string): void {
    this.setMode('login');
    this.form.patchValue({ email, password: 'demo1234' });
  }

  protected async submit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const { name, email, password, role } = this.form.getRawValue();
    this.busy.set(true);
    try {
      if (this.mode() === 'login') await this.auth.signIn(email, password);
      else await this.auth.signUp(name, email, password, role);
      await this.router.navigateByUrl('/app/viajes', { replaceUrl: true });
    } catch (e) {
      await this.ui.error(e);
    } finally {
      this.busy.set(false);
    }
  }

  protected async forgot(): Promise<void> {
    const email = this.form.controls.email;
    if (email.invalid) {
      email.markAsTouched();
      await this.ui.toast('Escribe tu correo para recuperar la contraseña.');
      return;
    }
    try {
      await this.auth.resetPassword(email.value);
      await this.ui.toast('Si el correo existe, recibirás un enlace para restablecerla.', 'success');
    } catch (e) {
      await this.ui.error(e);
    }
  }
}
