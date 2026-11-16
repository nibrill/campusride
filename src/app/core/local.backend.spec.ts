import { LocalBackend } from './local.backend';
import { AppError } from './models';

describe('LocalBackend', () => {
  let backend: LocalBackend;

  beforeEach(() => {
    localStorage.clear();
    backend = new LocalBackend();
  });

  it('inicia sesión con la cuenta demo', async () => {
    const user = await backend.signIn('conductor@demo.cl', 'demo1234');
    expect(user.role).toBe('driver');
  });

  it('rechaza credenciales inválidas', async () => {
    await expect(backend.signIn('conductor@demo.cl', 'incorrecta')).rejects.toBeInstanceOf(AppError);
  });

  it('no permite correos duplicados', async () => {
    await backend.signUp('Ana', 'ana@uni.cl', 'secreto1', 'passenger');
    await expect(backend.signUp('Ana 2', 'ANA@uni.cl', 'secreto1', 'passenger')).rejects.toBeInstanceOf(AppError);
  });

  it('reserva y cancela asientos respetando el cupo', async () => {
    const [trip] = await backend.listTrips();
    await backend.reserve(trip.id, 'a');
    await expect(backend.reserve(trip.id, 'a')).rejects.toBeInstanceOf(AppError);
    await backend.cancelReservation(trip.id, 'a');
    const refreshed = (await backend.listTrips()).find((t) => t.id === trip.id);
    expect(refreshed?.passengers).toEqual([]);
  });

  it('impide reservar el propio viaje', async () => {
    const trip = (await backend.listTrips()).find((t) => t.driverId === 'u-driver');
    await expect(backend.reserve(trip!.id, 'u-driver')).rejects.toBeInstanceOf(AppError);
  });
});
