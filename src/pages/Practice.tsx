import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  ArrowLeft,
  Clock3,
  MessageCircle,
  Coffee,
  Bookmark,
  Check,
  Play,
  Pause,
  X,
  Send,
  Lightbulb,
  Languages,
  Volume2,
  Mic,
  Keyboard,
  Flag,
  Plus,
} from "lucide-react";
import { useStore, completeSession } from "../lib/store";
import { scenarios, scenarioById } from "../lib/content";
import {
  Brand,
  Dialog,
  EmptyState,
  PageHeading,
  formatDate,
} from "../components/ui";
import { VoiceRecorder } from "../components/VoiceRecorder";
import { speak, stopSpeech } from "../lib/audio";
import { useSearchParams } from "react-router-dom";
export function DashboardPage() {
  const { state, createSession, saveNote } = useStore();
  const navigate = useNavigate();
  const active = [...state.sessions].reverse().find((s) => !s.completedAt);
  const completed = state.sessions.filter((s) => s.completedAt);
  const last = completed.at(-1);
  const correction = last?.corrections[0];
  const scenario = scenarioById(active?.scenarioId || "fin-de-semana");
  const start = () =>
    navigate(
      `/sesion/${active?.id || createSession(scenario.id, scenario.opening)}`,
    );
  return (
    <>
      <PageHeading
        title={
          <>
            Un poco de práctica.
            <br />
            <em>Mucho por decir.</em>
          </>
        }
        aside={
          <span className="today-date">
            {new Intl.DateTimeFormat("es-MX", {
              day: "numeric",
              month: "long",
            }).format(new Date())}
          </span>
        }
      >
        {state.name ? `Qué bueno verte, ${state.name}.` : "Qué bueno verte."}{" "}
        Vamos con una conversación a tu ritmo.
      </PageHeading>
      <div className="dashboard-grid">
        <section className="recommended-practice">
          <div>
            <span className="category">
              {active ? "DONDE LO DEJASTE" : "TU SIGUIENTE CONVERSACIÓN"}
            </span>
            <h2>{scenario.title}</h2>
            <p>{scenario.objective}</p>
            <div className="practice-meta">
              <span>
                <Clock3 size={16} />
                {scenario.duration} min aprox.
              </span>
              <span>Con apoyo</span>
            </div>
            <button className="button" onClick={start}>
              {active ? "Continuar práctica" : "Comenzar práctica"}
              <ArrowUpRight size={19} />
            </button>
          </div>
          <div className="recommended-quote">
            <MessageCircle size={34} strokeWidth={1} />
            <p>“{scenario.opening}”</p>
            <span>Tu inglés ya tiene algo que contar.</span>
          </div>
        </section>
        <section className="week-summary">
          <h2>
            Tu práctica,
            <br />
            <em>paso a paso.</em>
          </h2>
          <div className="summary-number">
            <strong>{completed.length}</strong>
            <span>conversaciones completadas</span>
          </div>
          <div className="summary-row">
            <Bookmark size={19} />
            <span>
              {state.notebook.filter((n) => !n.practiced).length} repasos
              pendientes
            </span>
          </div>
          <p>El progreso empieza por volver a intentarlo.</p>
          <Link className="arrow-link" to="/app/progreso">
            Ver mi progreso
            <ArrowUpRight size={17} />
          </Link>
        </section>
      </div>
      <div className="dashboard-lower">
        <section>
          <div className="section-title-row">
            <h2>Algo que te llevas.</h2>
            <Link to="/app/repasar">
              Mi cuaderno
              <ArrowUpRight size={16} />
            </Link>
          </div>
          {correction && last ? (
            <div className="last-correction">
              <span className="category">DE TU ÚLTIMA PRÁCTICA</span>
              <p className="correction-preview">{correction.suggested}</p>
              <p>{correction.explanation}</p>
              <button
                className="text-button"
                onClick={() => {
                  saveNote(correction, last.id);
                  navigate("/app/repasar");
                }}
              >
                Guardar y repasar
                <Bookmark size={17} />
              </button>
            </div>
          ) : (
            <div className="quiet-empty">
              <Bookmark size={27} strokeWidth={1} />
              <h3>Tu próxima conversación deja huella.</h3>
              <p>
                Aquí encontrarás una corrección útil cuando termines una
                práctica.
              </p>
            </div>
          )}
        </section>
        <section>
          <div className="section-title-row">
            <h2>Encuentra tu momento.</h2>
          </div>
          <Link className="quick-action" to="/app/conversaciones">
            <MessageCircle size={23} />
            <div>
              <h3>Una situación que te suene a ti</h3>
              <p>Explora las 24 conversaciones de la demo.</p>
            </div>
            <ArrowUpRight size={20} />
          </Link>
          <Link className="quick-action" to="/app/entrenamiento">
            <Coffee size={23} />
            <div>
              <h3>Un pequeño hábito</h3>
              <p>Tu ruta de vida cotidiana, en cuatro semanas.</p>
            </div>
            <ArrowUpRight size={20} />
          </Link>
          {!state.diagnostic.complete && (
            <Link className="quick-action" to="/diagnostico">
              <Lightbulb size={23} />
              <div>
                <h3>Encuentra tu punto de partida</h3>
                <p>Prueba el diagnóstico orientativo de ejemplo.</p>
              </div>
              <ArrowUpRight size={20} />
            </Link>
          )}
        </section>
      </div>
      {completed.length > 0 && (
        <section className="recent-section">
          <div className="section-title-row">
            <h2>Lo que ya practicaste.</h2>
          </div>
          {completed
            .slice(-3)
            .reverse()
            .map((s) => (
              <Link
                className="history-row"
                key={s.id}
                to={`/app/revision/${s.id}`}
              >
                <span className="scenario-glyph">
                  <MessageCircle size={22} />
                </span>
                <div>
                  <strong>{scenarioById(s.scenarioId).title}</strong>
                  <span>
                    {formatDate(s.completedAt!)} ·{" "}
                    {s.turns.filter((t) => t.role === "user").length} turnos por
                    escrito
                  </span>
                </div>
                <span>Ver revisión</span>
                <ArrowUpRight size={18} />
              </Link>
            ))}
        </section>
      )}
    </>
  );
}
export function ConversationsPage() {
  const [params, setParams] = useSearchParams();
  const [query, setQuery] = useState("");
  const [duration, setDuration] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const week = params.get("semana") || "";
  const { state } = useStore();
  const filtered = scenarios.filter(
    (s) =>
      (!query ||
        (s.title + s.category).toLowerCase().includes(query.toLowerCase())) &&
      (!duration || s.duration === Number(duration)) &&
      (!week || s.week === Number(week)) &&
      (!difficulty || difficulty === "Con apoyo"),
  );
  const clear = () => {
    setQuery("");
    setDuration("");
    setDifficulty("");
    setParams({});
  };
  return (
    <>
      <PageHeading
        title={
          <>
            Conversaciones
            <br />
            <em>que se parecen a tu vida.</em>
          </>
        }
      >
        Elige una situación. El siguiente paso es darle tu voz.
      </PageHeading>
      <div className="library-goals">
        <span className="filter-pill selected">Vida cotidiana</span>
        <span className="filter-pill unavailable">Trabajo · Próximamente</span>
        <span className="filter-pill unavailable">Viajes · Próximamente</span>
      </div>
      <div className="library-filters">
        <div className="search-field">
          <MessageCircle size={19} />
          <label className="sr-only" htmlFor="scenario-search">
            Buscar conversaciones
          </label>
          <input
            type="search"
            id="scenario-search"
            placeholder="¿De qué te gustaría hablar?"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <label>
          <span className="sr-only">Duración</span>
          <select
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
          >
            <option value="">Cualquier duración</option>
            <option value="5">5 minutos</option>
            <option value="10">10 minutos</option>
          </select>
        </label>
        <label>
          <span className="sr-only">Dificultad</span>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
          >
            <option value="">Cualquier dificultad</option>
            <option>Con apoyo</option>
            <option>Con menos ayuda</option>
            <option>Con imprevistos</option>
          </select>
        </label>
        <label>
          <span className="sr-only">Semana</span>
          <select
            value={week}
            onChange={(e) =>
              setParams(e.target.value ? { semana: e.target.value } : {})
            }
          >
            <option value="">Todas las semanas</option>
            {[1, 2, 3, 4].map((i) => (
              <option value={i} key={i}>
                Semana {i}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="results-row">
        <span role="status">
          {filtered.length}{" "}
          {filtered.length === 1 ? "situación" : "situaciones"} para practicar
        </span>
        <button className="text-button" onClick={clear}>
          Limpiar filtros
          <X size={15} />
        </button>
      </div>
      {filtered.length ? (
        <div className="scenario-grid">
          {filtered.map((s) => {
            const practiced = state.sessions.some(
              (session) => session.scenarioId === s.id && session.completedAt,
            );
            const active = state.sessions.some(
              (session) => session.scenarioId === s.id && !session.completedAt,
            );
            return (
              <Link
                className="scenario-card"
                key={s.id}
                to={`/app/conversaciones/${s.id}`}
              >
                <div className="scenario-card-top">
                  <span className="scenario-glyph">
                    {s.week === 1 ? (
                      <Coffee size={23} strokeWidth={1.5} />
                    ) : (
                      <MessageCircle size={23} strokeWidth={1.5} />
                    )}
                  </span>
                  <span className="small">
                    {practiced
                      ? "Practicada"
                      : active
                        ? "En curso"
                        : `Semana ${s.week}`}
                  </span>
                </div>
                <span className="category">{s.category}</span>
                <h2>{s.title}</h2>
                <p>{s.objective}</p>
                <div className="scenario-card-bottom">
                  <span>{s.duration} min · Con apoyo</span>
                  <ArrowUpRight size={20} />
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="empty-state">
          <MessageCircle size={36} strokeWidth={1} />
          <h2>No encontramos esa conversación.</h2>
          <p>
            Prueba otra palabra o cambia los filtros. Las situaciones de esta
            demo están disponibles con apoyo.
          </p>
          <button className="button" onClick={clear}>
            Ver todas las situaciones
            <ArrowRight size={18} />
          </button>
        </div>
      )}
      <p className="content-disclaimer">
        Situaciones editoriales de demostración. Pendientes de revisión
        pedagógica antes de ofrecer un servicio real.
      </p>
    </>
  );
}
export function ScenarioDetailPage() {
  const { id } = useParams();
  const s = scenarios.find((s) => s.id === id);
  const { createSession } = useStore();
  const navigate = useNavigate();
  if (!s)
    return (
      <EmptyState
        title="Esta situación no está disponible."
        description="Puedes elegir otra conversación de la biblioteca."
        action="Explorar conversaciones"
        to="/app/conversaciones"
      />
    );
  return (
    <div className="scenario-detail">
      <Link className="text-button" to="/app/conversaciones">
        <ArrowLeft size={17} />
        Todas las conversaciones
      </Link>
      <PageHeading
        title={
          <>
            {s.title}
            <em> Una idea a la vez.</em>
          </>
        }
      >
        Vida cotidiana · {s.category} · Semana {s.week}
      </PageHeading>
      <div className="scenario-detail-grid">
        <section className="scenario-brief">
          <h2>Tu pequeña misión.</h2>
          <p className="large-body">{s.objective}</p>
          <div className="detail-meta">
            <span>
              <Clock3 size={18} />
              {s.duration} minutos aproximadamente
            </span>
            <span>
              <Lightbulb size={18} />
              Con apoyo y pistas disponibles
            </span>
          </div>
          <div className="opening-question">
            <span>Así empieza la conversación</span>
            <p>“{s.opening}”</p>
            <button
              className="text-button"
              onClick={() => speak(s.opening, 0.9)}
            >
              <Play size={16} />
              Escuchar ejemplo
            </button>
          </div>
          <button
            className="button"
            onClick={() =>
              navigate(`/sesion/${createSession(s.id, s.opening)}`)
            }
          >
            Comenzar esta práctica
            <ArrowRight size={18} />
          </button>
          <p className="small">
            Tutor preparado de demostración. Puedes usar texto o grabar tu voz
            localmente.
          </p>
        </section>
        <aside className="expression-prep">
          <h2>
            Unas palabras
            <br />
            <em>para el camino.</em>
          </h2>
          <p>
            No tienes que recordarlas todas. Estarán aquí cuando las necesites.
          </p>
          {s.expressions.map((phrase, i) => (
            <div className="prep-expression" key={phrase}>
              <span>{String(i + 1).padStart(2, "0")}</span>
              <p>{phrase}</p>
              <button
                className="icon-button"
                aria-label={`Escuchar ${phrase}`}
                onClick={() => speak(phrase, 0.9)}
              >
                <Volume2 size={18} />
              </button>
            </div>
          ))}
        </aside>
      </div>
    </div>
  );
}
const spanishQuestions: Record<string, string> = {
  presentarte: "¿Qué disfrutas hacer después de trabajar o estudiar?",
  "fin-de-semana": "¿Qué hiciste el fin de semana pasado?",
  cafe: "¡Hola! ¿Qué te preparo hoy?",
  "conocer-alguien": "¡Hola! ¿Es la primera vez que vienes aquí?",
  rutina: "¿Cómo es una mañana normal para ti?",
  barrio: "¿Qué te gusta de tu barrio?",
  aficiones: "Cuéntame algo que te encanta hacer.",
  pelicula: "¿Has visto algo bueno últimamente?",
  comida: "Cuéntame sobre una comida que hayas disfrutado.",
  sorpresa: "¿Pasó algo sorprendente esta semana?",
  recuerdo: "¿Qué recuerdo feliz te gustaría compartir?",
  aprender: "¿Qué has aprendido recientemente?",
  "elegir-plan": "¿Prefieres salir o quedarte en casa esta noche?",
  recomendacion: "¿Qué lugar crees que debería visitar?",
  opinion: "¿Es mejor vivir en una ciudad pequeña o grande?",
  musica: "¿Qué música escuchas y por qué?",
  planes: "¿Qué deberíamos hacer este fin de semana?",
  acuerdo: "Creo que todos deberían aprender a cocinar. ¿Qué opinas?",
  tienda: "¡Hola! ¿Te ayudo a encontrar algo?",
  devolucion: "¡Hola! ¿Hay algún problema con tu pedido?",
  direcciones: "Disculpa, ¿sabes cómo llegar a la biblioteca?",
  cita: "¿Cuándo te gustaría hacer una cita?",
  ayuda: "Parece que estás un poco perdido. ¿Necesitas ayuda?",
  aclarar: "Necesitamos cambiar nuestro plan. ¿Te parece bien?",
};
export function SessionPage() {
  const { id } = useParams();
  const { state, update } = useStore();
  const navigate = useNavigate();
  const session = state.sessions.find((s) => s.id === id);
  const [draft, setDraft] = useState("");
  const [paused, setPaused] = useState(false);
  const [voice, setVoice] = useState(false);
  const [exitOpen, setExitOpen] = useState(false);
  const [error, setError] = useState("");
  const [translation, setTranslation] = useState(false);
  const [hint, setHint] = useState(0);
  const [showHelp, setShowHelp] = useState(false);
  const messages = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (messages.current)
      messages.current.scrollTop = messages.current.scrollHeight;
  }, [session?.turns.length]);
  useEffect(() => {
    const onHidden = () => {
      if (document.hidden) {
        stopSpeech();
        setPaused(true);
      }
    };
    document.addEventListener("visibilitychange", onHidden);
    return () => {
      document.removeEventListener("visibilitychange", onHidden);
      stopSpeech();
    };
  }, []);
  if (!session)
    return (
      <div className="session-not-found">
        <Brand />
        <EmptyState
          title="No encontramos esta práctica."
          description="Tus conversaciones guardadas están en tu espacio de práctica."
          action="Volver a Hoy"
          to="/app"
        />
      </div>
    );
  const scenario = scenarioById(session.scenarioId);
  const userTurns = session.turns.filter((t) => t.role === "user");
  const lastTutor =
    [...session.turns].reverse().find((t) => t.role === "tutor")?.text ||
    scenario.opening;
  const send = () => {
    if (!draft.trim() || paused) return;
    if (state.failNextTurn) {
      update((s) => ({ ...s, failNextTurn: false }));
      setError(
        "Fallo de conexión simulado. Tu respuesta sigue aquí. Pulsa Enviar para reintentar; este turno aún no se ha guardado.",
      );
      return;
    }
    const at = new Date().toISOString();
    const nextQuestion =
      scenario.followups[
        Math.min(userTurns.length, scenario.followups.length - 1)
      ];
    const text = draft.trim();
    update((s) => ({
      ...s,
      sessions: s.sessions.map((session) =>
        session.id === id
          ? {
              ...session,
              turns: [
                ...session.turns,
                { id: crypto.randomUUID(), role: "user", text, at },
                {
                  id: crypto.randomUUID(),
                  role: "tutor",
                  text: nextQuestion,
                  at,
                },
              ],
            }
          : session,
      ),
    }));
    setDraft("");
    setError("");
    setTranslation(false);
  };
  const finish = () => {
    stopSpeech();
    update((s) => ({
      ...s,
      sessions: s.sessions.map((item) =>
        item.id === id ? completeSession(item) : item,
      ),
    }));
    navigate(`/app/revision/${id}`);
  };
  const translated =
    userTurns.length === 0
      ? spanishQuestions[scenario.id]
      : userTurns.length === 1
        ? "¿Puedes contarme un poco más sobre eso?"
        : userTurns.length === 2
          ? "¿Qué disfrutaste más? También puedes hacerme una pregunta."
          : "¡Gracias por compartir! Tómate tu tiempo para terminar la idea.";
  return (
    <div className="session-page">
      <header className="session-header">
        <Brand inverse />
        <div>
          <span>Vida cotidiana · Con apoyo</span>
          <h1 tabIndex={-1}>{scenario.title}</h1>
        </div>
        <button
          type="button"
          className="session-exit"
          onClick={() => {
            stopSpeech();
            setPaused(true);
            setExitOpen(true);
          }}
        >
          Salir
          <X size={18} />
        </button>
      </header>
      <main className="session-body">
        <section className="conversation-area">
          <div className="session-status">
            <span className="tag tag-dark">
              Tutor de ejemplo · Preguntas preparadas
            </span>
            <span>{paused ? "Práctica en pausa" : "A tu ritmo"}</span>
          </div>
          <div
            className="chat-scroll"
            ref={messages}
            aria-label="Conversación guardada"
            role="log"
            aria-live="polite"
          >
            {session.turns.map((turn) => (
              <div className={`chat-message ${turn.role}`} key={turn.id}>
                <span>
                  {turn.role === "tutor"
                    ? "VERVO · Ejemplo"
                    : "Tú · Por escrito"}
                </span>
                <p>{turn.text}</p>
              </div>
            ))}
            {paused && (
              <div className="pause-message">
                <Pause size={25} />
                <p>Tu práctica está en pausa.</p>
                <span>
                  Los turnos enviados ya están guardados. Puedes continuar
                  cuando quieras.
                </span>
              </div>
            )}
          </div>
          {translation && (
            <div className="translation" role="status">
              {translated}
            </div>
          )}
          <div className="turn-utilities">
            <button
              className="text-button"
              type="button"
              onClick={() => speak(lastTutor, state.speed)}
              disabled={paused}
            >
              <Volume2 size={17} />
              Escuchar otra vez
            </button>
            <button
              className="text-button"
              type="button"
              aria-pressed={translation}
              onClick={() => setTranslation(!translation)}
            >
              <Languages size={17} />
              {translation ? "Ocultar traducción" : "Mostrar traducción"}
            </button>
            <button
              className="text-button mobile-help-toggle"
              type="button"
              onClick={() => setShowHelp(!showHelp)}
            >
              <Lightbulb size={17} />
              Ayudas
            </button>
          </div>
          <div className="session-composer">
            <div
              className="mode-tabs"
              role="group"
              aria-label="Modo de práctica"
            >
              <button
                type="button"
                className={!voice ? "active" : ""}
                aria-pressed={!voice}
                onClick={() => setVoice(false)}
              >
                <Keyboard size={17} />
                Por escrito
              </button>
              <button
                type="button"
                className={voice ? "active" : ""}
                aria-pressed={voice}
                onClick={() => setVoice(true)}
              >
                <Mic size={17} />
                Con mi voz
              </button>
            </div>
            {voice && !paused && (
              <>
                <VoiceRecorder
                  title={scenario.title}
                  onSeconds={(seconds) =>
                    update((s) => ({
                      ...s,
                      sessions: s.sessions.map((item) =>
                        item.id === id
                          ? {
                              ...item,
                              voiceSeconds: item.voiceSeconds + seconds,
                            }
                          : item,
                      ),
                    }))
                  }
                />
                <p className="small recording-demo-note">
                  Escucha tu grabación y escribe también lo que dijiste. Esta
                  demo no transcribe ni analiza audio.
                </p>
              </>
            )}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                send();
              }}
            >
              <label htmlFor="session-answer">
                {voice ? "El texto de tu respuesta" : "Tu respuesta en inglés"}
              </label>
              <div className="composer-input">
                <textarea
                  id="session-answer"
                  value={draft}
                  disabled={paused}
                  onChange={(e) => {
                    setDraft(e.target.value);
                    setError("");
                  }}
                  maxLength={2000}
                  rows={2}
                  placeholder={
                    paused
                      ? "Continúa la práctica para responder…"
                      : "Tómate tu tiempo. Tu idea vale la pena…"
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                      e.preventDefault();
                      send();
                    }
                  }}
                />
                <button
                  className="send-button"
                  disabled={!draft.trim() || paused}
                  type="submit"
                  aria-label="Enviar respuesta"
                >
                  <Send size={20} />
                </button>
              </div>
            </form>
            {error && (
              <p role="alert" className="form-error">
                {error}
              </p>
            )}
            <div className="composer-bottom">
              <button
                type="button"
                className="text-button"
                disabled={paused}
                onClick={() => setDraft("Yesterday I go to the cinema.")}
              >
                Usar una respuesta de ejemplo
              </button>
              {draft && (
                <button
                  className="text-button"
                  type="button"
                  onClick={() => setDraft("")}
                >
                  Descartar texto
                </button>
              )}
              <span>Ctrl/⌘ + Enter para enviar</span>
            </div>
          </div>
          <div className="session-bottom-controls">
            <button
              className="button button-session-outline"
              type="button"
              onClick={() => {
                stopSpeech();
                setPaused(!paused);
              }}
            >
              {paused ? <Play size={17} /> : <Pause size={17} />}
              {paused ? "Continuar" : "Pausar"}
            </button>
            <span>
              {userTurns.length}{" "}
              {userTurns.length === 1 ? "turno guardado" : "turnos guardados"}
            </span>
            <button
              className="button button-session"
              type="button"
              disabled={!userTurns.length}
              onClick={finish}
            >
              Terminar y revisar
              <ArrowRight size={18} />
            </button>
          </div>
          {!userTurns.length && (
            <p className="small finish-help">
              Envía al menos una respuesta para abrir tu revisión.
            </p>
          )}
        </section>
        <aside
          className={`session-context ${showHelp ? "show-mobile-help" : ""}`}
        >
          <div className="session-objective">
            <span className="category">TU PEQUEÑA MISIÓN</span>
            <h2>
              Una idea.
              <br />
              <em>Un paso más.</em>
            </h2>
            <p>{scenario.objective}</p>
          </div>
          <section className="session-hints">
            <div className="section-title-row">
              <h2>Si te faltan palabras.</h2>
              <Lightbulb size={20} />
            </div>
            <p>No hace falta resolverlo todo sin ayuda.</p>
            {hint > 0 && (
              <div className="hint-content" role="status">
                {hint === 1
                  ? "Empieza con una idea sencilla. Cuenta algo concreto y pregunta por la otra persona."
                  : hint === 2
                    ? `Puedes apoyarte en: ${scenario.expressions.slice(0, 2).join(" / ")}`
                    : "Una respuesta de ejemplo: “Yesterday I went to the cinema. What did you do?”"}
              </div>
            )}
            <button
              type="button"
              className="button button-session-outline full-width"
              onClick={() => {
                setHint(Math.min(3, hint + 1));
                update((s) => ({
                  ...s,
                  sessions: s.sessions.map((item) =>
                    item.id === id ? { ...item, hints: item.hints + 1 } : item,
                  ),
                }));
              }}
              disabled={hint === 3}
            >
              {hint === 3
                ? "Todas las pistas visibles"
                : hint
                  ? "Dame otra pista"
                  : "Pedir una pista"}
              <Plus size={16} />
            </button>
          </section>
          <section className="session-expressions">
            <h2>Unas expresiones útiles.</h2>
            {scenario.expressions.map((phrase) => (
              <button
                type="button"
                key={phrase}
                onClick={() => speak(phrase, state.speed)}
              >
                {phrase}
                <Volume2 size={16} />
              </button>
            ))}
          </section>
          <p className="session-demo-disclaimer">
            Estás practicando con una conversación preparada. Las correcciones
            de esta demo utilizan algunas reglas de ejemplo.
          </p>
        </aside>
      </main>
      <Dialog
        open={exitOpen}
        onClose={() => setExitOpen(false)}
        title="Tu práctica puede esperar."
      >
        <p>
          Conservaremos los turnos que ya enviaste. El texto sin enviar y el
          audio sin guardar solo viven en esta pestaña.
        </p>
        <div className="dialog-actions">
          <button
            className="button button-outline"
            onClick={() => {
              setExitOpen(false);
              setPaused(false);
            }}
          >
            Seguir practicando
          </button>
          <button className="button" onClick={() => navigate("/app")}>
            Guardar y salir
          </button>
        </div>
      </Dialog>
    </div>
  );
}
export function PracticeExercise({
  target,
  suggested,
  onSuccess,
}: {
  target: string;
  suggested: string;
  onSuccess: () => void;
}) {
  const [value, setValue] = useState("");
  const [status, setStatus] = useState("");
  const ref = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    ref.current?.focus({ preventScroll: true });
  }, []);
  const check = () => {
    if (
      value.trim().split(/\s+/).length < 4 ||
      !value.toLowerCase().includes(target.toLowerCase())
    )
      setStatus(
        `Escribe una frase de al menos cuatro palabras que incluya “${target}”. Puedes apoyarte en el ejemplo.`,
      );
    else {
      onSuccess();
      setStatus(
        "Ejercicio de ejemplo completado. Guardamos que practicaste esta frase; no es una evaluación de dominio.",
      );
    }
  };
  return (
    <div className="practice-exercise">
      <h3>Hagamos que se quede.</h3>
      <p>
        Cuenta algo de tu vida usando <strong>{target}</strong>. Escribe una
        frase de al menos cuatro palabras.
      </p>
      <p className="exercise-example">Por ejemplo: {suggested}</p>
      <label htmlFor="practice-phrase">Tu nuevo intento</label>
      <textarea
        ref={ref}
        id="practice-phrase"
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          setStatus("");
        }}
        maxLength={2000}
        placeholder="Esta vez puedes decir…"
      />
      <button className="button" onClick={check}>
        Comprobar mi frase
        <Check size={18} />
      </button>
      {status && (
        <p role="status" className="exercise-status">
          {status}
        </p>
      )}
    </div>
  );
}
export function ReviewPage() {
  const { id } = useParams();
  const { state, saveNote, update } = useStore();
  const session = state.sessions.find((s) => s.id === id);
  const [practicing, setPracticing] = useState("");
  const [report, setReport] = useState(false);
  const [reportText, setReportText] = useState("");
  const [reported, setReported] = useState(false);
  if (!session?.completedAt)
    return (
      <EmptyState
        title="Tu revisión todavía no está lista."
        description="Termina una práctica después de enviar al menos una respuesta para revisar tu intento."
        action="Volver a mis conversaciones"
        to="/app/conversaciones"
      />
    );
  return (
    <>
      <Link className="text-button" to="/app">
        <ArrowLeft size={17} />
        Volver a mi espacio
      </Link>
      <PageHeading
        title={
          <>
            Esto ya lo
            <br />
            <em>pudiste expresar.</em>
          </>
        }
      >
        {scenarioById(session.scenarioId).title} ·{" "}
        {formatDate(session.completedAt)}
      </PageHeading>
      <section className="review-achievement">
        <span className="achievement-check">
          <Check size={27} />
        </span>
        <div>
          <h2>Le diste forma a una idea.</h2>
          <p>
            Compartiste {session.turns.filter((t) => t.role === "user").length}{" "}
            {session.turns.filter((t) => t.role === "user").length === 1
              ? "respuesta"
              : "respuestas"}{" "}
            en inglés. Ahora tienes un intento al que puedes volver.
          </p>
        </div>
        <span className="tag">Por escrito</span>
      </section>
      <div className="section-title-row review-section-title">
        <h2>Una cosa más clara para la próxima.</h2>
        <span className="small">Correcciones de ejemplo</span>
      </div>
      {session.corrections.length ? (
        session.corrections.map((c) => {
          const saved = state.notebook.some(
            (n) => n.id === c.id && n.sessionId === session.id,
          );
          return (
            <article className="review-correction" key={c.id}>
              <div className="review-correction-heading">
                <span className="tag">{c.type}</span>
                <span>{c.skill}</span>
              </div>
              <div className="correction-comparison">
                <div>
                  <span className="category">DIJISTE</span>
                  <p>{c.original}</p>
                </div>
                <ArrowRight size={23} />
                <div>
                  <span className="category">PUEDES DECIR</span>
                  <p>{c.suggested}</p>
                </div>
              </div>
              <p className="correction-reason">
                <Lightbulb size={19} />
                {c.explanation}
              </p>
              <div className="inline-actions">
                <button
                  className="button"
                  onClick={() => setPracticing(practicing === c.id ? "" : c.id)}
                >
                  Practicar esta frase
                  <ArrowRight size={18} />
                </button>
                <button
                  className="text-button"
                  disabled={saved}
                  onClick={() => saveNote(c, session.id)}
                >
                  {saved ? <Check size={17} /> : <Bookmark size={17} />}
                  {saved ? "Guardada para repasar" : "Guardar para repasar"}
                </button>
                <button
                  className="text-button"
                  onClick={() => speak(c.suggested, state.speed)}
                >
                  <Volume2 size={17} />
                  Escuchar
                </button>
              </div>
              {practicing === c.id && (
                <PracticeExercise
                  target={c.target}
                  suggested={c.suggested}
                  onSuccess={() => {
                    saveNote(c, session.id);
                    update((s) => ({
                      ...s,
                      notebook: s.notebook.map((n) =>
                        n.id === c.id && n.sessionId === session.id
                          ? { ...n, practiced: true }
                          : n,
                      ),
                    }));
                  }}
                />
              )}
            </article>
          );
        })
      ) : (
        <div className="quiet-empty">
          <h3>Este intento no coincide con las reglas de muestra.</h3>
          <p>
            Esta demo reconoce algunas frases como “Yesterday I go…” e “I am
            agree”. No haber marcado un error no significa que tu respuesta haya
            sido evaluada como correcta.
          </p>
          <Link className="arrow-link" to="/app/conversaciones/fin-de-semana">
            Probar el ejemplo del pasado
            <ArrowUpRight size={18} />
          </Link>
        </div>
      )}
      <button
        className="text-button report-button"
        onClick={() => setReport(true)}
      >
        <Flag size={16} />
        Señalar un problema con esta revisión
      </button>
      {reported && (
        <p role="status">
          Comentario guardado como borrador local. No se ha enviado a un equipo
          de soporte.
        </p>
      )}
      <section className="review-close">
        <div>
          <h2>
            Lo dejamos aquí.
            <br />
            <em>Lo retomamos contigo.</em>
          </h2>
          <p>
            La próxima vez puedes practicar cómo hacer una pregunta de
            seguimiento.
          </p>
        </div>
        <div>
          <Link className="button" to="/app">
            Terminar por hoy
            <Check size={18} />
          </Link>
          <Link className="text-button" to="/app/conversaciones">
            Seguir practicando
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>
      <Dialog
        open={report}
        onClose={() => setReport(false)}
        title="Tu criterio también cuenta."
      >
        <p>
          Cuéntanos qué te parece incorrecto. La demo lo guarda como borrador
          local, sin enviar mensajes.
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            update((s) => ({
              ...s,
              supportDraft: `Revisión ${session.id}: ${reportText}`,
            }));
            setReport(false);
            setReported(true);
          }}
        >
          <label htmlFor="review-report">Tu observación</label>
          <textarea
            id="review-report"
            required
            value={reportText}
            maxLength={2000}
            onChange={(e) => setReportText(e.target.value)}
          />
          <button className="button" type="submit">
            Guardar comentario
            <Bookmark size={18} />
          </button>
        </form>
      </Dialog>
    </>
  );
}
