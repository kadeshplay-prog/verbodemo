import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  Play,
  Pause,
  Check,
  AudioLines,
  MessageCircle,
  Coffee,
  BriefcaseBusiness,
  Luggage,
  Headphones,
  Bookmark,
  ShieldCheck,
  Clock3,
} from "lucide-react";
import { MethodStory } from "../components/MethodStory";
import { PageHeading } from "../components/ui";
import { useStore } from "../lib/store";
import { faqs } from "../lib/content";
import { speak, stopSpeech } from "../lib/audio";
function AudioExample({ text, label }: { text: string; label: string }) {
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState("");
  return (
    <div className="audio-example">
      <button
        type="button"
        className="round-play"
        aria-label={playing ? `Pausar ${label}` : `Escuchar ${label}`}
        onClick={() => {
          if (playing) {
            stopSpeech();
            setPlaying(false);
          } else {
            setPlaying(true);
            if (!speak(text, 0.9, () => setPlaying(false)))
              setError(
                "Tu navegador no ofrece voz. Puedes leer el ejemplo completo.",
              );
          }
        }}
      >
        {playing ? (
          <Pause size={18} fill="currentColor" />
        ) : (
          <Play size={18} fill="currentColor" />
        )}
      </button>
      <div>
        <strong>{label}</strong>
        <p>{text}</p>
        {error && (
          <span className="form-error" role="status">
            {error}
          </span>
        )}
      </div>
      <AudioLines size={40} strokeWidth={1} className="example-wave" />
    </div>
  );
}
function HeroArt() {
  const [playing, setPlaying] = useState(false);
  return (
    <div
      className="hero-art"
      aria-label="Vista de una conversación y una corrección de demostración"
    >
      <div className="artifact conversation-artifact">
        <div className="artifact-top">
          <span className="tag">Sesión de ejemplo</span>
          <AudioLines size={22} />
        </div>
        <div className="conversation-art-title">
          Una conversación.
          <br />
          <em>Un buen comienzo.</em>
        </div>
        <p className="artifact-prompt">
          “What do you enjoy doing
          <br />
          after work or school?”
        </p>
        <div className="hero-wave" aria-hidden="true">
          {[
            8, 16, 24, 40, 52, 32, 64, 76, 50, 90, 66, 38, 54, 32, 20, 28, 12,
          ].map((h, i) => (
            <i key={i} style={{ height: h }} />
          ))}
        </div>
        <div className="artifact-bottom">
          <span>Tu espacio para intentarlo.</span>
          <button
            className="round-play"
            type="button"
            aria-label={playing ? "Pausar ejemplo" : "Escuchar ejemplo"}
            onClick={() => {
              if (playing) {
                stopSpeech();
                setPlaying(false);
              } else {
                setPlaying(true);
                speak(
                  "What do you enjoy doing after work or school?",
                  0.9,
                  () => setPlaying(false),
                );
              }
            }}
          >
            {playing ? (
              <Pause size={18} fill="currentColor" />
            ) : (
              <Play size={18} fill="currentColor" />
            )}
          </button>
        </div>
      </div>
      <div className="artifact correction-artifact">
        <div className="artifact-top">
          <span>UNA CORRECCIÓN ÚTIL</span>
          <span className="circle-check">
            <Check size={15} />
          </span>
        </div>
        <p>
          Yesterday I <s>go</s> <span className="corrected-word">went</span>
          <br />
          to the cinema.
        </p>
        <span className="small">Tu idea. Un poco más clara.</span>
      </div>
      <div className="artifact little-artifact">
        <span className="little-artifact-icon">
          <Bookmark size={19} />
        </span>
        <div>
          <strong>Lo practicamos otra vez.</strong>
          <span>Un repaso hecho para ti.</span>
        </div>
        <ArrowUpRight size={17} />
      </div>
      <span className="hero-art-caption">
        Conversación → corrección → repaso
      </span>
    </div>
  );
}
export function Pricing({ compact = false }: { compact?: boolean }) {
  const { state } = useStore();
  const destination = state.entered ? "/app" : "/acceso";
  return (
    <section
      className={`pricing-section container ${compact ? "compact-pricing" : ""}`}
      id="planes"
    >
      <div className="section-heading">
        <h2>
          Un pequeño hábito.
          <br />
          <em>Más posibilidades.</em>
        </h2>
        <p>
          Encuentra un momento para tu inglés.
          <br />
          Nosotros ponemos la conversación.
        </p>
      </div>
      <div className="pricing-grid">
        <article className="price-card">
          <div>
            <h3>Empieza gratis</h3>
            <p>Tu primera oportunidad de decirlo.</p>
          </div>
          <div className="price">
            $0<span>MXN</span>
          </div>
          <ul>
            <li>
              <Check size={18} />
              Diagnóstico orientativo
            </li>
            <li>
              <Check size={18} />
              Dos prácticas guiadas de hasta 5 min
            </li>
            <li>
              <Check size={18} />
              Correcciones y primer repaso
            </li>
            <li>
              <Check size={18} />
              Sin tarjeta
            </li>
          </ul>
          <Link className="button button-outline" to={destination}>
            Probar una conversación
            <ArrowRight size={18} />
          </Link>
        </article>
        <article className="price-card monthly">
          <div className="price-card-heading">
            <div>
              <h3>Práctica mensual</h3>
              <p>Un espacio para seguir avanzando.</p>
            </div>
            <span className="tag">Oferta propuesta</span>
          </div>
          <div className="price">
            $299<span>MXN / mes</span>
          </div>
          <ul>
            <li>
              <Check size={18} />
              180 minutos de conversación por ciclo
            </li>
            <li>
              <Check size={18} />
              Ruta inicial y biblioteca de situaciones
            </li>
            <li>
              <Check size={18} />
              Repasos, cuaderno e historial
            </li>
            <li>
              <Check size={18} />
              Cancela la renovación desde tu cuenta
            </li>
          </ul>
          <Link
            className="button"
            to={state.entered ? "/app/cuenta" : "/acceso"}
          >
            Explorar el plan
            <ArrowRight size={18} />
          </Link>
          <p className="small">
            Precio y minutos ilustrativos, pendientes de aprobación. Sin cobros
            en esta demo. Los minutos del plan propuesto no se acumulan.
          </p>
        </article>
      </div>
    </section>
  );
}
export function HomePage() {
  const { state } = useStore();
  const start = state.entered ? "/app" : "/acceso";
  return (
    <>
      <section className="hero container">
        <div className="hero-grid">
          <div className="hero-copy">
            <h1 tabIndex={-1}>
              Tu inglés.
              <br />
              <em>En voz alta.</em>
            </h1>
            <p>
              Lo entiendes. Ahora, atrévete a decirlo.
              <br />
              Practica conversaciones reales, entiende qué mejorar y vuelve a
              intentarlo.
            </p>
            <div className="hero-actions">
              <Link className="button" to={start}>
                Probar una conversación
                <ArrowUpRight size={19} />
              </Link>
              <Link className="button button-outline" to="/#metodo">
                Ver cómo funciona
              </Link>
            </div>
            <p className="hero-footnote">
              <span className="tiny-check">
                <Check size={13} />
              </span>
              Una práctica breve. Sin tarjeta.
            </p>
            <Link className="demo-note" to="/acerca-de-la-demo">
              Estás explorando una demo interactiva
              <ArrowUpRight size={14} />
            </Link>
          </div>
          <HeroArt />
        </div>
        <div className="hero-baseline">
          <span>EL INGLÉS QUE CABE EN TU VIDA</span>
          <div>
            <span>
              <Clock3 size={17} />
              5–10 minutos
            </span>
            <span>
              <MessageCircle size={17} />
              Situaciones cotidianas
            </span>
            <span>
              <ShieldCheck size={17} />A tu ritmo
            </span>
          </div>
        </div>
      </section>
      <section className="situations-section container" id="situaciones">
        <div className="section-heading">
          <h2>
            Hay conversaciones
            <br />
            <em>que quieres poder tener.</em>
          </h2>
          <p>
            De un café a una buena historia.
            <br />
            Empieza por algo que te suene a ti.
          </p>
        </div>
        <div className="editorial-situations">
          <Link
            className="editorial-situation daily"
            to={state.entered ? "/app/conversaciones/fin-de-semana" : "/acceso"}
          >
            <div className="scenario-illustration">
              <MessageCircle size={66} strokeWidth={0.8} />
              <span className="illustration-quote">
                “How was
                <br />
                <em>your weekend?”</em>
              </span>
            </div>
            <div>
              <span className="category">Vida cotidiana · 5–10 min</span>
              <h3>
                Eso que hiciste
                <br />
                el fin de semana.
              </h3>
              <span className="arrow-link">
                Ver situación
                <ArrowUpRight size={20} />
              </span>
            </div>
          </Link>
          <article className="editorial-situation upcoming">
            <div className="scenario-illustration">
              <Luggage size={64} strokeWidth={0.8} />
              <span className="illustration-quote">
                Una ciudad nueva.
                <br />
                <em>Tu misma voz.</em>
              </span>
            </div>
            <div>
              <span className="category">
                Viajes <span className="tag">Próximamente</span>
              </span>
              <h3>
                Encontrar tu camino.
                <br />
                También en inglés.
              </h3>
              <p>Una ruta para tus próximas aventuras.</p>
            </div>
          </article>
          <article className="editorial-situation upcoming">
            <div className="scenario-illustration">
              <BriefcaseBusiness size={64} strokeWidth={0.8} />
              <span className="illustration-quote">
                Tienes una idea.
                <br />
                <em>Que se escuche.</em>
              </span>
            </div>
            <div>
              <span className="category">
                Trabajo <span className="tag">Próximamente</span>
              </span>
              <h3>
                Hacer espacio
                <br />
                para tus ideas.
              </h3>
              <p>Una ruta para expresarte en el trabajo.</p>
            </div>
          </article>
        </div>
      </section>
      <MethodStory />
      <section className="progress-public container">
        <div>
          <h2>
            Escucha lo que
            <br />
            <em>estás logrando.</em>
          </h2>
          <p>
            A veces avanzar suena a una palabra.
            <br />
            Otras, a una historia que ya puedes contar.
          </p>
          <Link className="arrow-link" to={start}>
            Encuentra tu punto de partida
            <ArrowUpRight size={20} />
          </Link>
        </div>
        <div className="comparison">
          <AudioExample
            label="Primer intento · Ejemplo"
            text="Yesterday I go to the cinema."
          />
          <AudioExample
            label="Otra oportunidad · Ejemplo"
            text="Yesterday I went to the cinema."
          />
          <p className="small">
            <Headphones size={15} />
            Ejemplos con la voz de tu navegador. Tu progreso real se construye
            con tus propias prácticas.
          </p>
        </div>
      </section>
      <Pricing compact />
      <section className="faq-section container">
        <h2>
          Antes de
          <br />
          <em>darle al play.</em>
        </h2>
        <div className="faq-list">
          {faqs.slice(0, 4).map(([q, a]) => (
            <details key={q}>
              <summary>
                {q}
                <span>+</span>
              </summary>
              <p>{a}</p>
            </details>
          ))}
          <Link className="arrow-link" to="/ayuda">
            Todas las preguntas
            <ArrowUpRight size={19} />
          </Link>
        </div>
      </section>
      <section className="final-cta container">
        <h2>
          Tu próxima conversación
          <br />
          <em>empieza aquí.</em>
        </h2>
        <Link className="button" to={start}>
          Vamos a practicar
          <ArrowUpRight size={19} />
        </Link>
        <p>Sin hacerlo perfecto. Solo haciéndolo.</p>
      </section>
    </>
  );
}
export function HowPage() {
  return (
    <>
      <div className="container public-page-intro">
        <h1 tabIndex={-1}>
          No es saber más.
          <br />
          <em>Es empezar a decirlo.</em>
        </h1>
        <p>
          Una situación, una conversación y una oportunidad para mejorar.
          <br />
          Así se siente practicar con VERVO.
        </p>
      </div>
      <MethodStory />
      <div className="container center-section">
        <p>
          La escena es una demostración preparada. La demo de práctica usa
          preguntas y correcciones de ejemplo.
        </p>
        <Link className="button" to="/acceso">
          Quiero intentarlo
          <ArrowRight size={18} />
        </Link>
      </div>
    </>
  );
}
export function PlansPage() {
  return (
    <>
      <div className="container public-page-intro">
        <h1 tabIndex={-1}>
          Dale un lugar
          <br />
          <em>a tu inglés.</em>
        </h1>
        <p>
          Planes propuestos para un hábito que sí se siente tuyo.
          <br />
          Puedes recorrer la demo completa sin pagar.
        </p>
      </div>
      <Pricing />
      <div className="container plan-notes">
        <p>
          El diagnóstico y los fallos técnicos no consumirán minutos. La
          propuesta cuenta audio del usuario y tutor, sin pausas ni
          procesamiento. Oferta, impuestos, coste y condiciones por confirmar
          antes de un lanzamiento comercial.
        </p>
        <Link className="arrow-link" to="/terminos">
          Consulta las condiciones de la demo
          <ArrowUpRight size={18} />
        </Link>
      </div>
    </>
  );
}
export function HelpPage() {
  const { state, update } = useStore();
  const [message, setMessage] = useState(state.supportDraft);
  const [saved, setSaved] = useState(false);
  return (
    <div className="container public-document">
      <PageHeading
        title={
          <>
            Una mano,
            <br />
            <em>cuando la necesites.</em>
          </>
        }
      >
        Todo lo que conviene saber antes de practicar.
      </PageHeading>
      <div className="faq-list help-faq">
        {faqs.map(([q, a]) => (
          <details key={q}>
            <summary>
              {q}
              <span>+</span>
            </summary>
            <p>{a}</p>
          </details>
        ))}
      </div>
      <section className="help-contact">
        <h2>¿Te quedó una pregunta?</h2>
        <p>
          En esta demo puedes guardar un borrador en este navegador. El canal de
          soporte real está pendiente de configurar; este formulario no envía
          mensajes.
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            update((s) => ({ ...s, supportDraft: message }));
            setSaved(true);
          }}
        >
          <label htmlFor="support-message">Tu pregunta</label>
          <textarea
            id="support-message"
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              setSaved(false);
            }}
            required
            maxLength={2000}
            placeholder="Cuéntanos qué te gustaría saber…"
          />
          <p className="small">
            Evita incluir información personal.{" "}
            <Link to="/privacidad">Lee la política de privacidad</Link>.
          </p>
          <button className="button" type="submit">
            Guardar borrador
            <Bookmark size={18} />
          </button>
          {saved && (
            <p role="status">
              Borrador guardado en esta pestaña
              {state.acceptedAt ? " y en este navegador" : ""}.
            </p>
          )}
        </form>
      </section>
    </div>
  );
}
export function AboutDemoPage() {
  return (
    <div className="container public-document">
      <PageHeading
        title={
          <>
            Tu primera vuelta
            <br />
            <em>por VERVO.</em>
          </>
        }
      >
        Una demo para probar el diseño y el recorrido completo, sin crear una
        cuenta real.
      </PageHeading>
      <div className="demo-guide">
        <ol>
          {[
            "Entra a la demo. Escribe un nombre opcional y revisa los dos documentos legales.",
            "Elige tu meta y tu rutina. El micrófono es opcional; puedes seguir por escrito.",
            "Completa u omite el diagnóstico orientativo. Abre la situación de tu fin de semana.",
            "Responde “Yesterday I go to the cinema.” para probar una corrección de ejemplo. Envía tu turno y termina la sesión.",
            "Practica la frase con went, guárdala para repasar y visita Mi progreso. Recarga: tu avance sigue aquí.",
          ].map((step, i) => (
            <li key={step}>
              <span>{i + 1}</span>
              <p>{step}</p>
            </li>
          ))}
        </ol>
        <Link className="button" to="/acceso">
          Empezar la demo
          <ArrowRight size={18} />
        </Link>
      </div>
      <div className="demo-limitations">
        <h2>Para probar con tranquilidad.</h2>
        <p>
          El tutor utiliza preguntas preparadas y reglas limitadas para
          correcciones. No evalúa tu nivel ni pronunciación. El acceso es local:
          no crea una identidad ni protege datos mediante contraseña. Los planes
          son simulados, sin cobros.
        </p>
        <p>
          Los textos y preferencias se guardan en este navegador; las
          grabaciones, solo si eliges conservarlas en este dispositivo. No
          envíes información sensible. Desde Cuenta puedes exportar o borrar tus
          datos. Cambiar de navegador o borrar su almacenamiento elimina este
          avance.
        </p>
        <p>
          La demo no incorpora analítica ni publicidad. La página de{" "}
          <Link to="/cookies">cookies y almacenamiento</Link> explica lo que
          utiliza.
        </p>
      </div>
    </div>
  );
}
export function LegalPage({
  kind,
}: {
  kind: "terminos" | "privacidad" | "cookies";
}) {
  const titles = {
    terminos: "Términos y condiciones",
    privacidad: "Política de privacidad",
    cookies: "Política de cookies",
  };
  return (
    <article className="container legal-document">
      <Link className="arrow-link" to="/">
        Volver a VERVO
        <ArrowUpRight size={18} />
      </Link>
      <h1 tabIndex={-1}>{titles[kind]}</h1>
      <p className="legal-version">
        Versión demo 0.1 · 11 de noviembre de 2026
      </p>
      <div className="notice">
        <ShieldCheck size={22} />
        <p>
          Estas condiciones describen una demo privada para revisión. El
          servicio comercial todavía no está activo. Responsable legal,
          contacto, jurisdicción y proveedores de producción están pendientes de
          definir.
        </p>
      </div>
      {kind === "terminos" ? (
        <>
          <h2>1. Qué puedes probar</h2>
          <p>
            VERVO permite explorar situaciones de inglés, responder a preguntas
            preparadas, practicar correcciones de ejemplo y conservar un
            historial local. Está pensado para personas adultas. No emite
            certificaciones oficiales ni garantiza un nivel o un plazo de
            aprendizaje.
          </p>
          <h2>2. Acceso de demostración</h2>
          <p>
            No se crea una cuenta real. El nombre es opcional, no se pide
            contraseña y el acceso solo organiza datos de este navegador.
            Cualquier persona que use este mismo perfil de navegador podría
            verlos. Evita proporcionar datos sensibles y cierra o borra la demo
            desde Cuenta si compartes el dispositivo.
          </p>
          <h2>3. Tutor y correcciones</h2>
          <p>
            Las preguntas están preparadas. Las correcciones reconocen algunas
            construcciones de ejemplo, como “Yesterday I go…” e “I am agree”.
            Una respuesta sin corrección no acredita que sea correcta. La demo
            no evalúa pronunciación; las grabaciones sirven para escucharte.
          </p>
          <h2>4. Planes y pagos</h2>
          <p>
            Los 299 MXN mensuales y 180 minutos son una propuesta visual.
            Activar o cancelar el plan solo cambia un estado de demostración: no
            se cobra, no se crea una suscripción real y no se solicitan
            tarjetas. Precio total, impuestos, reembolsos, renovación y
            condiciones definitivas se establecerán antes de contratar un
            servicio real.
          </p>
          <h2>5. Tus datos y tu control</h2>
          <p>
            Puedes exportar tus textos, eliminar grabaciones o borrar todos los
            datos locales desde Cuenta. El avance no se sincroniza entre
            dispositivos ni tiene una copia de seguridad en un servidor. El uso
            debe ser lícito y respetar derechos de otras personas.
          </p>
          <h2>6. Antes de un lanzamiento comercial</h2>
          <p>
            Se completarán identificación y contacto del prestador, condiciones
            territoriales, derechos del consumidor, soporte, proveedores y
            retención. Este documento no sustituye esos textos finales ni limita
            derechos legales que resulten aplicables.
          </p>
        </>
      ) : kind === "privacidad" ? (
        <>
          <h2>1. Información mínima</h2>
          <p>
            El nombre es opcional. La demo guarda meta, rutina, preferencias,
            aceptación de documentos, textos de práctica, correcciones, repasos
            y estados de demostración del plan. No pide contraseña, teléfono,
            domicilio, identificación, tarjeta ni fecha de nacimiento.
          </p>
          <h2>2. Dónde se guarda</h2>
          <p>
            Los datos de práctica se conservan en localStorage de este
            navegador, tras entrar a la demo. No se envían a un tutor o base de
            datos de VERVO. El alojamiento privado puede requerir iniciar sesión
            en ChatGPT y generar registros técnicos bajo las condiciones de ese
            servicio; esa identidad no se utiliza como cuenta de práctica en
            esta demo.
          </p>
          <h2>3. Micrófono y voz</h2>
          <p>
            El permiso se solicita al pulsar grabar. El audio se captura para
            reproducirlo en la pestaña y el micrófono se detiene al salir,
            pausar o cambiar de pestaña. Solo se conserva una grabación en
            IndexedDB del dispositivo cuando eliges “Guardar en este
            dispositivo”. Ese permiso es independiente de haber leído esta
            política. Las sugerencias de la demo se basan en el texto que
            escribes, no en un análisis del audio.
          </p>
          <h2>4. Ejemplos hablados</h2>
          <p>
            El botón Escuchar usa la función de síntesis de voz que ofrezca tu
            navegador o sistema. Su disponibilidad y procesamiento dependen de
            ese proveedor. No se reproduce audio automáticamente. Puedes
            practicar por escrito sin usar estas funciones.
          </p>
          <h2>5. Finalidades y duración</h2>
          <p>
            El almacenamiento sirve para retomar la demo, revisar prácticas y
            conservar las grabaciones elegidas. Permanece hasta que lo borras o
            el navegador elimina sus datos. No se utiliza para publicidad,
            analítica, identificación biométrica o entrenamiento de modelos.
          </p>
          <h2>6. Control y lanzamiento</h2>
          <p>
            Cuenta permite descargar los textos y preferencias, eliminar audios
            individualmente y restablecer la demo. Borrar el almacenamiento del
            sitio también elimina los datos. Antes de recoger datos para un
            servicio real se publicarán responsable, contacto para derechos,
            base jurídica, encargados, transferencias, plazos y autoridad
            competente según los países de operación.
          </p>
        </>
      ) : (
        <>
          <h2>1. Cookies y tecnologías similares</h2>
          <p>
            El código de esta demo no incorpora cookies de analítica,
            publicidad, píxeles ni rastreadores. Utiliza almacenamiento del
            navegador para la continuidad solicitada por quien prueba el
            recorrido. La capa de acceso privado del alojamiento puede utilizar
            sus propias cookies de autenticación, sujetas a sus condiciones.
          </p>
          <h2>2. Inventario de la aplicación</h2>
          <table>
            <thead>
              <tr>
                <th>Tecnología</th>
                <th>Finalidad</th>
                <th>Duración</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>localStorage: vervo.demo.v1</td>
                <td>Preferencias, aceptación y avance local de la demo.</td>
                <td>Hasta borrarlo o que el navegador lo elimine.</td>
              </tr>
              <tr>
                <td>IndexedDB: vervo-audio-demo</td>
                <td>
                  Grabaciones que decides guardar expresamente en este
                  dispositivo.
                </td>
                <td>Hasta eliminarlas desde Cuenta o el navegador.</td>
              </tr>
            </tbody>
          </table>
          <h2>3. Tu elección</h2>
          <p>
            Antes de entrar puedes consultar estos documentos y decidir si
            continúas. Las grabaciones requieren una acción adicional para
            conservarse. No hay categorías opcionales de analítica o publicidad
            que debas aceptar; por eso no mostramos un banner que pida consentir
            tecnologías inexistentes.
          </p>
          <h2>4. Cómo borrar o retirar</h2>
          <p>
            Desde Cuenta puedes eliminar las grabaciones o restablecer todos los
            datos. También puedes borrar los datos del sitio en la configuración
            de tu navegador. El permiso del micrófono se revoca desde los
            permisos del sitio. La práctica escrita sigue disponible sin
            micrófono.
          </p>
          <h2>5. Si se incorporan tecnologías opcionales</h2>
          <p>
            Se actualizará el inventario y, cuando corresponda, se bloquearán
            hasta obtener consentimiento. Aceptar, Rechazar y Configurar deberán
            ser accesibles con visibilidad equivalente, sin casillas premarcadas
            ni aceptación por continuar navegando. El consentimiento podrá
            retirarse con facilidad.
          </p>
        </>
      )}
      <div className="legal-crosslinks">
        <Link to="/terminos">Términos</Link>
        <Link to="/privacidad">Privacidad</Link>
        <Link to="/cookies">Cookies</Link>
      </div>
    </article>
  );
}
