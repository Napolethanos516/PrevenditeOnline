import { useState } from "react";
import { Shield, Lock } from "lucide-react";

type Props = {
  onOpenPrivacy: () => void;
};

const STORAGE_KEY = "age_gate_accepted";

export default function AgeGate({ onOpenPrivacy }: Props) {
  const [show, setShow] = useState(() => {
    try {
      return sessionStorage.getItem(STORAGE_KEY) !== "true";
    } catch {
      return true;
    }
  });
  const [ageConfirmed, setAgeConfirmed] = useState(false);
  const [privacyConfirmed, setPrivacyConfirmed] = useState(false);
  const [privacyOpened, setPrivacyOpened] = useState(false);
  const [error, setError] = useState("");

  const handleOpenPrivacy = () => {
    setPrivacyOpened(true);
    onOpenPrivacy();
  };

  const handlePrivacyToggle = (checked: boolean) => {
    if (checked && !privacyOpened) {
      setError("Devi prima aprire e leggere la Privacy Policy prima di poterla accettare.");
      return;
    }
    setPrivacyConfirmed(checked);
    setError("");
  };

  const handleEnter = () => {
    if (!ageConfirmed || !privacyConfirmed) {
      setError("Devi confermare di avere almeno 14 anni e accettare la Privacy Policy per accedere al sito.");
      return;
    }
    try {
      sessionStorage.setItem(STORAGE_KEY, "true");
    } catch {
      // ignore storage errors
    }
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-ink-950/95 backdrop-blur-md animate-fade-in p-4">
      <div className="relative w-full max-w-md rounded-2xl border border-ink-700 bg-ink-900 p-8 animate-scale-in shadow-2xl" role="dialog" aria-modal="true" aria-labelledby="age-gate-title">
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-neon/10">
            <Lock className="h-8 w-8 text-neon" />
          </div>
          <h1 id="age-gate-title" className="font-display text-3xl text-white mb-3 tracking-wide">Accesso al sito</h1>
          <p className="text-sm text-ink-400 leading-relaxed">
            Per accedere agli eventi e alle prevendite devi confermare di avere almeno 14 anni e
            accettare la nostra Privacy Policy.
          </p>
        </div>

        <div className="space-y-4 mb-6">
         <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={ageConfirmed}
              onChange={(e) => { setAgeConfirmed(e.target.checked); setError(""); }}
              className="mt-0.5 h-4 w-4 shrink-0 rounded border-ink-600 bg-ink-950 text-neon focus:ring-neon focus:ring-offset-ink-900"
            />
            <span className="text-sm text-ink-200 leading-relaxed">
              Dichiaro di avere almeno 14 anni.
            </span>
          </label>

          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={privacyConfirmed}
              onChange={(e) => handlePrivacyToggle(e.target.checked)}
              className="mt-0.5 h-4 w-4 shrink-0 rounded border-ink-600 bg-ink-950 text-neon focus:ring-neon focus:ring-offset-ink-900"
            />
            <span className="text-sm text-ink-200 leading-relaxed">
              Ho letto la{" "}
              <button
                type="button"
                onClick={handleOpenPrivacy}
                className="inline-flex items-center gap-0.5 rounded text-neon underline hover:text-neon-dark transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon"
              >
                <Shield className="inline h-3 w-3" />
                Privacy Policy
              </button>
              {" "}e acconsento ad essere ricontattato via WhatsApp o Instagram solo ed esclusivamente per ricevere informazioni e concordare l'acquisto delle prevendite per gli eventi.
              {!privacyOpened && (
                <span className="block mt-1 text-xs text-amber-400">
                  Apri la Privacy Policy per poterla accettare.
                </span>
              )}
            </span>
          </label>
        </div>

        <div className="mb-6 rounded-lg border border-amber-700/40 bg-amber-950/20 px-4 py-2.5">
          <p className="text-xs text-amber-300 leading-relaxed text-center">
            Ingresso agli eventi consentito dai 14 anni in su. Somministrazione di alcolici tassativamente vietata ai minori di 18 anni.
          </p>
        </div>

        {error && (
          <p className="mb-4 text-sm text-red-400 animate-fade-in" role="alert">{error}</p>
        )}

        <button
          onClick={handleEnter}
          disabled={!ageConfirmed || !privacyConfirmed}
          className="w-full rounded-lg bg-ink-100 px-4 py-3.5 text-sm font-bold text-ink-950 transition-all hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon"
        >
          Entra nel sito
        </button>
      </div>
    </div>
  );
}
