import { expect, test } from '@playwright/test';

/** Flujo completo en modo demo: ingresar, reservar, cancelar y publicar un viaje. */

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  // Estado limpio del modo demo en cada test.
  await page.evaluate(() => localStorage.clear());
  await page.reload();
});

async function login(page: import('@playwright/test').Page, email: string) {
  await page.getByLabel('Correo').fill(email);
  await page.getByLabel('Contraseña').fill('demo1234');
  await page.getByRole('button', { name: 'Ingresar', exact: true }).click();
  await expect(page).toHaveURL(/\/app\/viajes/);
}

test('un pasajero reserva un viaje y luego cancela la reserva', async ({ page }) => {
  await login(page, 'pasajero@demo.cl');
  await expect(page.getByRole('heading', { name: 'Viajes disponibles' })).toBeVisible();

  const card = page.locator('app-trip-card', { hasText: 'Ñuñoa' });
  await card.getByRole('button', { name: 'Reservar' }).click();
  await expect(page.getByText('¡Asiento reservado!')).toBeVisible();
  await expect(card.getByRole('button', { name: 'Reservado' })).toBeDisabled();

  await page.getByRole('tab', { name: 'Mis viajes' }).click();
  await expect(page.getByText('Reservados (1)')).toBeVisible();
  await page.getByRole('button', { name: 'Cancelar' }).click();
  await expect(page.getByText('Reserva cancelada')).toBeVisible();
  await expect(page.getByText('Reservados (0)')).toBeVisible();
});

test('un conductor publica un viaje y aparece en el listado', async ({ page }) => {
  await login(page, 'conductor@demo.cl');
  await page.getByRole('tab', { name: 'Publicar' }).click();

  await page.getByLabel('Origen').fill('La Florida');
  await page.getByLabel('Destino').fill('Campus Casa Central');
  await page.getByLabel('Asientos disponibles (1-8)').fill('2');
  await page.getByLabel('Precio por asiento (CLP)').fill('2000');
  await page.getByRole('button', { name: 'Publicar viaje' }).click();

  await expect(page).toHaveURL(/\/app\/mis-viajes/);
  // El toast de confirmación se muestra arriba y taparía el segmento.
  await expect(page.getByText('Viaje publicado')).toBeHidden();
  await page.getByRole('tab', { name: 'Publicados (3)' }).dispatchEvent('click');
  await expect(page.locator('app-trip-card', { hasText: 'La Florida' })).toBeVisible();
});

test('la búsqueda filtra y el mapa muestra la ruta', async ({ page }) => {
  await login(page, 'pasajero@demo.cl');
  await page.getByRole('searchbox').fill('Ñuñoa');
  await expect(page.locator('app-trip-card')).toHaveCount(1);

  await page.getByRole('link', { name: 'Ver ruta en el mapa' }).click();
  await expect(page.getByText('Ruta del viaje')).toBeVisible();
  await expect(page.getByText(/km en línea recta/)).toBeVisible();
  // El mapa de Leaflet termina de montarse con sus tiles.
  await expect(page.locator('.leaflet-container')).toBeVisible();
});

test('rechaza credenciales inválidas', async ({ page }) => {
  await page.getByLabel('Correo').fill('pasajero@demo.cl');
  await page.getByLabel('Contraseña').fill('incorrecta');
  await page.getByRole('button', { name: 'Ingresar', exact: true }).click();
  await expect(page.getByText('Correo o contraseña incorrectos.')).toBeVisible();
  await expect(page).toHaveURL(/\/login/);
});
