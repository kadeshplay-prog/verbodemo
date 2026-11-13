import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  ArrowLeft,
  Check,
  Coffee,
  BriefcaseBusiness,
  Luggage,
  Play,
  Mic,
  ShieldCheck,
} from "lucide-react";
import { Brand, Dialog } from "../components/ui";
import { VoiceRecorder } from "../components/VoiceRecorder";
import { useStore } from "../lib/store";
import { scenarioById } from "../lib/content";
import { speak } from "../lib/audio";
export function AccessPage({ recovery = false }: { recovery?: boolean }) {
  const { state, update, reset, storageError } = useStore();
  const navigate = useNavigate();
  const [name, setName] = useState(state.name);
  const [terms, setTerms] = useState(false);
  const [privacy, setPrivacy] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);
  const destination = state.onboarding.complete ? "/app" : "/configuracion";
  if (state.entered && !recovery) return <Navigate to={destination} replace />;
  const enter = () => {
    update((s) => ({
      ...s,
      entered: true,
      name: name.trim(),
      acceptedAt: new Date().toISOString(),
      acceptedDocuments: {
        termsVersion: "demo-0.1",
        privacyVersion: "demo-0.1",
        at: new Date().toISOString(),
      },
    }));
    navigate(destination);
  };
  return (
    <div className="access-page">
      <div className="access-header">
        <Brand />
        <Link className="arrow-link" to="/">
          Volver al inicio
          <ArrowUpRightIcon />
        </Link>
      </div>
      <main className="access-main">
        <div className="access-copy">
          <h1 tabIndex={-1}>
            {recovery ? (
              <>
                Volver también
                <br />
                <em>es avanzar.</em>
              </>
            ) : (
              <>
                Una conversación
                <br />
                <em>puede cambiarlo todo.</em>
              </>
            )}
          </h1>
          <p>
            Empieza con tu inglés de hoy.
            <br />
            El siguiente paso lo damos contigo.
          </p>
          <div className="access-quote">
            <span className="category">TU PRIMER INTENTO</span>
            <p>
              “I want to feel
              <br />
              more like <em>myself.</em>”
            </p>
            <span>Hay mucho de ti que el mundo aún no ha escuchado.</span>
          </div>
        </div>
        <div className="access-form-panel">
          <span className="tag">Demo interactiva · Sin cargos</span>
          <h2>
            {recovery
              ? "Recuperar tu espacio"
              : state.acceptedAt
                ? `Qué bueno verte${state.name ? ", " + state.name : ""}.`
                : "Dale una oportunidad a tu voz."}
          </h2>
          {storageError && (
            <p className="form-error" role="alert">
              {storageError}
            </p>
          )}
          {recovery ? (
            <>
              <p>
                Esta demo no crea cuentas ni contraseñas. Si el avance sigue
                guardado en este navegador, puedes retomarlo. No enviamos
                correos de recuperación.
              </p>
              <button
                className="button"
                type="button"
                onClick={() => {
                  if (state.acceptedAt) {
                    update((s) => ({ ...s, entered: true }));
                    navigate(destination);
                  } else navigate("/acceso");
                }}
              >
                Volver a la demo
                <ArrowRight size={18} />
              </button>
            </>
          ) : state.acceptedAt ? (
            <>
              <p>
                Tu espacio de práctica sigue en este navegador. Puedes retomar
                desde donde lo dejaste.
              </p>
              <button
                className="button full-width"
                type="button"
                onClick={() => {
                  update((s) => ({ ...s, entered: true }));
                  navigate(destination);
                }}
              >
                Continuar mi práctica
                <ArrowRight size={18} />
              </button>
              <button
                className="text-button"
                type="button"
                onClick={() => setResetOpen(true)}
              >
                Empezar una demo desde cero
              </button>
            </>
          ) : (
            <form
              noValidate
              onSubmit={(e) => {
                e.preventDefault();
                setSubmitted(true);
                if (terms && privacy) enter();
              }}
            >
              <label htmlFor="demo-name">
                ¿Cómo te llamamos? <span className="optional">Opcional</span>
              </label>
              <input
                id="demo-name"
                autoComplete="given-name"
                placeholder="Tu nombre o un apodo"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={32}
              />
              <p className="field-help">
                No hace falta correo, contraseña ni tarjeta para esta demo.
              </p>
              <div className="legal-checkbox">
                <label>
                  <input
                    type="checkbox"
                    checked={terms}
                    onChange={(e) => setTerms(e.target.checked)}
                    aria-invalid={submitted && !terms}
                    aria-describedby={
                      submitted && !terms ? "terms-error" : undefined
                    }
                  />
                  <span>Acepto los Términos y condiciones de la demo.</span>
                </label>
                <Link to="/terminos" target="_blank" rel="noopener noreferrer">
                  Leer términos <span className="sr-only">(nueva pestaña)</span>
                  <ArrowUpRightIcon />
                </Link>
                {submitted && !terms && (
                  <p id="terms-error" role="alert" className="form-error">
                    Revisa y acepta los términos para continuar.
                  </p>
                )}
              </div>
              <div className="legal-checkbox">
                <label>
                  <input
                    type="checkbox"
                    checked={privacy}
                    onChange={(e) => setPrivacy(e.target.checked)}
                    aria-invalid={submitted && !privacy}
                    aria-describedby={
                      submitted && !privacy ? "privacy-error" : undefined
                    }
                  />
                  <span>He leído la Política de privacidad.</span>
                </label>
                <Link
                  to="/privacidad"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Leer privacidad{" "}
                  <span className="sr-only">(nueva pestaña)</span>
                  <ArrowUpRightIcon />
                </Link>
                {submitted && !privacy && (
                  <p id="privacy-error" role="alert" className="form-error">
                    Confirma que leíste la política de privacidad.
                  </p>
                )}
              </div>
              <button className="button full-width" type="submit">
                Entrar a la demo
                <ArrowRight size={18} />
              </button>
            </form>
          )}
          <p className="access-privacy">
            <ShieldCheck size={16} />
            Tu avance se guarda en este dispositivo. El acceso de la demo no es
            una autenticación real.
          </p>
          <Link className="text-button" to="/acerca-de-la-demo">
            Qué puedes probar
          </Link>
          {storageError && (
            <button className="text-button" onClick={() => setResetOpen(true)}>
              Restablecer datos dañados
            </button>
          )}
        </div>
      </main>
      <Dialog
        open={resetOpen}
        onClose={() => setResetOpen(false)}
        title="¿Empezar desde cero?"
      >
        <p>
          Se borrarán las prácticas, textos y grabaciones guardados en este
          navegador.
        </p>
        <div className="dialog-actions">
          <button
            className="button button-outline"
            onClick={() => setResetOpen(false)}
          >
            Conservar mi avance
          </button>
          <button
            className="button"
            onClick={() => {
              reset();
              setResetOpen(false);
            }}
          >
            Borrar y empezar
          </button>
        </div>
      </Dialog>
    </div>
  );
}
function ArrowUpRightIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
    >
      <path d="M6 18 18 6M6 6h12v12" />
    </svg>
  );
}
export function OnboardingPage() {
  const { state, update } = useStore();
  const navigate = useNavigate();
  const step = state.onboarding.step;
  const next = () => {
    if (step === 3) {
      update((s) => ({
        ...s,
        onboarding: { ...s.onboarding, complete: true },
      }));
      navigate("/diagnostico");
    } else
      update((s) => ({
        ...s,
        onboarding: { ...s.onboarding, step: step + 1 },
      }));
  };
  const titles = [
    <>
      ¿A dónde quieres
      <br />
      <em>llevar tu inglés?</em>
    </>,
    <>
      ¿Cómo se siente
      <br />
      <em>hablar en inglés?</em>
    </>,
    <>
      Hazle un espacio.
      <br />
      <em>A tu manera.</em>
    </>,
    <>
      Tu voz.
      <br />
      <em>Todo empieza aquí.</em>
    </>,
  ];
  return (
    <div className="onboarding-page">
      <header className="container onboarding-header">
        <Brand />
        <Link className="text-button" to="/app">
          Continuar más tarde
        </Link>
      </header>
      <main className="onboarding-card">
        <div className="onboarding-top">
          <span>Paso {step + 1} de 4</span>
          <span>Hagamos esto tuyo.</span>
        </div>
        <div className="step-track" aria-label={`Paso ${step + 1} de 4`}>
          {[0, 1, 2, 3].map((i) => (
            <span className={i <= step ? "done" : ""} key={i} />
          ))}
        </div>
        <h1 tabIndex={-1}>{titles[step]}</h1>
        {step === 0 ? (
          <>
            <p>
              Empezaremos por esas conversaciones que forman parte de tu día.
            </p>
            <div className="option-list">
              {[
                {
                  label: "Vida cotidiana",
                  detail: "De un café a una buena historia.",
                  Icon: Coffee,
                },
                {
                  label: "Trabajo",
                  detail: "Próximamente",
                  Icon: BriefcaseBusiness,
                },
                { label: "Viajes", detail: "Próximamente", Icon: Luggage },
              ].map(({ label, detail, Icon }, i) => (
                <button
                  type="button"
                  key={label}
                  disabled={i > 0}
                  className={`choice ${state.onboarding.goal === label ? "selected" : ""}`}
                  aria-pressed={state.onboarding.goal === label}
                  onClick={() =>
                    update((s) => ({
                      ...s,
                      onboarding: { ...s.onboarding, goal: label },
                    }))
                  }
                >
                  <Icon size={24} />
                  <span>
                    <strong>{label}</strong>
                    <small>{detail}</small>
                  </span>
                  {i === 0 && <Check size={20} />}
                </button>
              ))}
            </div>
          </>
        ) : step === 1 ? (
          <>
            <p>
              No hay una respuesta correcta. Solo un buen punto para empezar.
            </p>
            <div className="option-list">
              {[
                "Me cuesta empezar",
                "Puedo responder",
                "Quiero expresarme mejor",
              ].map((label) => (
                <button
                  type="button"
                  className={`choice ${state.onboarding.confidence === label ? "selected" : ""}`}
                  key={label}
                  aria-pressed={state.onboarding.confidence === label}
                  onClick={() =>
                    update((s) => ({
                      ...s,
                      onboarding: { ...s.onboarding, confidence: label },
                    }))
                  }
                >
                  <span>{label}</span>
                  {state.onboarding.confidence === label && <Check size={20} />}
                </button>
              ))}
            </div>
          </>
        ) : step === 2 ? (
          <>
            <p>Un poco, con constancia. Puedes cambiarlo después.</p>
            <div className="routine-options">
              {[5, 10, 15].map((minutes) => (
                <button
                  type="button"
                  className={`choice ${state.onboarding.minutes === minutes ? "selected" : ""}`}
                  key={minutes}
                  aria-pressed={state.onboarding.minutes === minutes}
                  onClick={() =>
                    update((s) => ({
                      ...s,
                      onboarding: { ...s.onboarding, minutes },
                    }))
                  }
                >
                  <strong>{minutes}</strong>
                  <span>minutos al día</span>
                </button>
              ))}
            </div>
            <p className="small">
              No activamos recordatorios ni enviamos notificaciones.
            </p>
          </>
        ) : (
          <>
            <p>
              Comprueba tu micrófono o sigue por escrito. Tú eliges cómo
              empezar.
            </p>
            <VoiceRecorder title="Prueba de micrófono" />
            <p className="small">
              La grabación es local y no evalúa tu pronunciación. Puedes
              practicar sin dar acceso al micrófono.
            </p>
          </>
        )}
        <div className="onboarding-actions">
          <button
            className="text-button"
            type="button"
            onClick={() =>
              step
                ? update((s) => ({
                    ...s,
                    onboarding: { ...s.onboarding, step: step - 1 },
                  }))
                : navigate("/acceso")
            }
          >
            <ArrowLeft size={17} />
            Atrás
          </button>
          <button className="button" type="button" onClick={next}>
            {step === 3 ? "Continuar al diagnóstico" : "Continuar"}
            <ArrowRight size={18} />
          </button>
        </div>
        {step === 3 && (
          <button className="text-button onboarding-skip" onClick={next}>
            Seguir por escrito
          </button>
        )}
      </main>
    </div>
  );
}
export function DiagnosticPage() {
  const { state, update, createSession } = useStore();
  const [stage, setStage] = useState(0);
  const [answer, setAnswer] = useState(state.diagnostic.answer);
  const [choice, setChoice] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const finish = () => {
    update((s) => ({
      ...s,
      diagnostic: { complete: true, skipped: false, answer },
    }));
    setStage(2);
  };
  return (
    <div className="onboarding-page">
      <header className="container onboarding-header">
        <Brand />
        <button
          className="text-button"
          type="button"
          onClick={() => {
            update((s) => ({
              ...s,
              diagnostic: { ...s.diagnostic, skipped: true },
            }));
            navigate("/app");
          }}
        >
          Omitir por ahora
        </button>
      </header>
      <main className="onboarding-card diagnostic-card">
        <span className="tag">Punto de partida · Demo por escrito</span>
        <h1 tabIndex={-1}>
          {stage === 2 ? (
            <>
              Este es un buen lugar
              <br />
              <em>para empezar.</em>
            </>
          ) : stage === 0 ? (
            <>
              Tu inglés de hoy.
              <br />
              <em>Sin exámenes.</em>
            </>
          ) : (
            <>
              Escucha.
              <br />
              <em>O lee a tu ritmo.</em>
            </>
          )}
        </h1>
        {stage === 0 ? (
          <>
            <p>
              En el producto, esta práctica orientará tu recorrido. Aquí puedes
              probar una respuesta escrita, sin estimación de nivel.
            </p>
            <div className="diagnostic-prompt">
              <span>Una pregunta para conocerte</span>
              <p>“What did you do yesterday?”</p>
              <button
                className="text-button"
                type="button"
                onClick={() => speak("What did you do yesterday?", 0.85)}
              >
                <Play size={16} />
                Escuchar la pregunta
              </button>
            </div>
            <label htmlFor="diagnostic-answer">Tu respuesta en inglés</label>
            <textarea
              id="diagnostic-answer"
              value={answer}
              onChange={(e) => {
                setAnswer(e.target.value);
                setError("");
              }}
              placeholder="Yesterday I…"
              maxLength={2000}
            />
            <button
              className="button full-width"
              onClick={() => {
                if (!answer.trim())
                  setError("Escribe una frase o elige Omitir por ahora.");
                else setStage(1);
              }}
            >
              Continuar
              <ArrowRight size={18} />
            </button>
          </>
        ) : stage === 1 ? (
          <>
            <div className="diagnostic-prompt">
              <p>“I usually go for a walk after work.”</p>
              <button
                className="text-button"
                onClick={() =>
                  speak("I usually go for a walk after work.", 0.85)
                }
              >
                <Play size={16} />
                Escuchar ejemplo
              </button>
            </div>
            <p>¿Qué suele hacer esta persona después de trabajar?</p>
            <div className="option-list">
              {["Salir a caminar", "Ir al cine", "Preparar la cena"].map(
                (option) => (
                  <button
                    type="button"
                    className={`choice ${choice === option ? "selected" : ""}`}
                    key={option}
                    onClick={() => {
                      setChoice(option);
                      setError("");
                    }}
                  >
                    {option}
                    {choice === option && <Check size={18} />}
                  </button>
                ),
              )}
            </div>
            <button
              className="button full-width"
              onClick={() => {
                if (!choice) setError("Elige una respuesta para continuar.");
                else finish();
              }}
            >
              Ver mi punto de partida
              <ArrowRight size={18} />
            </button>
          </>
        ) : (
          <>
            <div className="diagnostic-result">
              <Check size={24} />
              <div>
                <h3>Ya diste un primer paso.</h3>
                <p>
                  {answer.trim().length > 12
                    ? "Compartiste una idea por escrito. Ahora puedes darle un poco más de contexto."
                    : "Necesitamos una muestra más amplia para ofrecer una recomendación personalizada."}
                </p>
              </div>
            </div>
            <p>
              {choice === "Salir a caminar"
                ? "Identificaste la idea del ejemplo de comprensión."
                : "En el ejemplo, go for a walk significa salir a caminar. Puedes volver a escucharlo más adelante."}
            </p>
            <div className="recommended-start">
              <span className="category">PARA TU PRIMERA PRÁCTICA</span>
              <h3>¿Qué tal tu fin de semana?</h3>
              <p>Con apoyo · Pistas disponibles · Aproximadamente 10 min</p>
            </div>
            <p className="small">
              Recomendación provisional de la demo. No hemos evaluado tu
              expresión oral ni asignado un nivel.
            </p>
            <button
              className="button full-width"
              onClick={() => {
                const scenario = scenarioById("fin-de-semana");
                const id = createSession(scenario.id, scenario.opening);
                navigate(`/sesion/${id}`);
              }}
            >
              Comenzar mi primera práctica
              <ArrowRight size={18} />
            </button>
          </>
        )}
        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}
      </main>
    </div>
  );
}
