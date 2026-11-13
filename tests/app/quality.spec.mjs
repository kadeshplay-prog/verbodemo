import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { mkdir, writeFile } from "node:fs/promises";
async function enter(page) {
  await page.goto("/#/acceso");
  await page
    .getByLabel("Acepto los Términos y condiciones de la demo.")
    .check();
  await page.getByLabel("He leído la Política de privacidad.").check();
  await page.getByRole("button", { name: "Entrar a la demo" }).click();
  await page.getByRole("link", { name: "Continuar más tarde" }).click();
}
test("scroll continuo, reversible, sin guardar datos y con vídeo de Chromium", async ({
  browser,
  browserName,
  isMobile,
  baseURL,
}, info) => {
  test.skip(
    isMobile,
    "En móvil los tres actos se muestran sin pin ni Lenis; cubierto por el test de adaptación.",
  );
  await mkdir("evidence/app", { recursive: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
    locale: "es-MX",
    reducedMotion: "no-preference",
    ...(browserName === "chromium"
      ? {
          recordVideo: {
            dir: "work/app-videos",
            size: { width: 1440, height: 1000 },
          },
        }
      : {}),
  });
  const page = await context.newPage();
  const video = page.video();
  try {
    await page.goto(baseURL);
    await page.evaluate(() => document.fonts.ready);
    await expect(page.locator(".story-stage")).toHaveAttribute(
      "data-animated",
      "true",
    );
    await expect(page.locator(".pin-spacer")).toHaveCount(1);
    await page.mouse.wheel(0, 800);
    await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(500);
    await expect(page.locator("html")).not.toHaveClass(/lenis-scrolling/);
    const position = await page.locator(".pin-spacer").evaluate((el) => ({
      start: el.getBoundingClientRect().top + scrollY - 96,
      distance: innerHeight * 1.8,
    }));
    for (const [progress, act] of [
      [0, 0],
      [0.33, 1],
      [0.5, 1],
      [0.66, 2],
      [1, 2],
      [0.5, 1],
      [0.12, 0],
    ]) {
      await page.evaluate(({ y }) => window.scrollTo(0, y), {
        y:
          position.start +
          position.distance * progress +
          (progress === 0 ? 1 : 0),
      });
      await expect(
        page.locator(`.story-step[data-step="${act}"]`),
      ).toHaveAttribute("aria-hidden", "false");
      if ([0, 0.33, 0.66, 1].includes(progress))
        await page.screenshot({
          path: `evidence/app/scroll-${Math.round(progress * 100)}-${info.project.name}.png`,
        });
    }
    // Recorrer los tres actos con rueda real, incluida la inversión de Lenis.
    await page.mouse.wheel(0, 1500);
    await expect(page.locator('.story-step[data-step="2"]')).toHaveAttribute(
      "aria-hidden",
      "false",
    );
    await expect(page.locator("html")).not.toHaveClass(/lenis-scrolling/);
    await page.mouse.wheel(0, -1500);
    await expect(page.locator('.story-step[data-step="0"]')).toHaveAttribute(
      "aria-hidden",
      "false",
    );
    await expect(page.locator("html")).not.toHaveClass(/lenis-scrolling/);
    // Un ancla pulsada durante la inercia conserva el destino y el foco.
    await page.mouse.wheel(0, -200);
    await page
      .getByRole("navigation", { name: "Navegación principal" })
      .getByRole("link", { name: "Situaciones" })
      .click();
    await expect(page.locator("#situaciones")).toBeFocused();
    await expect
      .poll(() =>
        page
          .locator("#situaciones")
          .evaluate((el) => Math.round(el.getBoundingClientRect().top)),
      )
      .toBeGreaterThanOrEqual(90);
    await expect
      .poll(() =>
        page
          .locator("#situaciones")
          .evaluate((el) => Math.round(el.getBoundingClientRect().top)),
      )
      .toBeLessThanOrEqual(100);
    expect(
      await page.evaluate(() => localStorage.getItem("vervo.demo.v1")),
    ).toBe(null);
    await page
      .getByRole("link", { name: "Saltar a planes", exact: true })
      .click();
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "Dale un lugar",
    );
    await expect(page.locator(".pin-spacer")).toHaveCount(0);
    await expect(page.locator("html")).not.toHaveClass(/lenis/);
    await page.goBack();
    await expect(page.locator(".pin-spacer")).toHaveCount(1);
  } finally {
    await context.close();
    if (video) await video.saveAs("evidence/app/scroll-ida-vuelta.webm");
  }
});
test("accesibilidad automática y enlace de salto con teclado", async ({
  page,
  browserName,
}, info) => {
  test.skip(
    browserName !== "chromium",
    "Axe se ejecuta en Chromium escritorio y móvil; los recorridos de teclado se prueban en los tres motores.",
  );
  const results = [];
  for (const route of ["/", "/#/acceso", "/#/privacidad"]) {
    await page.goto(route);
    await page.evaluate(() => document.fonts.ready);
    const report = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
      .analyze();
    results.push({ route, violations: report.violations });
  }
  await enter(page);
  for (const route of ["/#/app", "/#/app/conversaciones", "/#/app/cuenta"]) {
    await page.goto(route);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    const report = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
      .analyze();
    results.push({ route, violations: report.violations });
  }
  await mkdir("work/a11y", { recursive: true });
  await writeFile(
    `work/a11y/${info.project.name}.json`,
    JSON.stringify(results, null, 2),
  );
  expect(
    results.flatMap((r) =>
      r.violations.map((v) => ({
        route: r.route,
        id: v.id,
        nodes: v.nodes.map((n) => n.target),
      })),
    ),
  ).toEqual([]);
  await page.goto("/");
  await page.evaluate(() => {
    document.body.tabIndex = -1;
    document.body.focus();
    document.body.removeAttribute("tabindex");
  });
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("link", { name: "Saltar al contenido" }),
  ).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("#contenido")).toBeFocused();
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Tu inglés.",
  );
});
test("grabación con señal Web Audio, conservación elegida y borrado de audio", async ({
  page,
  context,
  browserName,
  isMobile,
}) => {
  test.skip(
    browserName !== "chromium" || isMobile,
    "La captura usa una señal sintética Web Audio en Chromium; Safari/iPhone y micrófono físico quedan pendientes.",
  );
  await context.grantPermissions(["microphone"]);
  await enter(page);
  await page.goto("/#/app/conversaciones/fin-de-semana");
  await page.getByRole("button", { name: "Comenzar esta práctica" }).click();
  await page.getByRole("button", { name: "Con mi voz", exact: true }).click();
  // Señal sintética de Web Audio: MediaRecorder, el medidor y el guardado son
  // reales. El capturador de micrófono físico no está disponible en este host.
  await page.evaluate(() => {
    const audioContext = new AudioContext();
    const oscillator = audioContext.createOscillator();
    const destination = audioContext.createMediaStreamDestination();
    oscillator.frequency.value = 440;
    oscillator.connect(destination);
    oscillator.start();
    window.__vervoTestStreams = [];
    navigator.mediaDevices.getUserMedia = async () => {
      const stream = destination.stream.clone();
      window.__vervoTestStreams.push(stream);
      return stream;
    };
    window.__vervoTestAudio = { audioContext, oscillator };
  });
  await page
    .getByRole("button", { name: "Grabar mi voz", exact: true })
    .click();
  await expect(
    page.getByText("Grabando tu voz", { exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Detener grabación" }).click();
  expect(
    await page.evaluate(() =>
      window.__vervoTestStreams.every((stream) =>
        stream.getTracks().every((track) => track.readyState === "ended"),
      ),
    ),
  ).toBe(true);
  await expect(page.locator("audio")).toHaveCount(1);
  expect(
    await page.evaluate(
      () => JSON.parse(localStorage.getItem("vervo.demo.v1")).recordings.length,
    ),
  ).toBe(0);
  await page
    .getByRole("button", { name: "Guardar en este dispositivo", exact: true })
    .click();
  await expect(
    page.getByRole("button", { name: "Guardada en este dispositivo" }),
  ).toBeDisabled();
  await page.goto("/#/app/cuenta");
  await expect(page.locator(".saved-recording audio")).toHaveCount(1);
  await page.reload();
  await expect(page.locator(".saved-recording audio")).toHaveCount(1);
  await page
    .getByRole("button", {
      name: "Eliminar grabación: ¿Qué tal tu fin de semana?",
    })
    .click();
  await expect(page.locator(".saved-recording")).toHaveCount(0);
});
