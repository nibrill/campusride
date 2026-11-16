import { distanceKm, findPlace } from './places';

describe('places', () => {
  it('encuentra lugares sin importar tildes ni mayúsculas', () => {
    expect(findPlace('maipu')?.name).toBe('Maipú');
    expect(findPlace('  ÑUÑOA ')?.name).toBe('Ñuñoa');
  });

  it('prefiere el nombre más específico', () => {
    expect(findPlace('Campus San Joaquín, entrada norte')?.name).toBe('Campus San Joaquín');
    expect(findPlace('San Joaquín')?.name).toBe('San Joaquín');
  });

  it('devuelve null si no reconoce el lugar', () => {
    expect(findPlace('Valparaíso')).toBeNull();
    expect(findPlace('a')).toBeNull();
  });

  it('calcula una distancia razonable', () => {
    const km = distanceKm(findPlace('Maipú')!, findPlace('Las Condes')!);
    expect(km).toBeGreaterThan(15);
    expect(km).toBeLessThan(25);
  });
});
