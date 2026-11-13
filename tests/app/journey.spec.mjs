import { test, expect } from "@playwright/test";
import { mkdir } from "node:fs/promises";
async function capture(page, name, testInfo) {
  await page.evaluate(() => document.fonts.ready);
  await mkdir("evidence/app", { recursive: true });
  await page.screenshot({
    path: `evidence/app/${name}-${testInfo.project.name}.png`,
    fullPage: name !== "inicio" && name !== "sesion",
  });
}
async function enter(page) {
  await page.goto("/#/acceso");
  await page
    .getByLabel("Acepto los Términos y condiciones de la demo.")
    .check();
  await page.getByLabel("He leído la Política de privacidad.").check();
  await page.getByRole("button", { name: "Entrar a la demo" }).click();
}
async function quickEnter(page) {
  await enter(page);
  await page.getByRole("link", { name: "Continuar más tarde" }).click();
}
test("recorrido completo, dos casillas independientes, corrección, repaso y persistencia", async ({
  page,
}, testInfo) => {
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Tu inglés.",
  );
  await capture(page, "inicio", testInfo);
  await page
    .getByRole("link", { name: "Probar una conversación", exact: true })
    .first()
    .click();
  await expect(
    page.locator("input[type=password], input[type=email]"),
  ).toHaveCount(0);
  await page.getByRole("button", { name: "Entrar a la demo" }).click();
  await expect(
    page.getByText("Revisa y acepta los términos para continuar."),
  ).toBeVisible();
  await page
    .getByLabel("Acepto los Términos y condiciones de la demo.")
    .check();
  await page.getByRole("button", { name: "Entrar a la demo" }).click();
  await expect(
    page.getByText("Confirma que leíste la política de privacidad."),
  ).toBeVisible();
  await page.getByLabel("¿Cómo te llamamos?").fill("Alex");
  await page.getByLabel("He leído la Política de privacidad.").check();
  await capture(page, "acceso", testInfo);
  await page.getByRole("button", { name: "Entrar a la demo" }).click();
  for (let i = 0; i < 3; i++)
    await page.getByRole("button", { name: "Continuar", exact: true }).click();
  await page
    .getByRole("button", { name: "Seguir por escrito", exact: true })
    .click();
  await page
    .getByLabel("Tu respuesta en inglés")
    .fill("Yesterday I go to the cinema.");
  await page.getByRole("button", { name: "Continuar", exact: true }).click();
  await page
    .getByRole("button", { name: "Salir a caminar", exact: true })
    .click();
  await page.getByRole("button", { name: "Ver mi punto de partida" }).click();
  await page
    .getByRole("button", { name: "Comenzar mi primera práctica" })
    .click();
  await expect(page.locator("html")).not.toHaveClass(/lenis/);
  await expect(page.locator(".pin-spacer")).toHaveCount(0);
  await expect(
    page.getByRole("button", { name: "Terminar y revisar" }),
  ).toBeDisabled();
  await capture(page, "sesion", testInfo);
  await page
    .getByLabel("Tu respuesta en inglés")
    .fill("Yesterday I go to the cinema.");
  await page.getByRole("button", { name: "Enviar respuesta" }).click();
  await expect(page.getByText("1 turno guardado")).toBeVisible();
  await page.reload();
  await expect(
    page.getByText("Yesterday I go to the cinema.", { exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Terminar y revisar" }).click();
  await expect(page.locator(".correction-comparison")).toContainText(
    "Yesterday I went to the cinema.",
  );
  await capture(page, "revision", testInfo);
  await page.getByRole("button", { name: "Practicar esta frase" }).click();
  await page
    .getByLabel("Tu nuevo intento")
    .fill("Last weekend I went to the park.");
  await page.getByRole("button", { name: "Comprobar mi frase" }).click();
  await expect(page.getByRole("status")).toContainText(
    "Ejercicio de ejemplo completado.",
  );
  await page.getByRole("link", { name: "Terminar por hoy" }).click();
  await capture(page, "hoy", testInfo);
  await page.goto("/#/app/repasar");
  await expect(page.locator(".notebook-entry")).toContainText(
    "Yesterday I went to the cinema.",
  );
  await capture(page, "repaso", testInfo);
  await page.goto("/#/app/progreso");
  await expect(page.locator(".history-row")).toHaveCount(1);
  await capture(page, "progreso", testInfo);
  await page.reload();
  await expect(page.locator(".history-row")).toHaveCount(1);
  expect(
    await page.evaluate(
      () =>
        JSON.parse(localStorage.getItem("vervo.demo.v1")).notebook[0].practiced,
    ),
  ).toBe(true);
  expect(errors).toEqual([]);
});
test("búsqueda, filtros, estados vacíos y páginas legales en móvil y escritorio", async ({
  page,
}, testInfo) => {
  await quickEnter(page);
  await page.goto("/#/app/progreso");
  await expect(
    page.getByRole("heading", { name: "Tu progreso empieza con un intento." }),
  ).toBeVisible();
  await page.goto("/#/app/conversaciones");
  await expect(page.locator(".scenario-card")).toHaveCount(24);
  await capture(page, "conversaciones", testInfo);
  await page.getByLabel("Buscar conversaciones").fill("palabra-inexistente");
  await expect(
    page.getByRole("heading", { name: "No encontramos esa conversación." }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Ver todas las situaciones" }).click();
  await expect(page.locator(".scenario-card")).toHaveCount(24);
  await page
    .getByRole("combobox", { name: "Duración", exact: true })
    .selectOption("5");
  await expect(page.locator(".scenario-card")).toHaveCount(6);
  for (const width of [320, 390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  }
  await page.goto("/");
  for (const width of [320, 390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const action of await page.locator(".hero-actions .button").all()) {
      const rect = await action.boundingBox();
      expect(rect.x).toBeGreaterThanOrEqual(8);
      expect(rect.x + rect.width).toBeLessThanOrEqual(width - 8);
    }
  }
  for (const route of [
    "terminos",
    "privacidad",
    "cookies",
    "ayuda",
    "planes",
  ]) {
    await page.goto(`/#/${route}`);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  }
});
test("recupera fallo simulado sin duplicar turnos y maneja micrófono denegado", async ({
  page,
}) => {
  await quickEnter(page);
  await page.goto("/#/app/cuenta");
  await page
    .getByText("Explorar los estados de la demo", { exact: true })
    .click();
  await page
    .getByLabel("Simular un fallo del tutor en el próximo turno")
    .check();
  await page.goto("/#/app/conversaciones/fin-de-semana");
  await page.getByRole("button", { name: "Comenzar esta práctica" }).click();
  await page
    .getByLabel("Tu respuesta en inglés")
    .fill("Yesterday I go to the cinema.");
  await page.getByRole("button", { name: "Enviar respuesta" }).click();
  await expect(page.getByRole("alert")).toContainText(
    "Fallo de conexión simulado",
  );
  await expect(page.getByLabel("Tu respuesta en inglés")).toHaveValue(
    "Yesterday I go to the cinema.",
  );
  await page.getByRole("button", { name: "Enviar respuesta" }).click();
  await expect(page.getByText("1 turno guardado")).toBeVisible();
  expect(
    await page.evaluate(
      () =>
        JSON.parse(
          localStorage.getItem("vervo.demo.v1"),
        ).sessions[0].turns.filter((t) => t.role === "user").length,
    ),
  ).toBe(1);
  await page.evaluate(() => {
    navigator.mediaDevices.getUserMedia = () =>
      Promise.reject(new DOMException("denied", "NotAllowedError"));
  });
  await page.getByRole("button", { name: "Con mi voz", exact: true }).click();
  await page
    .getByRole("button", { name: "Grabar mi voz", exact: true })
    .click();
  const recorderSupported = await page.evaluate(() => !!window.MediaRecorder);
  await expect(page.getByRole("alert")).toContainText(
    recorderSupported
      ? "El micrófono está bloqueado"
      : "Este navegador no permite grabar aquí",
  );
  await page.getByRole("button", { name: "Pausar", exact: true }).click();
  await expect(page.getByLabel("El texto de tu respuesta")).toBeDisabled();
  await page.getByRole("button", { name: "Continuar", exact: true }).click();
  await page.getByRole("button", { name: "Salir", exact: true }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).not.toBeVisible();
});
test("pago pendiente no activa plan y eliminación de datos requiere confirmación", async ({
  page,
}, testInfo) => {
  await quickEnter(page);
  await page.goto("/#/app/cuenta");
  await capture(page, "cuenta", testInfo);
  await page
    .getByRole("button", { name: "Explorar activación de ejemplo" })
    .click();
  const dialog = page.getByRole("dialog");
  await dialog.getByRole("button", { name: "Simular activación" }).click();
  await expect(dialog.getByRole("alert")).toBeVisible();
  await dialog
    .getByLabel("Resultado que quieres probar")
    .selectOption("pending");
  await dialog
    .getByLabel("Acepto los Términos y condiciones de la demo.")
    .check();
  await dialog.getByLabel("He leído la Política de privacidad.").check();
  await dialog.getByRole("button", { name: "Simular activación" }).click();
  expect(
    await page.evaluate(
      () => JSON.parse(localStorage.getItem("vervo.demo.v1")).plan,
    ),
  ).toBe("free");
  await expect(
    page.getByText(/Confirmación de ejemplo pendiente/),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Comprobar estado de ejemplo" })
    .click();
  await expect(
    page.getByRole("heading", { name: "Práctica mensual." }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Cancelar renovación de ejemplo" })
    .click();
  expect(
    await page.evaluate(
      () => JSON.parse(localStorage.getItem("vervo.demo.v1")).renewal,
    ),
  ).toBe(false);
  await page
    .getByRole("button", { name: "Borrar todos los datos de esta demo" })
    .click();
  await dialog.getByRole("button", { name: "Conservar mis datos" }).click();
  await expect(
    page.getByRole("heading", { name: "Tu espacio. Tus decisiones." }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Borrar todos los datos de esta demo" })
    .click();
  await dialog.getByRole("button", { name: "Borrar todos mis datos" }).click();
  await expect(
    page.getByRole("button", { name: "Entrar a la demo" }),
  ).toBeVisible();
  expect(await page.evaluate(() => localStorage.getItem("vervo.demo.v1"))).toBe(
    null,
  );
});
test("movimiento reducido, cambio en vivo y limpieza al navegar", async ({
  page,
  isMobile,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);
  await expect(page.locator(".story-step")).toHaveCount(3);
  expect(await page.locator(".story-stage").getAttribute("data-animated")).toBe(
    null,
  );
  await expect(page.locator(".pin-spacer")).toHaveCount(0);
  await expect(page.locator("html")).not.toHaveClass(/lenis/);
  for (const panel of await page.locator(".story-step").all())
    await expect(panel).toBeVisible();
  if (!isMobile) {
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await expect(page.locator(".story-stage")).toHaveAttribute(
      "data-animated",
      "true",
    );
    await expect(page.locator("html")).toHaveClass(/lenis/);
    await page.emulateMedia({ reducedMotion: "reduce" });
    await expect(page.locator(".pin-spacer")).toHaveCount(0);
    await expect(page.locator("html")).not.toHaveClass(/lenis/);
  }
  await page.goto("/#/planes");
  await expect(page.locator(".pin-spacer")).toHaveCount(0);
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Dale un lugar",
  );
});
