import { useEffect, useRef, useState } from "react";
import { Mic, Square, Trash2, Download } from "lucide-react";
import { putRecording } from "../lib/audio";
import { useStore } from "../lib/store";
export function VoiceRecorder({
  title,
  onSeconds,
}: {
  title: string;
  onSeconds?: (seconds: number) => void;
}) {
  const { update } = useStore();
  const [recording, setRecording] = useState(false);
  const [audio, setAudio] = useState<{
    blob: Blob;
    url: string;
    seconds: number;
  } | null>(null);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const stream = useRef<MediaStream | null>(null);
  const recorder = useRef<MediaRecorder | null>(null);
  const context = useRef<AudioContext | null>(null);
  const raf = useRef(0);
  const meter = useRef<HTMLDivElement>(null);
  const mounted = useRef(true);
  const starting = useRef(false);
  const audioRef = useRef(audio);
  audioRef.current = audio;
  const stop = () => {
    if (recorder.current?.state === "recording") recorder.current.stop();
    stream.current?.getTracks().forEach((t) => t.stop());
    cancelAnimationFrame(raf.current);
    context.current?.close().catch(() => {});
    setRecording(false);
  };
  useEffect(() => {
    mounted.current = true;
    const hide = () => {
      if (document.hidden) stop();
    };
    document.addEventListener("visibilitychange", hide);
    return () => {
      mounted.current = false;
      document.removeEventListener("visibilitychange", hide);
      if (recorder.current) {
        recorder.current.ondataavailable = null;
        recorder.current.onstop = null;
      }
      stop();
      if (audioRef.current) URL.revokeObjectURL(audioRef.current.url);
    };
  }, []);
  const start = async () => {
    if (starting.current) return;
    setError("");
    setSaved(false);
    if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) {
      setError(
        "Este navegador no permite grabar aquí. Puedes continuar por escrito.",
      );
      return;
    }
    try {
      starting.current = true;
      const media = await navigator.mediaDevices.getUserMedia({ audio: true });
      starting.current = false;
      if (!mounted.current || document.hidden) {
        media.getTracks().forEach((t) => t.stop());
        return;
      }
      stream.current = media;
      const mr = new MediaRecorder(media);
      recorder.current = mr;
      const chunks: BlobPart[] = [];
      const started = performance.now();
      mr.ondataavailable = (event) => {
        if (event.data.size) chunks.push(event.data);
      };
      mr.onstop = () => {
        const blob = new Blob(chunks, { type: mr.mimeType });
        const seconds = Math.max(
          1,
          Math.round((performance.now() - started) / 1000),
        );
        if (audioRef.current) URL.revokeObjectURL(audioRef.current.url);
        setAudio({ blob, url: URL.createObjectURL(blob), seconds });
        onSeconds?.(seconds);
      };
      const ac = new AudioContext();
      context.current = ac;
      const analyser = ac.createAnalyser();
      analyser.fftSize = 128;
      ac.createMediaStreamSource(media).connect(analyser);
      const frequencies = new Uint8Array(analyser.frequencyBinCount);
      const tick = () => {
        if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
        analyser.getByteFrequencyData(frequencies);
        const bars = meter.current?.querySelectorAll("i");
        bars?.forEach((bar, i) => {
          (bar as HTMLElement).style.transform =
            `scaleY(${0.18 + frequencies[i * 2] / 100})`;
        });
        raf.current = requestAnimationFrame(tick);
      };
      mr.start();
      setRecording(true);
      if (!matchMedia("(prefers-reduced-motion: reduce)").matches) tick();
    } catch (e) {
      starting.current = false;
      stop();
      if (mounted.current)
        setError(
          (e as DOMException).name === "NotAllowedError"
            ? "El micrófono está bloqueado. Actívalo en los permisos de tu navegador o continúa por escrito."
            : (e as DOMException).name === "NotSupportedError"
              ? "La captura de audio no está disponible en este navegador. Puedes continuar por escrito."
              : "No pudimos iniciar el micrófono. Comprueba que esté conectado y disponible, o continúa por escrito.",
        );
    }
  };
  const save = async () => {
    if (!audio) return;
    try {
      const id = crypto.randomUUID();
      await putRecording(id, audio.blob);
      update((s) => ({
        ...s,
        recordings: [
          ...s.recordings,
          {
            id,
            name: title,
            createdAt: new Date().toISOString(),
            seconds: audio.seconds,
          },
        ],
      }));
      setSaved(true);
    } catch {
      setError(
        "No se pudo guardar el audio. Puedes escucharlo en esta pestaña o volver a grabar.",
      );
    }
  };
  return (
    <div className="voice-recorder">
      <div className="recorder-main">
        <button
          className={`mic-button ${recording ? "recording" : ""}`}
          type="button"
          onClick={recording ? stop : start}
          aria-label={recording ? "Detener grabación" : "Grabar mi voz"}
        >
          {recording ? <Square size={24} /> : <Mic size={26} />}
        </button>
        <div>
          <strong>{recording ? "Grabando tu voz" : "Dilo con tu voz"}</strong>
          <p className="small">
            {recording
              ? "Pulsa detener cuando termines."
              : "Grabación local opcional. Sin evaluación de pronunciación."}
          </p>
        </div>
        <div className="audio-meter" ref={meter} aria-hidden="true">
          {Array.from({ length: 16 }, (_, i) => (
            <i key={i} />
          ))}
        </div>
      </div>
      {audio && !recording && (
        <div className="recording-result">
          <audio src={audio.url} controls aria-label="Escuchar mi grabación" />
          <div className="inline-actions">
            <button
              className="text-button"
              type="button"
              onClick={save}
              disabled={saved}
            >
              <Download size={16} />
              {saved
                ? "Guardada en este dispositivo"
                : "Guardar en este dispositivo"}
            </button>
            <button
              className="text-button"
              type="button"
              onClick={() => {
                URL.revokeObjectURL(audio.url);
                setAudio(null);
              }}
            >
              <Trash2 size={16} />
              Descartar
            </button>
          </div>
          <p className="small">
            Solo se conserva si eliges guardarla. Puedes borrarla desde Cuenta.
          </p>
        </div>
      )}
      {error && (
        <p role="alert" className="form-error">
          {error}
        </p>
      )}
    </div>
  );
}
