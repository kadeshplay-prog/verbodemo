import { test, expect } from '@playwright/test';
import { mkdir } from 'node:fs/promises';

test('abre el navegador, interactúa y genera una captura', async ({ page, request, browser }, testInfo) => {
  const errors = [];
  const external = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('request', (request) => {
    if (new URL(request.url()).hostname !== '127.0.0.1') external.push(request.url());
  });
  const health = await request.get('/healthz');
  expect(await health.json()).toEqual({ status: 'ok', scope: 'tooling-only' });
  await page.goto('/setup/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Comprobación del entorno');
  await page.getByRole('button', { name: 'Comprobar interacción' }).click();
  await expect(page.getByRole('status')).toHaveText('Interacción comprobada.');
  expect(await page.context().cookies()).toEqual([]);
  expect(errors).toEqual([]);
  expect(external).toEqual([]);
  await page.evaluate(() => document.fonts.ready);
  await mkdir('evidence/setup', { recursive: true });
  await page.screenshot({ path: `evidence/setup/${testInfo.project.name}.png`, fullPage: true });
  await testInfo.attach('browser-version', { body: `${testInfo.project.name}: ${browser.version()}`, contentType: 'text/plain' });
  expect((await request.get('/.env')).status()).toBe(404);
});

test('permite teclado y respeta movimiento reducido en la prueba técnica', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/setup/');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('button')).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('status')).toHaveText('Interacción comprobada.');
  expect(await page.evaluate(() => matchMedia('(prefers-reduced-motion: reduce)').matches)).toBe(true);
  expect(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior)).toBe('auto');
});

test('la prueba técnica mantiene lectura a 320, 390, 768, 1024 y 1440 px', async ({ page }) => {
  await page.goto('/setup/');
  for (const width of [320, 390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await expect(page.getByRole('button')).toBeInViewport();
  }
});
