import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowUpRight,
  ArrowRight,
  Bookmark,
  Check,
  Trash2,
  Download,
  LogOut,
  Volume2,
  Coffee,
  MessageCircle,
  ShieldCheck,
  Settings2,
} from "lucide-react";
import { useStore, downloadData, type Recording } from "../lib/store";
import { scenarios, scenarioById } from "../lib/content";
import { deleteRecording, getRecording, speak } from "../lib/audio";
import { Dialog, EmptyState, PageHeading, formatDate } from "../components/ui";
import { PracticeExercise } from "./Practice";
export function NotebookPage() {
  const { state, update } = useStore();
  const [active, setActive] = useState("");
  const [filter, setFilter] = useState("all");
  const [deleteKey, setDeleteKey] = useState("");
  const notes = state.notebook.filter(
    (n) =>
      filter === "all" || (filter === "pending" ? !n.practiced : n.practiced),
  );
  return (
    <>
      <PageHeading
        title={
          <>
            Lo que aprendes.
            <br />
            <em>Se queda contigo.</em>
          </>
        }
      >
        Tu cuaderno y tus repasos. Una oportunidad más para hacer tuyas las
        palabras.
      </PageHeading>
      <div
        className="notebook-tabs"
        role="group"
        aria-label="Filtrar mi cuaderno"
      >
        {[
          ["all", "Todo mi cuaderno"],
          ["pending", "Para repasar"],
          ["done", "Ya lo practiqué"],
        ].map(([value, text]) => (
          <button
            className={`filter-pill ${filter === value ? "selected" : ""}`}
            aria-pressed={filter === value}
            key={value}
            onClick={() => setFilter(value)}
          >
            {text}
            {value === "pending" && (
              <span>{state.notebook.filter((n) => !n.practiced).length}</span>
            )}
          </button>
        ))}
      </div>
      {notes.length ? (
        <div className="notebook-list">
          {notes.map((n) => {
            const key = n.sessionId + n.id;
            return (
              <article className="notebook-entry" key={key}>
                <div className="notebook-entry-heading">
                  <span className="tag">
                    {n.practiced ? "En práctica" : "Detectado"}
                  </span>
                  <span>{n.skill}</span>
                  <button
                    className="icon-button"
                    aria-label={`Eliminar repaso: ${n.skill}`}
                    onClick={() => setDeleteKey(key)}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
                <h2>{n.suggested}</h2>
                <p>{n.explanation}</p>
                <div className="inline-actions">
                  <button
                    className="button button-outline"
                    onClick={() => setActive(active === key ? "" : key)}
                  >
                    Practicar ahora
                    <ArrowRight size={18} />
                  </button>
                  <button
                    className="text-button"
                    onClick={() => speak(n.suggested, state.speed)}
                  >
                    <Volume2 size={17} />
                    Escuchar
                  </button>
                  <Link
                    className="text-button"
                    to={`/app/revision/${n.sessionId}`}
                  >
                    Volver al contexto
                    <ArrowUpRight size={16} />
                  </Link>
                </div>
                {active === key && (
                  <PracticeExercise
                    target={n.target}
                    suggested={n.suggested}
                    onSuccess={() =>
                      update((s) => ({
                        ...s,
                        notebook: s.notebook.map((item) =>
                          item.sessionId + item.id === key
                            ? { ...item, practiced: true }
                            : item,
                        ),
                      }))
                    }
                  />
                )}
                <details className="note-details">
                  <summary>Una nota para ti</summary>
                  <label className="sr-only" htmlFor={`note-${key}`}>
                    Nota personal sobre {n.skill}
                  </label>
                  <textarea
                    id={`note-${key}`}
                    maxLength={1000}
                    value={n.note}
                    onChange={(e) =>
                      update((s) => ({
                        ...s,
                        notebook: s.notebook.map((item) =>
                          item.sessionId + item.id === key
                            ? { ...item, note: e.target.value }
                            : item,
                        ),
                      }))
                    }
                    placeholder="¿Qué te ayuda a recordar esta frase?"
                  />
                  <p className="small">
                    Se guarda al escribir, solo en este navegador.
                  </p>
                </details>
              </article>
            );
          })}
        </div>
      ) : (
        <EmptyState
          title={
            state.notebook.length
              ? "Aquí no hay repasos por ahora."
              : "Tu cuaderno empieza con una conversación."
          }
          description={
            state.notebook.length
              ? "Cambia el filtro para ver tus otras expresiones."
              : "Completa una práctica y guarda una corrección. Aquí podrás retomarla cuando quieras."
          }
          action="Elegir una conversación"
          to="/app/conversaciones"
        />
      )}
      <Dialog
        open={!!deleteKey}
        onClose={() => setDeleteKey("")}
        title="¿Eliminar este repaso?"
      >
        <p>
          Tu sesión original seguirá en el historial. Esta nota se quitará del
          cuaderno.
        </p>
        <div className="dialog-actions">
          <button
            className="button button-outline"
            onClick={() => setDeleteKey("")}
          >
            Conservar
          </button>
          <button
            className="button"
            onClick={() => {
              update((s) => ({
                ...s,
                notebook: s.notebook.filter(
                  (n) => n.sessionId + n.id !== deleteKey,
                ),
              }));
              setDeleteKey("");
            }}
          >
            Eliminar repaso
          </button>
        </div>
      </Dialog>
    </>
  );
}
export function TrainingPage() {
  const { state } = useStore();
  const names = [
    "Empezar a conocerte",
    "Contar lo que viviste",
    "Decir lo que piensas",
    "Resolver lo cotidiano",
  ];
  return (
    <>
      <PageHeading
        title={
          <>
            Un hábito pequeño.
            <br />
            <em>Un mundo más grande.</em>
          </>
        }
      >
        Tu ruta de vida cotidiana. Cuatro semanas para organizar la práctica,
        sin promesas de alcanzar un nivel.
      </PageHeading>
      <div className="training-list">
        {names.map((name, i) => {
          const list = scenarios.filter((s) => s.week === i + 1);
          const completed = list.filter((s) =>
            state.sessions.some(
              (item) => item.scenarioId === s.id && item.completedAt,
            ),
          ).length;
          return (
            <section className="training-unit" key={name}>
              <div className="training-week">
                Semana <strong>{String(i + 1).padStart(2, "0")}</strong>
              </div>
              <div>
                <h2>{name}</h2>
                <p>
                  {list.length} situaciones · Preparación, conversación y repaso
                </p>
                <div className="unit-topics">
                  {list.slice(0, 3).map((s) => (
                    <Link key={s.id} to={`/app/conversaciones/${s.id}`}>
                      {s.title}
                      <ArrowUpRight size={14} />
                    </Link>
                  ))}
                </div>
                <span className="small">
                  {completed} de {list.length} situaciones practicadas.
                  Practicar no equivale a dominar.
                </span>
              </div>
              <Link
                className="button button-outline"
                to={`/app/conversaciones?semana=${i + 1}`}
              >
                Explorar semana
                <ArrowRight size={18} />
              </Link>
            </section>
          );
        })}
      </div>
    </>
  );
}
export function ProgressPage() {
  const { state } = useStore();
  const completed = state.sessions.filter((s) => s.completedAt);
  const minutes =
    state.sessions.reduce((sum, s) => sum + s.voiceSeconds, 0) / 60;
  const practiced = state.notebook.filter((n) => n.practiced).length;
  return (
    <>
      <PageHeading
        title={
          <>
            Tu voz tiene
            <br />
            <em>su propio ritmo.</em>
          </>
        }
      >
        Mira lo que ya hiciste. El avance se construye con tus propias
        conversaciones.
      </PageHeading>
      {!completed.length ? (
        <EmptyState
          title="Tu progreso empieza con un intento."
          description="Completa una práctica para ver tus conversaciones, correcciones y repasos. Aquí no inventamos una puntuación de fluidez."
          action="Comenzar mi primera práctica"
          to="/app/conversaciones/fin-de-semana"
        />
      ) : (
        <>
          <div className="progress-stats">
            <div>
              <span>Conversaciones completadas</span>
              <strong>{completed.length}</strong>
              <p>Una oportunidad de expresarte cada vez.</p>
            </div>
            <div>
              <span>Minutos de tu voz</span>
              <strong>{minutes.toFixed(1)}</strong>
              <p>Audio grabado por ti en este dispositivo.</p>
            </div>
            <div>
              <span>Repasos practicados</span>
              <strong>{practiced}</strong>
              <p>Frases que volviste a intentar.</p>
            </div>
          </div>
          <div className="progress-evidence">
            <section>
              <h2>Cada conversación cuenta.</h2>
              <p>
                Estas son tus prácticas guardadas, no una medida global de tu
                inglés.
              </p>
              {[...completed].reverse().map((s) => (
                <Link
                  className="history-row"
                  key={s.id}
                  to={`/app/revision/${s.id}`}
                >
                  <span className="scenario-glyph">
                    <MessageCircle size={21} />
                  </span>
                  <div>
                    <strong>{scenarioById(s.scenarioId).title}</strong>
                    <span>
                      {formatDate(s.completedAt!)} ·{" "}
                      {s.turns.filter((t) => t.role === "user").length}{" "}
                      respuestas escritas · {s.hints} pistas
                    </span>
                  </div>
                  <ArrowUpRight size={19} />
                </Link>
              ))}
            </section>
            <aside className="progress-reflection">
              <Bookmark size={27} strokeWidth={1} />
              <h2>
                No todo avance
                <br />
                <em>es un número.</em>
              </h2>
              <p>
                ¿Pudiste contar algo que antes te costaba? ¿Necesitaste menos
                ayuda en una situación parecida?
              </p>
              <p>
                Con pocas prácticas mostramos evidencia individual. Las
                comparaciones necesitan tareas y dificultades equivalentes.
              </p>
              <Link className="arrow-link" to="/app/repasar">
                Retomar una expresión
                <ArrowUpRight size={18} />
              </Link>
            </aside>
          </div>
        </>
      )}
      <p className="content-disclaimer">
        Esta demo registra actividad local. No estima un nivel, certificación o
        porcentaje de fluidez.
      </p>
    </>
  );
}
function RecordingRow({ recording }: { recording: Recording }) {
  const { update } = useStore();
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");
  useEffect(() => {
    let alive = true;
    let objectURL = "";
    getRecording(recording.id)
      .then((blob) => {
        if (!alive) return;
        if (!blob) {
          setError(
            "La grabación ya no está en el almacenamiento de este navegador.",
          );
          return;
        }
        objectURL = URL.createObjectURL(blob);
        setUrl(objectURL);
      })
      .catch(() =>
        setError(
          "No pudimos abrir el audio. Puedes eliminar esta referencia y volver a grabar.",
        ),
      );
    return () => {
      alive = false;
      if (objectURL) URL.revokeObjectURL(objectURL);
    };
  }, [recording.id]);
  return (
    <div className="saved-recording">
      <div>
        <strong>{recording.name}</strong>
        <span>
          {formatDate(recording.createdAt)} · {recording.seconds} segundos
        </span>
      </div>
      {url && (
        <audio
          controls
          src={url}
          aria-label={`Escuchar grabación: ${recording.name}`}
        />
      )}
      {error && (
        <p role="status" className="small">
          {error}
        </p>
      )}
      <button
        className="icon-button"
        aria-label={`Eliminar grabación: ${recording.name}`}
        onClick={async () => {
          try {
            await deleteRecording(recording.id);
            update((s) => ({
              ...s,
              recordings: s.recordings.filter((r) => r.id !== recording.id),
            }));
          } catch {
            setError(
              "No se pudo eliminar el audio. Reintenta o borra los datos del sitio desde el navegador.",
            );
          }
        }}
      >
        <Trash2 size={18} />
      </button>
    </div>
  );
}
export function AccountPage() {
  const { state, update, reset, storageError } = useStore();
  const navigate = useNavigate();
  const [resetOpen, setResetOpen] = useState(false);
  const [checkout, setCheckout] = useState(false);
  const [terms, setTerms] = useState(false);
  const [privacy, setPrivacy] = useState(false);
  const [result, setResult] = useState("confirmed");
  const [payment, setPayment] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const activate = () => {
    if (!terms || !privacy) {
      setError("Revisa los dos documentos y marca cada casilla por separado.");
      return;
    }
    setCheckout(false);
    setPayment(result);
    if (result === "confirmed") {
      update((s) => ({ ...s, plan: "monthly", renewal: true }));
      setNotice("Plan de ejemplo activado. No se ha realizado ningún cobro.");
    }
  };
  return (
    <>
      <PageHeading
        title={
          <>
            Tu espacio.
            <br />
            <em>Tus decisiones.</em>
          </>
        }
      >
        Preferencias, datos y plan de demostración. Todo a tu alcance.
      </PageHeading>
      <div className="account-grid">
        <section className="account-section">
          <div className="section-title-row">
            <h2>Hecho a tu manera.</h2>
            <Settings2 size={22} strokeWidth={1.5} />
          </div>
          <label htmlFor="account-name">
            Tu nombre o apodo <span className="optional">Opcional</span>
          </label>
          <input
            id="account-name"
            value={state.name}
            maxLength={32}
            onChange={(e) => update((s) => ({ ...s, name: e.target.value }))}
          />
          <div className="account-form-grid">
            <label>
              Tu rutina
              <select
                value={state.onboarding.minutes}
                onChange={(e) =>
                  update((s) => ({
                    ...s,
                    onboarding: {
                      ...s.onboarding,
                      minutes: Number(e.target.value),
                    },
                  }))
                }
              >
                {[5, 10, 15].map((n) => (
                  <option value={n} key={n}>
                    {n} minutos
                  </option>
                ))}
              </select>
            </label>
            <label>
              Velocidad de voz
              <select
                value={state.speed}
                onChange={(e) =>
                  update((s) => ({ ...s, speed: Number(e.target.value) }))
                }
              >
                <option value="0.75">Más pausada</option>
                <option value="1">Natural</option>
                <option value="1.25">Más rápida</option>
              </select>
            </label>
          </div>
          <p className="small">
            Meta actual: Vida cotidiana. Trabajo y Viajes llegarán más adelante.
          </p>
          <p className="field-help">
            Las preferencias se guardan al cambiarlas en este navegador.
          </p>
          <Link className="text-button" to="/configuracion">
            Revisar mi configuración
            <ArrowUpRight size={17} />
          </Link>
        </section>
        <section className="account-section subscription-section">
          <span className="tag">Simulación · Sin cargos</span>
          <h2>
            {state.plan === "monthly"
              ? "Práctica mensual."
              : "Tu primer paso es gratis."}
          </h2>
          <p>
            {state.plan === "monthly"
              ? "Plan de ejemplo activo en este navegador."
              : "Puedes explorar todos los recorridos de esta demo."}
          </p>
          {state.plan === "monthly" ? (
            <>
              <div className="account-plan-price">
                180<span>minutos ilustrativos por ciclo</span>
              </div>
              <p>
                No hay consumo, cobros o renovación real. La oferta propuesta es
                299 MXN al mes; precio e impuestos pendientes de aprobación.
              </p>
              <button
                className="button button-outline"
                onClick={() => {
                  update((s) => ({ ...s, renewal: !s.renewal }));
                  setNotice((s) =>
                    s
                      ? ""
                      : "Preferencia de renovación de ejemplo actualizada.",
                  );
                }}
              >
                {state.renewal
                  ? "Cancelar renovación de ejemplo"
                  : "Reactivar renovación de ejemplo"}
              </button>
              <p role="status" className="small">
                {state.renewal
                  ? "Renovación simulada activada."
                  : "Renovación simulada cancelada. El plan de ejemplo continúa disponible."}
              </p>
            </>
          ) : (
            <>
              <div className="account-plan-price">
                $299<span>MXN / mes · Propuesta</span>
              </div>
              <p>
                180 minutos por ciclo, biblioteca, cuaderno y repasos. Sin
                acumulación de minutos en la propuesta.
              </p>
              <button
                className="button"
                onClick={() => {
                  setTerms(false);
                  setPrivacy(false);
                  setError("");
                  setCheckout(true);
                }}
              >
                Explorar activación de ejemplo
                <ArrowRight size={18} />
              </button>
            </>
          )}
          {payment === "pending" && (
            <div className="notice payment-notice">
              <p>
                Confirmación de ejemplo pendiente. No se activó el plan y no
                hace falta volver a pagar.
              </p>
              <button
                className="text-button"
                onClick={() => {
                  setPayment("confirmed");
                  update((s) => ({ ...s, plan: "monthly", renewal: true }));
                  setNotice(
                    "Confirmación de ejemplo recibida. Sin cobros reales.",
                  );
                }}
              >
                Comprobar estado de ejemplo
              </button>
            </div>
          )}
          {payment === "failed" && (
            <p className="form-error" role="alert">
              El pago de ejemplo falló. No se activó el plan ni se realizó
              ningún cobro. Puedes abrir de nuevo la simulación.
            </p>
          )}
        </section>
      </div>
      {notice && (
        <p className="account-notice" role="status">
          <Check size={18} />
          {notice}
        </p>
      )}
      <section className="account-section recordings-section">
        <div className="section-title-row">
          <div>
            <h2>Tu voz, en tus manos.</h2>
            <p>
              Solo aparecen los audios que elegiste guardar en este dispositivo.
            </p>
          </div>
          <ShieldCheck size={24} strokeWidth={1.5} />
        </div>
        {state.recordings.length ? (
          state.recordings.map((recording) => (
            <RecordingRow key={recording.id} recording={recording} />
          ))
        ) : (
          <p className="quiet-inline">
            No has guardado grabaciones. Puedes practicar por escrito o escuchar
            un audio sin conservarlo.
          </p>
        )}
      </section>
      <section className="account-section data-section">
        <h2>Tu información te pertenece.</h2>
        <p>
          El avance y los textos de esta demo viven en este navegador.
          Exportarlos no incluye los archivos de audio.
        </p>
        <div className="inline-actions">
          <button
            className="button button-outline"
            onClick={() => downloadData(state)}
          >
            <Download size={18} />
            Exportar mis datos
          </button>
          <button
            className="text-button danger-text"
            onClick={() => setResetOpen(true)}
          >
            <Trash2 size={17} />
            Borrar todos los datos de esta demo
          </button>
          <button
            className="text-button"
            onClick={() => {
              update((s) => ({ ...s, entered: false }));
              navigate("/");
            }}
          >
            <LogOut size={17} />
            Salir de la demo
          </button>
        </div>
        {storageError && (
          <p className="form-error" role="alert">
            {storageError}
          </p>
        )}
        <div className="legal-crosslinks">
          <Link to="/terminos">Términos y condiciones</Link>
          <Link to="/privacidad">Política de privacidad</Link>
          <Link to="/cookies">Cookies y almacenamiento</Link>
        </div>
      </section>
      <details className="qa-controls">
        <summary>Explorar los estados de la demo</summary>
        <p>
          Para revisar la recuperación de errores, puedes simular un fallo en el
          siguiente envío. El texto quedará disponible para reintentar.
        </p>
        <label className="checkbox-row">
          <input
            type="checkbox"
            checked={state.failNextTurn}
            onChange={(e) =>
              update((s) => ({ ...s, failNextTurn: e.target.checked }))
            }
          />
          Simular un fallo del tutor en el próximo turno
        </label>
      </details>
      <Dialog
        open={resetOpen}
        onClose={() => setResetOpen(false)}
        title="¿Borrar esta historia?"
      >
        <p>
          Eliminarás preferencias, prácticas, notas y audios guardados en este
          navegador. Puedes exportar los textos antes de hacerlo.
        </p>
        <div className="dialog-actions">
          <button
            className="button button-outline"
            onClick={() => setResetOpen(false)}
          >
            Conservar mis datos
          </button>
          <button
            className="button"
            onClick={() => {
              reset();
              navigate("/acceso");
            }}
          >
            Borrar todos mis datos
          </button>
        </div>
      </Dialog>
      <Dialog
        open={checkout}
        onClose={() => setCheckout(false)}
        title="Explora tu práctica mensual."
      >
        <span className="tag">Pago de demostración · No hay cargos</span>
        <p>
          Propuesta: 299 MXN al mes por 180 minutos. Sin acumulación de minutos.
          Precio total, impuestos y condiciones comerciales pendientes de
          aprobación; no estamos vendiendo una suscripción.
        </p>
        <label>
          Resultado que quieres probar
          <select value={result} onChange={(e) => setResult(e.target.value)}>
            <option value="confirmed">Confirmado</option>
            <option value="pending">Confirmación pendiente</option>
            <option value="failed">Fallido</option>
          </select>
        </label>
        <div className="legal-checkbox">
          <label>
            <input
              type="checkbox"
              checked={terms}
              onChange={(e) => {
                setTerms(e.target.checked);
                setError("");
              }}
            />
            <span>Acepto los Términos y condiciones de la demo.</span>
          </label>
          <Link to="/terminos" target="_blank" rel="noopener noreferrer">
            Leer términos (nueva pestaña)
            <ArrowUpRight size={14} />
          </Link>
        </div>
        <div className="legal-checkbox">
          <label>
            <input
              type="checkbox"
              checked={privacy}
              onChange={(e) => {
                setPrivacy(e.target.checked);
                setError("");
              }}
            />
            <span>He leído la Política de privacidad.</span>
          </label>
          <Link to="/privacidad" target="_blank" rel="noopener noreferrer">
            Leer privacidad (nueva pestaña)
            <ArrowUpRight size={14} />
          </Link>
        </div>
        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}
        <button className="button full-width" onClick={activate}>
          Simular activación
          <Check size={18} />
        </button>
      </Dialog>
    </>
  );
}
