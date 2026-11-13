import React from "react";
import { createRoot } from "react-dom/client";
import { HashRouter, Routes, Route, Link } from "react-router-dom";
import "@fontsource-variable/manrope";
import "@fontsource-variable/source-serif-4";
import "@fontsource-variable/source-serif-4/wght-italic.css";
import "lenis/dist/lenis.css";
import "./styles.css";
import { StoreProvider } from "./lib/store";
import {
  PublicLayout,
  AppLayout,
  RequireDemo,
  RouteEffects,
} from "./components/Layout";
import {
  HomePage,
  HowPage,
  PlansPage,
  HelpPage,
  AboutDemoPage,
  LegalPage,
} from "./pages/Public";
const AccessPage = React.lazy(() =>
  import("./pages/Onboarding").then((m) => ({ default: m.AccessPage })),
);
const OnboardingPage = React.lazy(() =>
  import("./pages/Onboarding").then((m) => ({ default: m.OnboardingPage })),
);
const DiagnosticPage = React.lazy(() =>
  import("./pages/Onboarding").then((m) => ({ default: m.DiagnosticPage })),
);
const DashboardPage = React.lazy(() =>
  import("./pages/Practice").then((m) => ({ default: m.DashboardPage })),
);
const ConversationsPage = React.lazy(() =>
  import("./pages/Practice").then((m) => ({ default: m.ConversationsPage })),
);
const ScenarioDetailPage = React.lazy(() =>
  import("./pages/Practice").then((m) => ({ default: m.ScenarioDetailPage })),
);
const SessionPage = React.lazy(() =>
  import("./pages/Practice").then((m) => ({ default: m.SessionPage })),
);
const ReviewPage = React.lazy(() =>
  import("./pages/Practice").then((m) => ({ default: m.ReviewPage })),
);
const NotebookPage = React.lazy(() =>
  import("./pages/Personal").then((m) => ({ default: m.NotebookPage })),
);
const TrainingPage = React.lazy(() =>
  import("./pages/Personal").then((m) => ({ default: m.TrainingPage })),
);
const ProgressPage = React.lazy(() =>
  import("./pages/Personal").then((m) => ({ default: m.ProgressPage })),
);
const AccountPage = React.lazy(() =>
  import("./pages/Personal").then((m) => ({ default: m.AccountPage })),
);
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? (
      <main className="fatal-error">
        <h1>Hagamos una pausa.</h1>
        <p>
          No pudimos abrir esta pantalla. Recarga para volver a intentarlo; tus
          datos guardados siguen en este navegador.
        </p>
        <button className="button" onClick={() => location.reload()}>
          Recargar la demo
        </button>
      </main>
    ) : (
      this.props.children
    );
  }
}
function NotFound() {
  return (
    <div className="container public-document">
      <h1>
        Por aquí todavía
        <br />
        <em>no hay conversación.</em>
      </h1>
      <p>Vuelve al inicio o entra a tu espacio de práctica.</p>
      <Link className="button" to="/">
        Volver al inicio
      </Link>
    </div>
  );
}
createRoot(document.getElementById("root")!).render(
  <ErrorBoundary>
    <HashRouter>
      <StoreProvider>
        <RouteEffects />
        <React.Suspense
          fallback={
            <main className="route-loading" role="status">
              Abriendo tu espacio…
            </main>
          }
        >
          <Routes>
            <Route element={<PublicLayout />}>
              <Route index element={<HomePage />} />
              <Route path="como-funciona" element={<HowPage />} />
              <Route path="planes" element={<PlansPage />} />
              <Route path="ayuda" element={<HelpPage />} />
              <Route path="acerca-de-la-demo" element={<AboutDemoPage />} />
              <Route path="terminos" element={<LegalPage kind="terminos" />} />
              <Route
                path="privacidad"
                element={<LegalPage kind="privacidad" />}
              />
              <Route path="cookies" element={<LegalPage kind="cookies" />} />
              <Route path="*" element={<NotFound />} />
            </Route>
            <Route path="acceso" element={<AccessPage />} />
            <Route path="recuperar" element={<AccessPage recovery />} />
            <Route element={<RequireDemo />}>
              <Route path="configuracion" element={<OnboardingPage />} />
              <Route path="diagnostico" element={<DiagnosticPage />} />
              <Route path="sesion/:id" element={<SessionPage />} />
              <Route path="app" element={<AppLayout />}>
                <Route index element={<DashboardPage />} />
                <Route path="conversaciones" element={<ConversationsPage />} />
                <Route
                  path="conversaciones/:id"
                  element={<ScenarioDetailPage />}
                />
                <Route path="revision/:id" element={<ReviewPage />} />
                <Route path="repasar" element={<NotebookPage />} />
                <Route path="entrenamiento" element={<TrainingPage />} />
                <Route path="progreso" element={<ProgressPage />} />
                <Route path="cuenta" element={<AccountPage />} />
              </Route>
            </Route>
          </Routes>
        </React.Suspense>
      </StoreProvider>
    </HashRouter>
  </ErrorBoundary>,
);
