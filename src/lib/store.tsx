import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { correctionsFor, type Correction } from "./content";
export const STORAGE_KEY = "vervo.demo.v1";
export type Turn = {
  id: string;
  text: string;
  role: "user" | "tutor";
  at: string;
};
export type Session = {
  id: string;
  scenarioId: string;
  turns: Turn[];
  createdAt: string;
  completedAt?: string;
  corrections: Correction[];
  voiceSeconds: number;
  hints: number;
};
export type Note = Correction & {
  sessionId: string;
  savedAt: string;
  practiced: boolean;
  note: string;
};
export type Recording = {
  id: string;
  name: string;
  createdAt: string;
  seconds: number;
};
export type State = {
  version: 1;
  entered: boolean;
  name: string;
  acceptedAt?: string;
  acceptedDocuments?: {
    termsVersion: string;
    privacyVersion: string;
    at: string;
  };
  onboarding: {
    step: number;
    goal: string;
    confidence: string;
    minutes: number;
    complete: boolean;
  };
  diagnostic: { complete: boolean; skipped: boolean; answer: string };
  sessions: Session[];
  notebook: Note[];
  recordings: Recording[];
  plan: "free" | "monthly";
  renewal: boolean;
  supportDraft: string;
  subtitle: boolean;
  speed: number;
  failNextTurn: boolean;
};
export const initialState: State = {
  version: 1,
  entered: false,
  name: "",
  onboarding: {
    step: 0,
    goal: "Vida cotidiana",
    confidence: "Me cuesta empezar",
    minutes: 5,
    complete: false,
  },
  diagnostic: { complete: false, skipped: false, answer: "" },
  sessions: [],
  notebook: [],
  recordings: [],
  plan: "free",
  renewal: true,
  supportDraft: "",
  subtitle: true,
  speed: 1,
  failNextTurn: false,
};
function load(): { state: State; error: string } {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { state: initialState, error: "" };
    const value = JSON.parse(raw);
    if (
      value.version !== 1 ||
      typeof value.name !== "string" ||
      typeof value.entered !== "boolean" ||
      !Array.isArray(value.sessions) ||
      !Array.isArray(value.notebook) ||
      !value.onboarding ||
      !value.diagnostic ||
      !Number.isInteger(value.onboarding.step) ||
      value.onboarding.step < 0 ||
      value.onboarding.step > 3 ||
      !value.sessions.every(
        (s: Session) =>
          typeof s.id === "string" &&
          typeof s.scenarioId === "string" &&
          Array.isArray(s.turns) &&
          s.turns.every((t) => typeof t.text === "string") &&
          Array.isArray(s.corrections),
      )
    )
      throw new Error("format");
    return { state: { ...initialState, ...value }, error: "" };
  } catch {
    return {
      state: initialState,
      error:
        "No pudimos recuperar el avance guardado. Puedes restablecer esta demo para empezar de nuevo.",
    };
  }
}
type Context = {
  state: State;
  update: (fn: (s: State) => State) => void;
  storageError: string;
  createSession: (scenarioId: string, opening: string) => string;
  reset: () => void;
  saveNote: (correction: Correction, sessionId: string) => void;
};
const Store = createContext<Context | null>(null);
export function StoreProvider({ children }: { children: ReactNode }) {
  const [loaded] = useState(load);
  const [state, setState] = useState<State>(loaded.state);
  const [storageError, setStorageError] = useState(loaded.error);
  useEffect(() => {
    if (!state.acceptedAt) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      setStorageError("");
    } catch {
      setStorageError(
        "El navegador no permitió guardar el avance. Puedes seguir en esta pestaña o exportar tus datos desde Cuenta.",
      );
    }
  }, [state]);
  const createSession = (scenarioId: string, opening: string) => {
    const existing = state.sessions.find(
      (s) => s.scenarioId === scenarioId && !s.completedAt,
    );
    if (existing) return existing.id;
    const id = crypto.randomUUID();
    setState((s) => ({
      ...s,
      sessions: [
        ...s.sessions,
        {
          id,
          scenarioId,
          turns: [
            {
              id: crypto.randomUUID(),
              role: "tutor",
              text: opening,
              at: new Date().toISOString(),
            },
          ],
          createdAt: new Date().toISOString(),
          corrections: [],
          voiceSeconds: 0,
          hints: 0,
        },
      ],
    }));
    return id;
  };
  const reset = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      indexedDB.deleteDatabase("vervo-audio-demo");
    } catch {}
    setState(initialState);
    setStorageError("");
  };
  const saveNote = (correction: Correction, sessionId: string) =>
    setState((s) =>
      s.notebook.some(
        (n) => n.id === correction.id && n.sessionId === sessionId,
      )
        ? s
        : {
            ...s,
            notebook: [
              ...s.notebook,
              {
                ...correction,
                sessionId,
                savedAt: new Date().toISOString(),
                practiced: false,
                note: "",
              },
            ],
          },
    );
  return (
    <Store.Provider
      value={{
        state,
        update: setState,
        storageError,
        createSession,
        reset,
        saveNote,
      }}
    >
      {children}
    </Store.Provider>
  );
}
export function useStore() {
  const value = useContext(Store);
  if (!value) throw new Error("StoreProvider missing");
  return value;
}
export function completeSession(session: Session): Session {
  return {
    ...session,
    completedAt: new Date().toISOString(),
    corrections: correctionsFor(
      session.turns.filter((t) => t.role === "user").map((t) => t.text),
    ),
  };
}
export function downloadData(state: State) {
  const url = URL.createObjectURL(
    new Blob([JSON.stringify(state, null, 2)], { type: "application/json" }),
  );
  const link = document.createElement("a");
  link.href = url;
  link.download = "vervo-mi-demo.json";
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
