import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  AudioLines,
  Bookmark,
  Check,
  ArrowUpRight,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { registerPublicScroller } from "../lib/scroll";
gsap.registerPlugin(ScrollTrigger);
export function MethodStory() {
  const scene = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [animated, setAnimated] = useState(false);
  const [staticMode, setStaticMode] = useState(false);
  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add(
      "(min-width: 1200px) and (prefers-reduced-motion: no-preference)",
      () => {
        if (staticMode || !scene.current) return;
        const el = scene.current;
        const lenis = new Lenis({
          autoRaf: false,
          duration: 0.9,
          smoothWheel: true,
          anchors: false,
          prevent: (node) => node.tagName === "DIALOG",
        });
        lenis.on("scroll", ScrollTrigger.update);
        const unregisterScroller = registerPublicScroller(lenis);
        const nativeKey = (event: KeyboardEvent) => {
          if (
            ![
              "ArrowDown",
              "ArrowUp",
              "PageDown",
              "PageUp",
              "Home",
              "End",
              " ",
            ].includes(event.key)
          )
            return;
          if (
            event.target instanceof Element &&
            event.target.closest(
              "input,textarea,select,button,[contenteditable]",
            )
          )
            return;
          lenis.stop();
          lenis.start();
        };
        document.addEventListener("keydown", nativeKey);
        const tick = (time: number) => lenis.raf(time * 1000);
        gsap.ticker.add(tick);
        gsap.ticker.lagSmoothing(0);
        const hero = document.querySelector(".hero-art");
        if (hero)
          gsap.fromTo(
            hero,
            { scale: 0.96, y: 12 },
            {
              scale: 1,
              y: -12,
              ease: "none",
              scrollTrigger: {
                trigger: ".hero",
                start: "top top",
                end: "+=400",
                scrub: true,
              },
            },
          );
        el.dataset.animated = "true";
        if (el.getBoundingClientRect().height <= innerHeight - 112) {
          setAnimated(true);
          let last = 0;
          const panels = el.querySelectorAll<HTMLElement>(".story-step");
          gsap.set(panels, { autoAlpha: 0, y: 16 });
          gsap.set(panels[0], { autoAlpha: 1, y: 0 });
          const tl = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              id: "vervo-learning-story",
              trigger: el,
              start: "top 96px",
              end: () => `+=${innerHeight * 1.8}`,
              pin: true,
              scrub: true,
              invalidateOnRefresh: true,
              onUpdate: (self) => {
                const next =
                  self.progress < 0.31 ? 0 : self.progress < 0.64 ? 1 : 2;
                if (next !== last) {
                  last = next;
                  setActive(next);
                }
              },
            },
          });
          tl.to({}, { duration: 0.27 })
            .to(panels[0], { autoAlpha: 0, y: -16, duration: 0.04 }, 0.27)
            .to(panels[1], { autoAlpha: 1, y: 0, duration: 0.04 }, 0.29)
            .to(panels[1], { autoAlpha: 0, y: -16, duration: 0.04 }, 0.6)
            .to(panels[2], { autoAlpha: 1, y: 0, duration: 0.04 }, 0.62)
            .to({}, { duration: 0.34 }, 0.66);
        } else {
          delete el.dataset.animated;
        }
        let alive = true;
        document.fonts.ready.then(() => {
          if (alive) ScrollTrigger.refresh();
        });
        return () => {
          alive = false;
          delete el.dataset.animated;
          gsap.ticker.remove(tick);
          unregisterScroller();
          document.removeEventListener("keydown", nativeKey);
          lenis.destroy();
          setAnimated(false);
          setActive(0);
        };
      },
    );
    return () => mm.revert();
  }, [staticMode]);
  return (
    <section
      className="method-section"
      id="metodo"
      aria-label="Cómo una conversación se transforma en aprendizaje"
    >
      <div className="container">
        <div className="story-stage" ref={scene}>
          <div className="story-copy">
            <h2>
              Habla.
              <br />
              Entiende.
              <br />
              <em>Vuelve a intentarlo.</em>
            </h2>
            <p>
              Lo que hoy te cuesta puede ser lo que mañana te sale con
              naturalidad.
            </p>
            <ol className="story-progress">
              {["Habla de tu mundo", "Llévate algo claro", "Hazlo tuyo"].map(
                (text, i) => (
                  <li
                    key={text}
                    className={!animated || active === i ? "current" : ""}
                  >
                    <span>{String(i + 1).padStart(2, "0")}</span>
                    {text}
                  </li>
                ),
              )}
            </ol>
            <div className="story-controls">
              <button
                type="button"
                className="text-button"
                onClick={() => setStaticMode(!staticMode)}
              >
                {staticMode
                  ? "Activar animación de scroll"
                  : "Ver los pasos sin animación"}
              </button>
              <Link to="/planes">
                Saltar a planes
                <ArrowUpRight size={15} />
              </Link>
            </div>
          </div>
          <div className="story-panels">
            {[0, 1, 2].map((i) => (
              <article
                key={i}
                className="story-step"
                data-step={i}
                aria-hidden={animated && active !== i}
                inert={animated && active !== i}
              >
                <div className="artifact-top">
                  <span>
                    {["01 / CONVERSACIÓN", "02 / CORRECCIÓN", "03 / REPASO"][i]}
                  </span>
                  <span className="tag">Demostración</span>
                </div>
                {i === 0 ? (
                  <>
                    <div className="story-audio">
                      <AudioLines size={72} strokeWidth={0.8} />
                    </div>
                    <p className="artifact-prompt">
                      “What did you do yesterday?”
                    </p>
                    <div className="speech-bubble">
                      Yesterday I <span className="word-underline">go</span> to
                      the cinema.
                    </div>
                    <span className="small">
                      Una idea que ya puedes expresar.
                    </span>
                  </>
                ) : i === 1 ? (
                  <>
                    <div className="correction-label">Dijiste</div>
                    <p className="before-phrase">
                      Yesterday I <s>go</s> to the cinema.
                    </p>
                    <div className="correction-label">Puedes decir</div>
                    <p className="after-phrase">
                      Yesterday I <span>went</span>
                      <br />
                      to the cinema.
                    </p>
                    <p className="correction-explanation">
                      Para hablar de ayer, aquí usamos <strong>went</strong>.
                    </p>
                  </>
                ) : (
                  <>
                    <div className="saved-marker">
                      <Bookmark size={18} />
                      Un repaso para ti
                      <Check size={17} />
                    </div>
                    <h3>
                      Una frase nueva.
                      <br />
                      <em>Otra oportunidad.</em>
                    </h3>
                    <p>What did you do last weekend?</p>
                    <div className="review-prompt">
                      Usa <strong>went</strong> en una situación diferente.
                    </div>
                    <Link className="button" to="/acceso">
                      Practicar con mi voz
                      <ArrowRight size={18} />
                    </Link>
                  </>
                )}
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
