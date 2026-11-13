import { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useLocation, Navigate } from "react-router-dom";
import {
  ArrowUpRight,
  Menu,
  X,
  House,
  MessagesSquare,
  BookOpen,
  ChartNoAxesCombined,
  Settings2,
  ArrowLeft,
  AudioLines,
} from "lucide-react";
import { Brand } from "./ui";
import { useStore } from "../lib/store";
import { stopSpeech } from "../lib/audio";
import { scrollToPublicDestination } from "../lib/scroll";
export function RouteEffects() {
  const location = useLocation();
  useEffect(() => {
    stopSpeech();
    const observer = new MutationObserver(() => focusDestination());
    const focusDestination = () => {
      const element = location.hash
        ? document.getElementById(location.hash.slice(1))
        : document.querySelector<HTMLElement>("h1");
      if (!element) return false;
      if (location.hash) {
        scrollToPublicDestination(element);
        element.tabIndex = -1;
        element.focus({ preventScroll: true });
      } else {
        scrollToPublicDestination(0);
        element.focus({ preventScroll: true });
      }
      const title = document.querySelector("h1")?.textContent;
      document.title = title
        ? `${title.trim().replace(/\s+/g, " ")} · VERVO`
        : "VERVO · Tu inglés, en voz alta";
      observer.disconnect();
      return true;
    };
    const frame = requestAnimationFrame(() => {
      if (!focusDestination())
        observer.observe(document.getElementById("root")!, {
          childList: true,
          subtree: true,
        });
    });
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [location.pathname, location.hash]);
  return null;
}
export function Footer() {
  return (
    <footer className="public-footer container">
      <div className="footer-main">
        <div>
          <Brand />
          <p>
            Un poco más de voz.
            <br />
            Un poco más de ti.
          </p>
        </div>
        <div>
          <Link to="/como-funciona">Cómo funciona</Link>
          <Link to="/planes">Planes</Link>
          <Link to="/ayuda">Ayuda</Link>
        </div>
        <div>
          <Link to="/terminos">Términos y condiciones</Link>
          <Link to="/privacidad">Política de privacidad</Link>
          <Link to="/cookies">Política de cookies</Link>
        </div>
      </div>
      <div className="footer-bottom">
        <span>VERVO · Demo interactiva</span>
        <span>Hecho para encontrar tu voz.</span>
        <Link to="/acerca-de-la-demo">
          Qué puedes probar
          <ArrowUpRight size={15} />
        </Link>
      </div>
    </footer>
  );
}
export function PublicLayout() {
  const { state } = useStore();
  const [menu, setMenu] = useState(false);
  const location = useLocation();
  useEffect(() => setMenu(false), [location.pathname]);
  return (
    <>
      <a
        className="skip-link"
        href="#contenido"
        onClick={(event) => {
          event.preventDefault();
          const main = document.getElementById("contenido");
          if (main) {
            scrollToPublicDestination(main);
            main.focus({ preventScroll: true });
          }
        }}
      >
        Saltar al contenido
      </a>
      <header className="public-header">
        <div className="container header-inner">
          <Brand />
          <nav aria-label="Navegación principal" className="desktop-nav">
            <NavLink to="/como-funciona">El método</NavLink>
            <Link to="/#situaciones">Situaciones</Link>
            <NavLink to="/planes">Planes</NavLink>
          </nav>
          <div className="header-actions">
            <Link
              className="login-link"
              to={state.entered ? "/app" : "/acceso"}
            >
              {state.entered ? "Mi espacio" : "Entrar"}
            </Link>
            <Link
              className="button button-small"
              to={state.entered ? "/app" : "/acceso"}
            >
              Probar gratis
              <ArrowUpRight size={16} />
            </Link>
            <button
              className="icon-button mobile-menu-button"
              type="button"
              aria-label={menu ? "Cerrar menú" : "Abrir menú"}
              aria-expanded={menu}
              onClick={() => setMenu(!menu)}
            >
              {menu ? <X /> : <Menu />}
            </button>
          </div>
          {menu && (
            <nav
              className="mobile-public-nav"
              aria-label="Menú móvil"
              onKeyDown={(e) => {
                if (e.key === "Escape") setMenu(false);
              }}
            >
              <Link to="/como-funciona">El método</Link>
              <Link to="/#situaciones" onClick={() => setMenu(false)}>
                Situaciones
              </Link>
              <Link to="/planes">Planes</Link>
              <Link to="/ayuda">Ayuda</Link>
            </nav>
          )}
        </div>
      </header>
      <main id="contenido" tabIndex={-1}>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
const navigation = [
  { to: "/app", label: "Hoy", icon: House, end: true },
  { to: "/app/conversaciones", label: "Conversaciones", icon: MessagesSquare },
  { to: "/app/repasar", label: "Repasar", icon: BookOpen },
  {
    to: "/app/progreso",
    label: "Mi progreso",
    mobile: "Progreso",
    icon: ChartNoAxesCombined,
  },
];
export function RequireDemo() {
  const { state } = useStore();
  return state.entered ? <Outlet /> : <Navigate to="/acceso" replace />;
}
export function AppLayout() {
  const { state, storageError } = useStore();
  return (
    <div className="app-shell">
      <a
        className="skip-link"
        href="#app-contenido"
        onClick={(event) => {
          event.preventDefault();
          const main = document.getElementById("app-contenido");
          main?.focus();
          main?.scrollIntoView();
        }}
      >
        Saltar al contenido
      </a>
      <aside className="sidebar">
        <Brand />
        <div className="sidebar-label">TU ESPACIO DE PRÁCTICA</div>
        <nav aria-label="Navegación de práctica">
          {navigation.map(({ to, label, icon: Icon, end }) => (
            <NavLink to={to} key={to} end={end}>
              <Icon size={20} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
        <Link className="training-link" to="/app/entrenamiento">
          <AudioLines size={18} />
          Mi entrenamiento
          <ArrowUpRight size={16} />
        </Link>
        <div className="sidebar-bottom">
          <Link to="/app/cuenta">
            <span className="avatar">
              {state.name?.slice(0, 1).toUpperCase() || "T"}
            </span>
            <span>
              {state.name || "Tu cuenta"}
              <small>Demo · Este navegador</small>
            </span>
            <Settings2 size={18} />
          </Link>
          <Link className="back-home" to="/">
            <ArrowLeft size={15} />
            Volver a la web
          </Link>
        </div>
      </aside>
      <div className="app-main">
        <header className="app-topbar">
          <div className="app-mobile-brand">
            <Brand />
          </div>
          <span className="desktop-breadcrumb">Tu inglés empieza contigo.</span>
          <Link to="/acerca-de-la-demo" className="demo-indicator">
            <i />
            Demo interactiva
            <ArrowUpRight size={14} />
          </Link>
          <Link to="/app/cuenta" className="mobile-account" aria-label="Cuenta">
            <Settings2 size={22} />
          </Link>
        </header>
        {storageError && (
          <div className="storage-alert" role="alert">
            {storageError} <Link to="/app/cuenta">Ver opciones</Link>
          </div>
        )}
        <main id="app-contenido" className="app-content" tabIndex={-1}>
          <Outlet />
        </main>
        <footer className="app-footer">
          <span>Tu avance se guarda en este navegador.</span>
          <Link to="/privacidad">Privacidad</Link>
          <Link to="/terminos">Términos</Link>
          <Link to="/cookies">Cookies</Link>
        </footer>
      </div>
      <nav className="bottom-nav" aria-label="Navegación móvil de práctica">
        {navigation.map(({ to, label, mobile, icon: Icon, end }) => (
          <NavLink to={to} key={to} end={end}>
            <Icon size={21} />
            <span>{mobile || label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
